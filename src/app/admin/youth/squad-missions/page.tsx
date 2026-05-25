'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/v1';

type Participant = { id: number; memberId: number; role: string | null; individualXpAwarded: number; member: { id: number; name: string } };
type Submission = {
  id: number;
  status: string;
  proofUrl: string | null;
  notes: string | null;
  rejectionReason: string | null;
  squadXpAwarded: number;
  createdAt: string;
  squad: { id: number; name: string; district: string | null };
  mission: { id: number; title: string; xpReward: number };
  submittedBy: { id: number; name: string };
  participants: Participant[];
};

const STATUS_COLORS: Record<string, string> = {
  submitted: 'bg-yellow-100 text-yellow-800',
  approved:  'bg-green-100  text-green-800',
  rejected:  'bg-red-100    text-red-800',
};

export default function AdminSquadMissionsPage() {
  const router = useRouter();
  const [token, setToken]             = useState('');
  const [items, setItems]             = useState<Submission[]>([]);
  const [total, setTotal]             = useState(0);
  const [page, setPage]               = useState(1);
  const [pages, setPages]             = useState(1);
  const [statusFilter, setStatusFilter] = useState('submitted');
  const [loading, setLoading]         = useState(false);
  const [selected, setSelected]       = useState<Submission | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast]             = useState('');

  useEffect(() => {
    const t = localStorage.getItem('adminToken') || sessionStorage.getItem('admin_access_token') || sessionStorage.getItem('adminToken') || '';
    setToken(t);
  }, []);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const r = await fetch(`${API}/admin/youth/squad-missions?status=${statusFilter}&page=${page}&limit=20`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (r.status === 401) { router.push('/admin/login'); return; }
      const d = await r.json();
      setItems(d.items || []);
      setTotal(d.total || 0);
      setPages(d.pages || 1);
    } finally { setLoading(false); }
  }, [token, statusFilter, page, router]);

  useEffect(() => { load(); }, [load]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const approve = async (id: number) => {
    setActionLoading(true);
    const r = await fetch(`${API}/admin/youth/squad-missions/${id}/approve`, {
      method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    const d = await r.json();
    setActionLoading(false);
    if (d.success) {
      showToast(`✅ Approved — Squad +${d.squadXpAwarded} XP, ${d.participantCount} members +${d.memberXpAwarded} XP each`);
      setSelected(null);
      load();
    } else {
      showToast(`❌ ${d.message || 'Approval failed'}`);
    }
  };

  const reject = async (id: number) => {
    if (!rejectReason.trim()) { showToast('Rejection reason is required'); return; }
    setActionLoading(true);
    const r = await fetch(`${API}/admin/youth/squad-missions/${id}/reject`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: rejectReason }),
    });
    const d = await r.json();
    setActionLoading(false);
    if (d.success) {
      showToast('Rejected');
      setSelected(null);
      setRejectReason('');
      load();
    } else {
      showToast(`❌ ${d.message || 'Reject failed'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg text-sm">{toast}</div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Squad Mission Approvals</h1>
            <p className="text-sm text-gray-500 mt-1">{total} submissions</p>
          </div>
          <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700">← Back</button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {['submitted', 'approved', 'rejected', 'All'].map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === s ? 'bg-green-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {s === 'All' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No submissions found</div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-green-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[item.status] || 'bg-gray-100 text-gray-600'}`}>
                        {item.status}
                      </span>
                      <span className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleDateString('en-IN')}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900">{item.mission.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {item.squad.name}
                      {item.squad.district ? ` · ${item.squad.district}` : ''}
                      {' · '}Submitted by <span className="font-medium">{item.submittedBy.name}</span>
                    </p>
                    <div className="flex gap-4 mt-2 text-xs text-gray-500">
                      <span>Mission XP: <strong className="text-green-700">{item.mission.xpReward}</strong></span>
                      <span>Participants: <strong>{item.participants.length}</strong></span>
                      {item.status === 'approved' && (
                        <span>Squad XP Awarded: <strong className="text-green-700">{item.squadXpAwarded}</strong></span>
                      )}
                    </div>
                    {item.notes && (
                      <p className="text-sm text-gray-600 mt-2 bg-gray-50 rounded-lg px-3 py-2">"{item.notes}"</p>
                    )}
                    {item.rejectionReason && (
                      <p className="text-sm text-red-600 mt-2">Rejection reason: {item.rejectionReason}</p>
                    )}
                  </div>
                  {item.status === 'submitted' && (
                    <button
                      onClick={() => { setSelected(item); setRejectReason(''); }}
                      className="ml-4 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Review
                    </button>
                  )}
                </div>

                {/* Participants */}
                {item.participants.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-400 mb-2">Participants</p>
                    <div className="flex flex-wrap gap-2">
                      {item.participants.map((p) => (
                        <span key={p.id} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                          {p.member.name}
                          {p.individualXpAwarded > 0 && <span className="text-green-600 ml-1">+{p.individualXpAwarded} XP</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Proof link */}
                {item.proofUrl && (
                  <a
                    href={item.proofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                  >
                    View Proof →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded border text-sm disabled:opacity-40">Prev</button>
            <span className="px-3 py-1 text-sm text-gray-600">Page {page} / {pages}</span>
            <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages} className="px-3 py-1 rounded border text-sm disabled:opacity-40">Next</button>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{selected.mission.title}</h2>
              <p className="text-sm text-gray-500 mt-1">{selected.squad.name}</p>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-green-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500">Squad XP Reward</p>
                  <p className="text-xl font-bold text-green-700">+{selected.mission.xpReward}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500">Member XP each</p>
                  <p className="text-xl font-bold text-blue-700">+{Math.floor(selected.mission.xpReward * 0.5)}</p>
                </div>
              </div>

              {selected.participants.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Participants ({selected.participants.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.participants.map((p) => (
                      <span key={p.id} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{p.member.name}</span>
                    ))}
                  </div>
                </div>
              )}

              {selected.proofUrl && (
                <a href={selected.proofUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 rounded-xl px-4 py-3 hover:bg-blue-100 transition-colors">
                  View Proof →
                </a>
              )}

              {selected.notes && (
                <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-700">"{selected.notes}"</div>
              )}

              {/* Rejection reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rejection Reason (required to reject)</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={2}
                  placeholder="Explain why this is being rejected..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>
            </div>

            <div className="p-6 pt-0 flex gap-3">
              <button
                onClick={() => approve(selected.id)}
                disabled={actionLoading}
                className="flex-1 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {actionLoading ? 'Processing...' : 'Approve'}
              </button>
              <button
                onClick={() => reject(selected.id)}
                disabled={actionLoading || !rejectReason.trim()}
                className="flex-1 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {actionLoading ? 'Processing...' : 'Reject'}
              </button>
              <button
                onClick={() => { setSelected(null); setRejectReason(''); }}
                className="px-4 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
