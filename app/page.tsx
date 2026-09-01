'use client';

import { useState } from 'react';
import { supabase } from '@/src/lib/supabase';

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!supabase) {
      setMessage('Supabase is not configured.');
      return;
    }

    if (!username.trim() || !password) {
      setMessage('Please enter your username and password.');
      return;
    }

    setLoading(true);
    setMessage('');

    const email = `${username.trim().toLowerCase()}@apexhorizonbank.demo`;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage('Invalid username or password.');
      setLoading(false);
      return;
    }

    window.location.href = '/';
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background:
          'radial-gradient(circle at top left, #123c69 0%, #06142e 45%, #020817 100%)',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 460,
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 28,
          padding: 36,
          boxShadow: '0 25px 80px rgba(0,0,0,0.35)',
          backdropFilter: 'blur(18px)',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            marginBottom: 32,
          }}
        >
          <div
            style={{
              color: '#60a5fa',
              fontSize: 13,
              fontWeight: 'bold',
              letterSpacing: 3,
              marginBottom: 12,
            }}
          >
            SECURE DIGITAL BANKING
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 38,
              fontWeight: 800,
            }}
          >
            Apex Horizon{' '}
            <span style={{ color: '#38bdf8' }}>Bank</span>
          </h1>

          <p
            style={{
              color: '#a9bad1',
              marginTop: 12,
              lineHeight: 1.5,
            }}
          >
            Classroom banking simulation
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <label
            style={{
              display: 'block',
              color: '#bfdbfe',
              fontSize: 14,
              fontWeight: 'bold',
              marginBottom: 8,
            }}
          >
            Username
          </label>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            autoComplete="username"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '15px 16px',
              borderRadius: 14,
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(0,0,0,0.2)',
              color: 'white',
              outline: 'none',
              fontSize: 16,
              marginBottom: 20,
            }}
          />

          <label
            style={{
              display: 'block',
              color: '#bfdbfe',
              fontSize: 14,
              fontWeight: 'bold',
              marginBottom: 8,
            }}
          >
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '15px 16px',
              borderRadius: 14,
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(0,0,0,0.2)',
              color: 'white',
              outline: 'none',
              fontSize: 16,
              marginBottom: 20,
            }}
          />

          {message && (
            <div
              style={{
                background: 'rgba(239,68,68,0.12)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#fca5a5',
                borderRadius: 12,
                padding: 14,
                marginBottom: 18,
                fontSize: 14,
              }}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              border: 'none',
              borderRadius: 14,
              background: loading
                ? '#475569'
                : 'linear-gradient(135deg, #0284c7, #2563eb)',
              color: 'white',
              fontSize: 16,
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div
          style={{
            marginTop: 24,
            textAlign: 'center',
            color: '#7186a1',
            fontSize: 12,
          }}
        >
          Demo classroom environment • Not a real bank
        </div>
      </div>
    </main>
  );
}