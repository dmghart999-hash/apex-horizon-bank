'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';

export default function Home() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBankData() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      try {
        // Queries the bank_accounts table we created in Step 3
        const { data, error } = await supabase.from("bank_accounts").select("*").limit(5);

        if (error) {
          console.error("Supabase query error:", error.message);
        } else if (data) {
          setRows(data);
        }
      } catch (error) {
        console.error("Supabase fetch failed:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBankData();
  }, []);

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>Apex Horizon Bank</h1>
      <p>
        {supabase
          ? "Supabase status: connected and checking the database."
          : "Supabase is not configured yet. Add a real project URL and anon key in .env.local."}
      </p>

      <section style={{ marginTop: 24 }}>
        <h2>Latest records</h2>

        {loading ? (
          <p>Loading database records...</p>
        ) : rows.length === 0 ? (
          <p>No student rows returned yet. Create a sandbox profile by logging in.</p>
        ) : (
          <ul>
            {rows.map((row) => (
              <li key={String(row.id ?? Math.random())} style={{ marginBottom: 8, fontFamily: 'mono' }}>
                <strong>User:</strong> {row.username} | <strong>Checking:</strong> ${row.checking_balance}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
