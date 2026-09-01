'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
async function getBankData() {
  if (!supabase) {
    return [];
  }

  try {
    const { data, error } = await supabase.from("profiles").select("*").limit(5);

    if (error) {
      console.error("Supabase query error:", error.message);
      return [];
    }

    return data ?? [];
  } catch (error) {
    console.error("Supabase fetch failed:", error);
    return [];
  }
}

export default async function Home() {
  const rows = await getBankData();

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

        {!supabase ? (
          <p>Once the real credentials are added, this page will show live data.</p>
        ) : rows.length === 0 ? (
          <p>No rows returned yet. Add a table named profiles or update the query.</p>
        ) : (
          <ul>
            {rows.map((row) => (
              <li key={String(row.id ?? Math.random())}>
                {JSON.stringify(row)}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
