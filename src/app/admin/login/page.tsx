'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { KeyRound, Eye, EyeOff, ShieldCheck } from 'lucide-react';

function normalizeApiBaseUrl(base: string) {
  const c = String(base || '').replace(/\/$/, '');
  if (!c) return 'http://localhost:3002/v1';
  if (c.endsWith('/v1')) return c;
  return `${c}/v1`;
}

const API = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002');

function safeAdminNext(raw: string | null): string {
  if (!raw || !raw.startsWith('/admin')) return '/admin';
  if (raw.startsWith('/admin/login')) return '/admin';
  return raw;
}

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [show, setShow]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/users/admin/access/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Invalid password');
      }
      const auth = await res.json();
      localStorage.setItem('adminToken', auth.token);
      sessionStorage.setItem('admin_access_token', auth.token);
      sessionStorage.setItem('admin_access_scope', auth.scope || 'edit');
      sessionStorage.setItem('admin_youth_access_granted', '1');
      router.push(safeAdminNext(searchParams.get('next')));
    } catch (e: any) {
      setError(e.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0FBF4] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-[#04330B] mb-4">
            <ShieldCheck className="text-white" size={28} />
          </div>
          <h1 className="text-2xl font-black text-[#04330B]">Admin Access</h1>
          <p className="text-sm text-[#587E67] mt-1">Jinda Youth System</p>
        </div>

        <form onSubmit={login} className="bg-white rounded-2xl border border-[#DDEEE4] p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-bold text-[#04330B] mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                className="w-full border border-[#DDEEE4] rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A] text-[#04330B]"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#587E67]"
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 font-semibold">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 bg-[#04330B] text-white font-black rounded-xl hover:bg-[#16A34A] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <KeyRound size={16} />
            {loading ? 'Verifying...' : 'Login'}
          </button>
        </form>

        <p className="text-xs text-center text-[#9CA3AF] mt-4">
          Access is session-based and expires when you close the browser.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F0FBF4] flex items-center justify-center text-[#04330B] font-semibold">
          Loading…
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
