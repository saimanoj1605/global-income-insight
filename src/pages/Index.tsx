import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff, BarChart3, Globe2, TrendingUp } from 'lucide-react';

const Index = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp, resetPassword, user } = useAuth();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [resetEmail, setResetEmail] = useState('');

  if (user) {
    navigate('/home');
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill all fields'); return; }
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) { toast.error(error.message); } else { navigate('/home'); }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) { toast.error('Please fill all fields'); return; }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    const { error } = await signUp(email, password, firstName, lastName);
    setLoading(false);
    if (error) { toast.error(error.message); } else { toast.success('Account created! Please check your email to verify.'); }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) { toast.error('Enter your email'); return; }
    setLoading(true);
    const { error } = await resetPassword(resetEmail);
    setLoading(false);
    if (error) { toast.error(error.message); } else { toast.success('Reset link sent to your email!'); setShowForgotPassword(false); }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated bg elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-accent/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="text-primary-foreground space-y-6 hidden md:block"
        >
          <div className="flex items-center gap-3 mb-4">
            <Globe2 className="w-10 h-10 text-accent" />
            <BarChart3 className="w-8 h-8 text-accent/70" />
            <TrendingUp className="w-9 h-9 text-accent/50" />
          </div>
          <h1 className="font-display text-4xl lg:text-5xl font-bold leading-tight">
            Interactive Analytics Dashboard
          </h1>
          <p className="text-lg text-primary-foreground/80 leading-relaxed">
            Explore global income distribution patterns across 55 countries and 25 years of economic data.
          </p>
          <div className="flex gap-6 pt-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">55</div>
              <div className="text-sm text-primary-foreground/60">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">25</div>
              <div className="text-sm text-primary-foreground/60">Years</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">9</div>
              <div className="text-sm text-primary-foreground/60">Indicators</div>
            </div>
          </div>
        </motion.div>

        {/* Right - Auth form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass rounded-xl p-8 shadow-elevated border border-border/30"
        >
          {/* Mobile branding */}
          <div className="md:hidden text-center mb-6">
            <h1 className="font-display text-2xl font-bold text-foreground">Global Income Analytics</h1>
          </div>

          {showForgotPassword ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-foreground">Reset Password</h2>
              <p className="text-muted-foreground text-sm">Enter your email to receive a reset link.</p>
              <div>
                <Label htmlFor="reset-email">Email</Label>
                <Input id="reset-email" type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)} placeholder="you@email.com" />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Sending...' : 'Send Reset Link'}</Button>
              <button type="button" onClick={() => setShowForgotPassword(false)} className="text-sm text-primary hover:underline w-full text-center block">
                Back to login
              </button>
            </form>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex mb-6 rounded-lg bg-muted p-1">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${isLogin ? 'bg-card shadow-card text-foreground' : 'text-muted-foreground'}`}
                >
                  Login
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${!isLogin ? 'bg-card shadow-card text-foreground' : 'text-muted-foreground'}`}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={isLogin ? handleLogin : handleSignUp} className="space-y-4">
                {!isLogin && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Shivani" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Bhatt" />
                    </div>
                  </div>
                )}
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" />
                </div>
                <div className="relative">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
                </Button>

                {isLogin && (
                  <button type="button" onClick={() => setShowForgotPassword(true)} className="text-sm text-primary hover:underline w-full text-center block">
                    Forgot your password?
                  </button>
                )}
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
