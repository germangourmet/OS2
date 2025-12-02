import React, { useState } from 'react';
import './LoginScreen.css';

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (email && password) {
        onLogin({ email, isSignUp });
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="earth-background">
        <div className="earth-placeholder" />
      </div>

      <div className="login-glass">
        <div className="login-content">
          <div className="login-header">
            <div className="login-logo">
              <div className="logo-icon">
                <div className="logo-core"></div>
              </div>
              <span className="logo-text">NEXUS</span>
            </div>
          </div>

          <div className="login-title">
            <h1>{isSignUp ? 'Create Account' : 'Welcome Back'}</h1>
            <p>{isSignUp ? 'Join the future of technology' : 'Enter the next dimension'}</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {!isSignUp && (
              <div className="form-remember">
                <input type="checkbox" id="remember" className="remember-checkbox" />
                <label htmlFor="remember" className="remember-label">Remember me</label>
              </div>
            )}

            <button type="submit" className="login-button" disabled={loading}>
              <span className="button-text">
                {loading ? 'Initializing...' : isSignUp ? 'Create Account' : 'Sign In'}
              </span>
              {loading && <span className="button-loader"></span>}
            </button>
          </form>

          <div className="login-divider">
            <span className="divider-line"></span>
            <span className="divider-text">OR</span>
            <span className="divider-line"></span>
          </div>

          <div className="login-footer">
            <p className="footer-text">
              {isSignUp ? 'Already have an account?' : 'New to Nexus?'}
              <button
                type="button"
                className="toggle-button"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? 'Sign In' : 'Create Account'}
              </button>
            </p>
          </div>

          <div className="login-social">
            <button className="social-button" title="Google">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              </svg>
            </button>
            <button className="social-button" title="GitHub">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
            </button>
            <button className="social-button" title="Microsoft">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
