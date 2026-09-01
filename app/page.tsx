'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabase';

type Profile = {
  username: string;
  full_name: string;
  role: string;
};

type Account = {
  username: string;
  role: string;
  checking_balance: number;
  savings_balance: number;
  crypto_balance: number;
};

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [message, setMessage] = useState('');

  async function loadUser() {
    if (!supabase) {
      setMessage('Supabase is not configured.');
      setLoading(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setProfile(null);
      setAccount(null);
      setLoading(false);
      return;
    }

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('username, full_name, role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      setMessage('Unable to load your profile.');
      setLoading(false);
      return;
    }

    const { data: accountData, error: accountError } = await supabase
      .from('bank_accounts')
      .select(
        'username, role, checking_balance, savings_balance, crypto_balance'
      )
      .eq('user_id', user.id)
      .single();

    if (accountError) {
      setMessage('Unable to load your bank account.');
      setLoading(false);
      return;
    }

    setProfile(profileData);
    setAccount(accountData);
    setLoading(false);
  }

  useEffect(() => {
    loadUser();
  }, []);

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

    setSigningIn(true);
    setMessage('');

    const email = `${username.trim().toLowerCase()}@apexhorizonbank.com`;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage('Invalid username or password.');
      setSigningIn(false);
      return;
    }

    await loadUser();
    setSigningIn(false);
  }

  async function handleLogout() {
    if (!supabase) return;

    await supabase.auth.signOut();

    setProfile(null);
    setAccount(null);
    setUsername('');
    setPassword('');
    setMessage('');
  }

  if (loading) {
    return (
      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'radial-gradient(circle at top left, #123c69 0%, #06142e 45%, #020817 100%)',
          color: 'white',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        Loading Apex Horizon Bank...
      </main>
    );
  }

  if (!profile || !account) {
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
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
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

            <h1 style={{ margin: 0, fontSize: 38, fontWeight: 800 }}>
              Apex Horizon <span style={{ color: '#38bdf8' }}>Bank</span>
            </h1>

            <p style={{ color: '#a9bad1', marginTop: 12 }}>
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
              disabled={signingIn}
              style={{
                width: '100%',
                padding: '16px',
                border: 'none',
                borderRadius: 14,
                background: signingIn
                  ? '#475569'
                  : 'linear-gradient(135deg, #0284c7, #2563eb)',
                color: 'white',
                fontSize: 16,
                fontWeight: 'bold',
                cursor: signingIn ? 'not-allowed' : 'pointer',
              }}
            >
              {signingIn ? 'Signing in...' : 'Sign In'}
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

  return (
    <main
      style={{
        minHeight: '100vh',
        padding: 24,
        background:
          'radial-gradient(circle at top left, #123c69 0%, #06142e 45%, #020817 100%)',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 20,
            marginBottom: 30,
          }}
        >
          <div>
            <div
              style={{
                color: '#60a5fa',
                fontSize: 13,
                fontWeight: 'bold',
                letterSpacing: 3,
              }}
            >
              APEX HORIZON BANK
            </div>

            <h1 style={{ margin: '8px 0 4px', fontSize: 34 }}>
              Welcome, {profile.full_name}
            </h1>

            <p style={{ color: '#9fb1c8', margin: 0 }}>
              {profile.role === 'admin' ? 'Teacher / Administrator' : 'Student'}
            </p>
          </div>

          <button
            onClick={handleLogout}
            style={{
              padding: '12px 18px',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.08)',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Sign Out
          </button>
        </header>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 18,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 22,
              padding: 24,
            }}
          >
            <div style={{ color: '#7dd3fc', fontSize: 14 }}>CHECKING</div>
            <div style={{ fontSize: 32, fontWeight: 800, marginTop: 10 }}>
              $
              {Number(account.checking_balance || 0).toLocaleString(
                'en-US',
                {
                  minimumFractionDigits: 2,
                }
              )}
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 22,
              padding: 24,
            }}
          >
            <div style={{ color: '#86efac', fontSize: 14 }}>SAVINGS</div>
            <div style={{ fontSize: 32, fontWeight: 800, marginTop: 10 }}>
              $
              {Number(account.savings_balance || 0).toLocaleString(
                'en-US',
                {
                  minimumFractionDigits: 2,
                }
              )}
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 22,
              padding: 24,
            }}
          >
            <div style={{ color: '#c4b5fd', fontSize: 14 }}>CRYPTO</div>
            <div style={{ fontSize: 32, fontWeight: 800, marginTop: 10 }}>
              $
              {Number(account.crypto_balance || 0).toLocaleString(
                'en-US',
                {
                  minimumFractionDigits: 2,
                }
              )}
            </div>
          </div>
        </section>

        <section
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 22,
            padding: 26,
          }}
        >
          <h2 style={{ marginTop: 0 }}>Account Overview</h2>

          <div
            style={{
              display: 'grid',
              gap: 14,
              color: '#cbd5e1',
            }}
          >
            <div>
              <strong style={{ color: 'white' }}>Username:</strong>{' '}
              {profile.username}
            </div>

            <div>
              <strong style={{ color: 'white' }}>Account type:</strong>{' '}
              {profile.role === 'admin' ? 'Administrator' : 'Student'}
            </div>

            <div>
              <strong style={{ color: 'white' }}>Status:</strong>{' '}
              <span style={{ color: '#86efac' }}>Active</span>
            </div>
          </div>
        </section>

        <footer
          style={{
            textAlign: 'center',
            color: '#7186a1',
            fontSize: 13,
            marginTop: 30,
          }}
        >
          Apex Horizon Bank • Classroom Simulation • Not a real bank
        </footer>
      </div>
    </main>
  );
}