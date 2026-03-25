import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageWrapper from '@/components/PageWrapper';
import SectionCard from '@/components/SectionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ShieldAlert, Ban, CheckCircle, Trash2, Users, MessageSquare, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

interface BlockedUser {
  id: string;
  user_id: string;
  email: string;
  blocked_at: string;
  reason: string;
}

interface ProfileUser {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
}

const maskEmail = (email: string) => {
  const [local, domain] = email.split('@');
  if (!domain) return '***';
  return `${local[0]}${'*'.repeat(Math.max(local.length - 2, 1))}${local.length > 1 ? local[local.length - 1] : ''}@${domain}`;
};

const AdminPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [allUsers, setAllUsers] = useState<ProfileUser[]>([]);
  const [blockEmail, setBlockEmail] = useState('');
  const [blockReason, setBlockReason] = useState('');
  const [loadingBlock, setLoadingBlock] = useState(false);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [suggestionCount, setSuggestionCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' }).then(({ data }) => {
      setIsAdmin(!!data);
      setLoading(false);
      if (data) {
        fetchBlockedUsers();
        fetchAllUsers();
        fetchStats();
      }
    });
  }, [user]);

  const fetchBlockedUsers = async () => {
    const { data } = await supabase.from('blocked_users').select('*');
    if (data) setBlockedUsers(data);
  };

  const fetchAllUsers = async () => {
    const { data } = await supabase.from('profiles').select('user_id, email, first_name, last_name');
    if (data) setAllUsers(data);
  };

  const fetchStats = async () => {
    const { count: fb } = await supabase.from('feedback').select('*', { count: 'exact', head: true });
    const { count: sg } = await supabase.from('suggestions').select('*', { count: 'exact', head: true });
    setFeedbackCount(fb || 0);
    setSuggestionCount(sg || 0);
  };

  const handleBlockByEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockEmail.trim()) { toast.error('Enter an email to block'); return; }
    if (blockEmail === user?.email) { toast.error("You can't block yourself"); return; }
    setLoadingBlock(true);
    const { data: profile } = await supabase.from('profiles').select('user_id, email').eq('email', blockEmail.trim()).maybeSingle();
    if (!profile) { toast.error('User not found'); setLoadingBlock(false); return; }
    const { error } = await supabase.from('blocked_users').insert({
      user_id: profile.user_id, email: profile.email, blocked_by: user!.id, reason: blockReason || 'Blocked by admin',
    });
    setLoadingBlock(false);
    if (error) { toast.error(error.code === '23505' ? 'Already blocked' : error.message); }
    else { toast.success('User blocked'); setBlockEmail(''); setBlockReason(''); fetchBlockedUsers(); }
  };

  const handleBlockFromList = async (profile: ProfileUser) => {
    if (profile.user_id === user?.id) { toast.error("You can't block yourself"); return; }
    if (blockedUsers.some(b => b.user_id === profile.user_id)) { toast.error('Already blocked'); return; }
    const { error } = await supabase.from('blocked_users').insert({
      user_id: profile.user_id, email: profile.email, blocked_by: user!.id, reason: 'Blocked by admin',
    });
    if (error) toast.error(error.message);
    else { toast.success('User blocked'); fetchBlockedUsers(); }
  };

  const handleUnblock = async (blocked: BlockedUser) => {
    const { error } = await supabase.from('blocked_users').delete().eq('id', blocked.id);
    if (error) toast.error(error.message);
    else { toast.success('User unblocked'); fetchBlockedUsers(); }
  };

  const isUserBlocked = (userId: string) => blockedUsers.some(b => b.user_id === userId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-section">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <PageWrapper>
        <section className="gradient-hero py-16 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Access Denied
            </motion.h1>
          </div>
        </section>
        <section className="max-w-3xl mx-auto px-4 py-16 text-center">
          <SectionCard>
            <ShieldAlert className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Admin Only</h2>
            <p className="text-muted-foreground mb-4">This page is restricted to administrators only. You do not have permission to access this area.</p>
            <Button onClick={() => navigate('/home')}>Go to Home</Button>
          </SectionCard>
        </section>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <section className="gradient-hero py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Admin Panel
          </motion.h1>
          <p className="text-primary-foreground/80 text-lg">Manage users, view stats, and control your website.</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-16 space-y-8">
        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-6">
          <SectionCard>
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Total Users</div>
                <div className="text-2xl font-bold text-foreground">{allUsers.length}</div>
              </div>
            </div>
          </SectionCard>
          <SectionCard>
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-accent" />
              <div>
                <div className="text-sm text-muted-foreground">Feedback</div>
                <div className="text-2xl font-bold text-foreground">{feedbackCount}</div>
              </div>
            </div>
          </SectionCard>
          <SectionCard>
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Suggestions</div>
                <div className="text-2xl font-bold text-foreground">{suggestionCount}</div>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Block by email */}
        <SectionCard>
          <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Ban size={20} className="text-destructive" /> Block User by Email
          </h3>
          <form onSubmit={handleBlockByEmail} className="space-y-3">
            <div>
              <Label htmlFor="block-email">Email Address</Label>
              <Input id="block-email" type="email" value={blockEmail} onChange={e => setBlockEmail(e.target.value)} placeholder="user@email.com" />
            </div>
            <div>
              <Label htmlFor="block-reason">Reason (optional)</Label>
              <Input id="block-reason" value={blockReason} onChange={e => setBlockReason(e.target.value)} placeholder="Reason for blocking" />
            </div>
            <Button type="submit" variant="destructive" disabled={loadingBlock}>
              {loadingBlock ? 'Blocking...' : 'Block User'}
            </Button>
          </form>
        </SectionCard>

        {/* User list */}
        <SectionCard>
          <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Users size={20} className="text-primary" /> Registered Users
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {allUsers.filter(u => u.user_id !== user?.id).map(u => (
              <div key={u.user_id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-medium text-foreground">{u.first_name} {u.last_name}</p>
                  <p className="text-xs text-muted-foreground">{maskEmail(u.email)}</p>
                </div>
                {isUserBlocked(u.user_id) ? (
                  <span className="text-xs text-destructive flex items-center gap-1"><Ban size={14} /> Blocked</span>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => handleBlockFromList(u)} className="text-destructive border-destructive/30 hover:bg-destructive/10">
                    Block
                  </Button>
                )}
              </div>
            ))}
            {allUsers.filter(u => u.user_id !== user?.id).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No other users registered yet.</p>
            )}
          </div>
        </SectionCard>

        {/* Blocked users */}
        <SectionCard>
          <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <ShieldAlert size={20} className="text-destructive" /> Blocked Users
          </h3>
          {blockedUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" /> No users are currently blocked.
            </p>
          ) : (
            <div className="space-y-2">
              {blockedUsers.map(b => (
                <div key={b.id} className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                  <div>
                    <p className="text-sm font-medium text-foreground">{maskEmail(b.email)}</p>
                    <p className="text-xs text-muted-foreground">Blocked: {new Date(b.blocked_at).toLocaleDateString()} — {b.reason}</p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => handleUnblock(b)} className="text-green-600 hover:bg-green-50">
                    <Trash2 size={14} className="mr-1" /> Unblock
                  </Button>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </section>
    </PageWrapper>
  );
};

export default AdminPage;
