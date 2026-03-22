import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageWrapper from '@/components/PageWrapper';
import SectionCard from '@/components/SectionCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Clock, Users } from 'lucide-react';
import { toast } from 'sonner';

const LogoutPage = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [sessionDuration] = useState(() => {
    const mins = Math.floor(Math.random() * 120) + 5;
    if (mins >= 60) return `${Math.floor(mins / 60)}h ${mins % 60}m`;
    return `${mins} minutes`;
  });
  const [viewerCount] = useState(() => Math.floor(Math.random() * 50) + 10);

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <PageWrapper>
      <section className="gradient-hero py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4"
          >
            Session & Logout
          </motion.h1>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-4 py-16 space-y-8">
        <div className="grid sm:grid-cols-2 gap-6">
          <SectionCard>
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-8 h-8 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Session Duration</div>
                <div className="text-xl font-bold text-foreground">{sessionDuration}</div>
              </div>
            </div>
          </SectionCard>

          <SectionCard>
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Active Viewers</div>
                <div className="text-xl font-bold text-foreground">{viewerCount} users</div>
              </div>
            </div>
          </SectionCard>
        </div>

        <SectionCard>
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Logged in as <span className="font-medium text-foreground">{user?.email}</span>
            </p>
            <Button onClick={handleLogout} variant="destructive" size="lg" className="gap-2">
              <LogOut size={18} /> Logout
            </Button>
          </div>
        </SectionCard>
      </section>
    </PageWrapper>
  );
};

export default LogoutPage;
