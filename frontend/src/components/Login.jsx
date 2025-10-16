import { useState } from 'react';
import React from 'react';
import './Login.css'; 

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const API_URL = 'http://localhost:5000/api/auth';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const endpoint = isLogin ? `${API_URL}/login` : `${API_URL}/register`;
      const body = isLogin
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(isLogin ? 'Login successful!' : 'Registration successful!');
        setUser(data.data);
        setFormData({ name: '', email: '', password: '' });
      } else {
        setError(data.message || 'An error occurred');
      }
    } catch (err) {
      setError('Connection error. Please make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setSuccess('Logged out successfully!');
  };

  if (user) {
  return (
    <div className="page-bg">
      <div className="card">
        <div className="user-success-video">
          {/* Welcome message */}
          <h2 className="welcome-name">Welcome, {user.name}!</h2>

          {/* YouTube Video */}
          <div className="video-container">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/-D068iydQpY?autoplay=1&rel=0"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>

          {/* Logout button */}
          <button onClick={handleLogout} className="btn-primary">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}


  return (
    <div className="page-bg">
      <div className="login-container">
        <div className="login-left">
          <div className="welcome-text">
            <h2>Welcome Back!</h2>
            <p>Access your account securely</p>
          </div>
        </div>

        <div className="login-right">
          <div className="login-form">
            <h2>{isLogin ? 'Sign In' : 'Create Account'}</h2>
            <p>{isLogin ? 'Enter your credentials to continue' : 'Sign up to get started'}</p>

            {error && <div className="alert error">{error}</div>}
            {success && <div className="alert success">{success}</div>}

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
              </button>
            </form>

            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
                setFormData({ name: '', email: '', password: '' });
              }}
              className="toggle-link"
            >
              {isLogin
                ? "Don't have an account? Sign Up"
                : 'Already have an account? Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
