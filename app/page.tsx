'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabase';

type BankAccount = {
  id?: string | number;
  username?: string;
  checking_balance?: number;
  savings_balance?: number;
};

export default function Home() {
  const [rows, setRows] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadAccounts() {
      if (!supabase) {
        setError('Supabase is not configured.');
        setLoading(false);
        return;
      }

      try {
        const { data, error: queryError } = await supabase
          .from('bank_accounts')
          .select('*')
          .limit(10);

        if (queryError) {
          setError(queryError.message);
          return;
        }

        setRows(data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Unable to load accounts.'
        );
      } finally {
        setLoading(false);
      }
    }

    loadAccounts();
  }, []);

  const totalChecking = rows.reduce(
    (sum, row) => sum + Number(row.checking_balance || 0),
    0
  );

  const totalSavings = rows.reduce(
    (sum, row) => sum + Number(row.savings_balance || 0),
    0
  );

  return (
    <main
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #06142e 0%, #0b2a55 50%, #071a38 100%)',
        color: 'white',
        padding: '40px 20px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 40,
          }}
        >
          <div>
            <div
              style={{
                color: '#60a5fa',
                fontSize: 14,
                fontWeight: 'bold',
                letterSpacing: 2,
                marginBottom: 10,
              }}
            >
              SECURE DIGITAL BANKING
            </div>

            <h1
              style={{
                fontSize: 42,
                margin: 0,
                fontWeight: 800,
              }}
            >
              Apex Horizon <span style={{ color: '#38bdf8' }}>Bank</span>
            </h1>

            <p
              style={{
                color: '#b8c7dc',
                fontSize: 17,
                marginTop: 12,
              }}
            >
              Your modern banking dashboard
            </p>
          </div>

          <div
            style={{
              background: 'rgba(34,197,94,0.15)',
              border: '1px solid rgba(34,197,94,0.4)',
              color: '#86efac',
              padding: '10px 16px',
              borderRadius: 30,
              fontSize: 14,
              fontWeight: 'bold',
            }}
          >
            ● Secure
          </div>
        </div>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 20,
            marginBottom: 30,
          }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 20,
              padding: 25,
            }}
          >
            <div style={{ color: '#93c5fd', fontSize: 14 }}>
              CHECKING BALANCE
            </div>

            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                marginTop: 10,
              }}
            >
              ${totalChecking.toLocaleString()}
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 20,
              padding: 25,
            }}
          >
            <div style={{ color: '#93c5fd', fontSize: 14 }}>
              SAVINGS BALANCE
            </div>

            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                marginTop: 10,
              }}
            >
              ${totalSavings.toLocaleString()}
            </div>
          </div>

          <div
            style={{
              background: 'linear-gradient(135deg, #0284c7, #2563eb)',
              borderRadius: 20,
              padding: 25,
            }}
          >
            <div style={{ color: '#dbeafe', fontSize: 14 }}>
              TOTAL ACCOUNTS
            </div>

            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                marginTop: 10,
              }}
            >
              {rows.length}
            </div>
          </div>
        </section>

        <section
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 24,
            padding: 30,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 25,
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: 25 }}>
                Recent Accounts
              </h2>

              <p style={{ color: '#9fb1c8', marginBottom: 0 }}>
                Latest banking records from Supabase
              </p>
            </div>

            <div
              style={{
                color: '#86efac',
                fontSize: 13,
                fontWeight: 'bold',
              }}
            >
              {supabase ? '● DATABASE CONNECTED' : '● DATABASE OFFLINE'}
            </div>
          </div>

          {loading && (
            <div
              style={{
                padding: 30,
                textAlign: 'center',
                color: '#bfdbfe',
              }}
            >
              Loading account information...
            </div>
          )}

          {!loading && error && (
            <div
              style={{
                background: 'rgba(239,68,68,0.12)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#fca5a5',
                borderRadius: 15,
                padding: 20,
              }}
            >
              Database error: {error}
            </div>
          )}

          {!loading && !error && rows.length === 0 && (
            <div
              style={{
                padding: 30,
                textAlign: 'center',
                color: '#9fb1c8',
              }}
            >
              No bank accounts found yet.
            </div>
          )}

          {!loading && !error && rows.length > 0 && (
            <div
              style={{
                display: 'grid',
                gap: 12,
              }}
            >
              {rows.map((row, index) => (
                <div
                  key={String(row.id ?? index)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: 15,
                    padding: '18px 20px',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: 'bold',
                        fontSize: 17,
                      }}
                    >
                      {row.username || 'Bank Customer'}
                    </div>

                    <div
                      style={{
                        color: '#8fa4bd',
                        fontSize: 13,
                        marginTop: 5,
                      }}
                    >
                      Account #{String(row.id ?? index + 1)}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        color: '#7dd3fc',
                        fontSize: 13,
                      }}
                    >
                      Checking
                    </div>

                    <div
                      style={{
                        fontWeight: 'bold',
                        fontSize: 18,
                      }}
                    >
                      $
                      {Number(
                        row.checking_balance || 0
                      ).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <footer
          style={{
            textAlign: 'center',
            color: '#7186a1',
            fontSize: 13,
            marginTop: 30,
          }}
        >
          Apex Horizon Bank • Secure Banking Dashboard
        </footer>
      </div>
    </main>
  );
}