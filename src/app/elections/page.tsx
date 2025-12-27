/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { RequireAuth } from "../components/RequireAuth";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002";

export default function ElectionsListPage() {
  const [elections, setElections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API}/elections`);
        const data = await res.json();
        setElections(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError(e?.message || "Failed to load elections");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <RequireAuth>
      <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-green-800">Elections</h1>
        <p className="text-sm text-gray-600 mt-1">
          View active and closed elections. Click into an election to see candidates and cast your vote if eligible.
        </p>
      </div>

      {loading && (
        <div className="rounded border p-4 mb-4">Loading elections…</div>
      )}
      {error && (
        <div className="rounded border border-red-300 bg-red-50 text-red-800 p-4 mb-4">{error}</div>
      )}

      {!loading && !error && elections.length === 0 && (
        <div className="rounded border border-gray-200 bg-white p-6 text-center">
          <p className="text-gray-700">No elections found.</p>
          <p className="text-sm text-gray-500 mt-1">
            If you are an Admin, you can create a new election in the Admin Panel.
          </p>
          <div className="mt-4">
            <Link href="/admin/elections" className="inline-block bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded">
              Go to Admin Elections
            </Link>
          </div>
        </div>
      )}

      {elections.length > 0 && (
        <ul className="space-y-3">
          {elections.map((e) => (
            <li key={e.id} className="rounded border border-gray-200 bg-white p-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">
                  {e.councilLevel} — {e.position}
                </div>
                <div className="text-sm text-gray-600">Status: {e.status}</div>
              </div>
              <Link
                href={`/elections/${e.id}`}
                className="inline-block bg-green-700 hover:bg-green-800 text-white px-3 py-1.5 rounded text-sm"
              >
                View
              </Link>
            </li>
          ))}
        </ul>
      )}
      </div>
    </RequireAuth>
  );
}
