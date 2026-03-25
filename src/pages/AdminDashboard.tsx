import { useState, useEffect } from 'react';
import PageWrapper from '@/components/PageWrapper';
import SectionCard from '@/components/SectionCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Eye, BarChart3 } from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  city: string;
  state: string;
  country: string;
  role: string;
}

interface Viewer {
  _id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  feedback: string;
  liked: boolean;
  timestamp: string;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalUsers: 0, totalViewers: 0 });
  const [users, setUsers] = useState<User[]>([]);
  const [viewers, setViewers] = useState<Viewer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchStats();
      fetchUsers();
      fetchViewers();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchViewers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/admin/viewers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setViewers(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching viewers:', err);
      setLoading(false);
    }
  };

  if (user?.role !== 'admin') {
    return <div>Access denied</div>;
  }

  return (
    <PageWrapper>
      <section className="gradient-hero py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Admin Dashboard
          </h1>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16 space-y-8">
        <div className="grid sm:grid-cols-3 gap-6">
          <SectionCard>
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Total Users</div>
                <div className="text-xl font-bold text-foreground">{stats.totalUsers}</div>
              </div>
            </div>
          </SectionCard>

          <SectionCard>
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-8 h-8 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Total Viewers</div>
                <div className="text-xl font-bold text-foreground">{stats.totalViewers}</div>
              </div>
            </div>
          </SectionCard>

          <SectionCard>
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-8 h-8 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Total Likes</div>
                <div className="text-xl font-bold text-foreground">{viewers.filter(v => v.liked).length}</div>
              </div>
            </div>
          </SectionCard>
        </div>

        <SectionCard>
          <h3 className="font-display text-lg font-bold text-foreground mb-4">Viewer List</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {viewers.map(viewer => (
              <div key={viewer._id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-medium text-foreground">{viewer.name}</p>
                  <p className="text-xs text-muted-foreground">{viewer.city}, {viewer.state}, {viewer.country}</p>
                  <p className="text-xs text-muted-foreground">Feedback: {viewer.feedback}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{new Date(viewer.timestamp).toLocaleDateString()}</p>
                  {viewer.liked && <span className="text-green-500">Liked</span>}
                </div>
              </div>
            ))}
            {viewers.length === 0 && !loading && (
              <p className="text-sm text-muted-foreground text-center py-4">No viewers yet.</p>
            )}
          </div>
        </SectionCard>
      </section>
    </PageWrapper>
  );
};

export default AdminDashboard;