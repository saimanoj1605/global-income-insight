import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const navLinks = [
  { path: '/home', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/overview', label: 'Overview' },
  { path: '/datasets', label: 'Datasets' },
  { path: '/feedback', label: 'Feedback' },
  { path: '/logout', label: 'Logout' },
];

const Navbar = ({ darkMode, toggleDarkMode }: NavbarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' }).then(({ data }) => setIsAdmin(!!data));
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  if (!user) return null;

  const allLinks = isAdmin ? [...navLinks.slice(0, -1), { path: '/admin', label: 'Admin' }, navLinks[navLinks.length - 1]] : navLinks;

  return (
    <nav className="gradient-nav sticky top-0 z-50 shadow-elevated">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/home" className="text-primary-foreground font-display text-xl font-bold tracking-tight">
            Global Income Inequality Distribution
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {allLinks.map(link => (
              <Link key={link.path} to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.path
                    ? 'bg-primary/20 text-primary-foreground'
                    : 'text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary/10'
                } ${link.path === '/admin' ? 'flex items-center gap-1' : ''}`}>
                {link.path === '/admin' && <ShieldAlert size={14} />}
                {link.label}
              </Link>
            ))}
            <button onClick={toggleDarkMode}
              className="ml-2 p-2 rounded-md text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary/10 transition-colors">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggleDarkMode} className="p-2 text-primary-foreground/70">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-primary-foreground">
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden gradient-nav border-t border-primary/10 pb-4">
          {allLinks.map(link => (
            <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}
              className={`block px-4 py-3 text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? 'text-primary-foreground bg-primary/20'
                  : 'text-primary-foreground/70 hover:text-primary-foreground'
              }`}>
              {link.path === '/admin' ? '🛡️ ' : ''}{link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
