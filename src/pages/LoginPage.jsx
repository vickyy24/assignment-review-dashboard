import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, ChartNoAxesColumnIncreasing, CheckCircle2, CircleAlert, Eye, EyeOff, FileText, GraduationCap, LockKeyhole, Mail, MessageSquareText, UserRound } from 'lucide-react';

export default function LoginPage() {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 600)); // simulate network
      login(email.trim(), password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (event) => setEmail(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);
  const handlePasswordVisibility = () => setShowPassword((visible) => !visible);

  return (
    <div className="login-root p-4">
      {/* Background blobs */}
      <div className="blob blob-1 animate-float" />
      <div className="blob blob-2 animate-float" />
      <div className="blob blob-3 animate-float" />

      <main className="login-card login-layout grid-cols-1 md:grid-cols-2 h-[calc(100svh-2rem)] min-h-0 max-md:h-auto max-md:max-h-none max-md:overflow-visible max-md:max-w-[520px]">
        <section className="login-brand-panel max-md:min-h-0 max-md:px-[30px] max-md:pt-7 max-md:pb-5 max-sm:px-5 max-sm:pt-6 max-sm:pb-4" aria-label="EduBoard by Joineazy">
          <div className="login-header">
            <div className="login-product-brand flex flex-wrap items-center gap-2 max-sm:gap-1">
              <span className="login-product-name">EduBoard</span>
              <span className="login-product-by">by</span>
              <img className="joineazy-logo-login" src="/joineazy-logo.png" alt="Joineazy" />
            </div>
            <h1 className="login-title login-brand-title max-md:text-4xl max-sm:text-[30px]">Learn. Build. Grow.</h1>
            <p className="login-subtitle">Assignments, progress and feedback — all in one place.</p>
          </div>

          <div className="login-features grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 max-md:mt-[23px] max-sm:mt-[18px]">
            <div className="login-feature">
              <span className="login-feature-icon login-feature-icon--blue"><FileText size={18} /></span>
              <span><strong>Manage Assignments</strong><small>Stay updated with all your tasks</small></span>
            </div>
            <div className="login-feature">
              <span className="login-feature-icon login-feature-icon--purple"><ChartNoAxesColumnIncreasing size={18} /></span>
              <span><strong>Track Progress</strong><small>See your growth and performance</small></span>
            </div>
            <div className="login-feature">
              <span className="login-feature-icon login-feature-icon--green"><MessageSquareText size={18} /></span>
              <span><strong>Get Feedback</strong><small>Learn and improve with reviews</small></span>
            </div>
          </div>

          <div className="login-illustration max-md:h-[110px] max-md:mt-[10px] max-sm:hidden" aria-hidden="true">
            <div className="login-illustration-orbit" />
            <div className="login-illustration-ring max-md:left-1 max-md:top-0 max-md:h-[38px] max-md:w-[38px]"><CheckCircle2 size={24} /></div>
            <div className="login-illustration-card login-illustration-card--main max-md:h-[70px] max-md:w-[180px] max-md:gap-2 max-md:p-[10px]">
              <span className="illustration-icon max-md:h-[34px] max-md:w-[34px]"><BookOpen size={19} /></span>
              <span className="illustration-lines"><i /><i /><i /></span>
              <span className="illustration-check"><CheckCircle2 size={17} /></span>
            </div>
            <div className="login-illustration-card login-illustration-card--chart max-md:right-1 max-md:bottom-[-2px] max-md:h-12 max-md:w-[82px]">
              <ChartNoAxesColumnIncreasing size={23} />
              <span className="illustration-bars"><i /><i /><i /><i /></span>
            </div>
            <div className="login-illustration-dot login-illustration-dot--one" />
            <div className="login-illustration-dot login-illustration-dot--two" />
          </div>
        </section>

        <section className="login-form-panel max-md:p-[30px] max-sm:px-5 max-sm:py-6" aria-label="Sign in">
          <div className="login-form-content">
            <div className="login-form-heading">
              <h2 className="max-md:text-[26px]">Welcome Back</h2>
              <p>Login to continue to your dashboard</p>
            </div>
          <form onSubmit={handleSubmit} className="login-form max-md:gap-[15px]">
          <div className="field">
            <label htmlFor="email" className="field-label">Email</label>
            <div className="login-field-control">
              <span className="login-input-icon"><Mail size={17} /></span>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                className="field-input max-sm:h-[50px]"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email"
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="password" className="field-label">Password</label>
            <div className="login-field-control">
              <span className="login-input-icon"><LockKeyhole size={17} /></span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="field-input max-sm:h-[50px]"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter your password"
              />
              <button className="password-visibility" type="button" onClick={handlePasswordVisibility} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-banner" role="alert">
              <CircleAlert size={16} aria-hidden="true" /> {error}
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <span className="spinner animate-spin" /> : 'Login'}
          </button>
          </form>
            <div className="login-divider"><span>OR</span></div>
            <aside className="demo-credentials" aria-label="Demo credentials">
              <p className="demo-credentials-title">Demo Credentials</p>
              <div className="demo-account-grid">
                <div className="demo-account-card">
                  <span className="demo-account-icon demo-account-icon--student"><GraduationCap size={19} /></span>
                  <strong>Student</strong>
                  <span>Arjun</span>
                  <span>Email: arjun@student.edu</span>
                  <span>Password: student123</span>
                  <span>Priya</span>
                  <span>Email: priya@student.edu</span>
                  <span>Password: student123</span>
                </div>
                <div className="demo-account-card">
                  <span className="demo-account-icon demo-account-icon--admin"><UserRound size={19} /></span>
                  <strong>Admin</strong>
                  <span>ramesh@prof.edu</span>
                  <span>admin123</span>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}
