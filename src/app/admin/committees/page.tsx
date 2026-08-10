"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_API, adminFetch, getAdminToken } from "@/lib/adminApi";

type CommitteeRow = {
  id: number;
  name: string;
  type: string;
  localUnit?: { id: number; name: string; type: string } | null;
  _count?: { members: number };
};

type GeoOption = { id: number; name: string; type?: string };
type MemberHit = {
  id: number;
  name: string;
  phone: string;
  memberId?: string | null;
  role?: string;
};

export default function AdminCommitteesPage() {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [committees, setCommittees] = useState<CommitteeRow[]>([]);
  const [listErr, setListErr] = useState<string | null>(null);
  const [listLoading, setListLoading] = useState(false);

  const [cName, setCName] = useState("");
  const [cType, setCType] = useState("CWC");
  const [loksabhas, setLoksabhas] = useState<GeoOption[]>([]);
  const [vidhansabhas, setVidhansabhas] = useState<GeoOption[]>([]);
  const [localUnits, setLocalUnits] = useState<GeoOption[]>([]);
  const [loksabhaId, setLoksabhaId] = useState("");
  const [vidhansabhaId, setVidhansabhaId] = useState("");
  const [localUnitId, setLocalUnitId] = useState("");
  const [createMsg, setCreateMsg] = useState<string | null>(null);
  const [createErr, setCreateErr] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const [committeeId, setCommitteeId] = useState("");
  const [memberQuery, setMemberQuery] = useState("");
  const [memberHits, setMemberHits] = useState<MemberHit[]>([]);
  const [memberSearching, setMemberSearching] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberHit | null>(null);
  const [role, setRole] = useState("CWCMember");
  const [isPresident, setIsPresident] = useState(false);
  const [memberMsg, setMemberMsg] = useState<string | null>(null);
  const [memberErr, setMemberErr] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const loadCommittees = useCallback(async () => {
    setListLoading(true);
    setListErr(null);
    try {
      const data = await adminFetch<CommitteeRow[]>("admin/committees");
      setCommittees(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setListErr(e?.message || "Failed to load committees");
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!getAdminToken()) {
      router.replace("/admin/login");
      return;
    }
    loadCommittees();
  }, [router, loadCommittees]);

  useEffect(() => {
    fetch(`${ADMIN_API}/geo/loksabhas`)
      .then((r) => r.json())
      .then((d) => setLoksabhas(Array.isArray(d) ? d : []))
      .catch(() => setLoksabhas([]));
  }, []);

  useEffect(() => {
    if (!loksabhaId) {
      setVidhansabhas([]);
      setVidhansabhaId("");
      return;
    }
    fetch(`${ADMIN_API}/geo/loksabhas/${loksabhaId}/vidhansabhas`)
      .then((r) => r.json())
      .then((d) => setVidhansabhas(Array.isArray(d) ? d : []))
      .catch(() => setVidhansabhas([]));
    setVidhansabhaId("");
    setLocalUnitId("");
    setLocalUnits([]);
  }, [loksabhaId]);

  useEffect(() => {
    if (!vidhansabhaId) {
      setLocalUnits([]);
      setLocalUnitId("");
      return;
    }
    fetch(`${ADMIN_API}/geo/vidhansabhas/${vidhansabhaId}/local-units`)
      .then((r) => r.json())
      .then((d) => setLocalUnits(Array.isArray(d) ? d : []))
      .catch(() => setLocalUnits([]));
    setLocalUnitId("");
  }, [vidhansabhaId]);

  useEffect(() => {
    const q = memberQuery.trim();
    if (q.length < 2) {
      setMemberHits([]);
      return;
    }
    const t = setTimeout(async () => {
      setMemberSearching(true);
      try {
        const data = await adminFetch<{ items?: MemberHit[] } | MemberHit[]>(
          `users/admin/users/search?q=${encodeURIComponent(q)}&take=12&page=1`
        );
        const items = Array.isArray(data) ? data : data?.items || [];
        setMemberHits(items);
      } catch {
        setMemberHits([]);
      } finally {
        setMemberSearching(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [memberQuery]);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateMsg(null);
    setCreateErr(null);
    try {
      setCreating(true);
      if (reason.trim().length < 3) throw new Error("Audit reason must be at least 3 characters");
      if (!localUnitId) throw new Error("Please select a local unit");
      await adminFetch("admin/committees", {
        method: "POST",
        body: JSON.stringify({
          name: cName,
          localUnitId: Number(localUnitId),
          type: cType,
          reason: reason.trim(),
        }),
      });
      setCreateMsg("Committee created");
      setCName("");
      setLoksabhaId("");
      setVidhansabhaId("");
      setLocalUnitId("");
      await loadCommittees();
    } catch (e: any) {
      setCreateErr(e?.message || "Failed to create committee");
    } finally {
      setCreating(false);
    }
  };

  const onAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setMemberMsg(null);
    setMemberErr(null);
    try {
      setAdding(true);
      if (reason.trim().length < 3) throw new Error("Audit reason must be at least 3 characters");
      if (!committeeId) throw new Error("Please select a committee");
      if (!selectedMember) throw new Error("Please search and select a member");
      await adminFetch(`admin/committees/${Number(committeeId)}/members`, {
        method: "POST",
        body: JSON.stringify({
          userId: selectedMember.id,
          role,
          isPresident,
          reason: reason.trim(),
        }),
      });
      setMemberMsg(isPresident ? "President set" : "Member added");
      setSelectedMember(null);
      setMemberQuery("");
      setMemberHits([]);
      setIsPresident(false);
      await loadCommittees();
    } catch (e: any) {
      setMemberErr(e?.message || "Failed to add member");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="w-full max-w-full min-w-0 space-y-5 sm:space-y-6 font-['Familjen_Grotesk']">
      <div className="min-w-0">
        <h2 className="text-xl sm:text-2xl font-semibold text-[#04330B]">Committees</h2>
        <p className="text-sm text-[#587E67] mt-1">
          Create committees and assign members from the admin portal.
        </p>
      </div>

      <div className="rounded-[8px] border border-[#B9D3C4] bg-white p-4 shadow-sm">
        <label className="block text-sm mb-1 text-[#587E67]">
          Audit reason (used for create / add member)
        </label>
        <input
          className="w-full border border-[#B9D3C4] rounded-[6px] px-3 py-2 text-sm"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Required for write actions"
        />
      </div>

      <div className="rounded-[8px] border border-[#B9D3C4] bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-[#04330B]">Existing Committees</h2>
          <button
            type="button"
            onClick={loadCommittees}
            className="text-sm font-semibold text-[#0D5229] hover:text-[#04330B]"
          >
            Refresh
          </button>
        </div>
        {listLoading && <p className="text-sm text-[#587E67]">Loading…</p>}
        {listErr && <p className="text-sm text-red-700 mb-2">{listErr}</p>}
        <div className="overflow-x-auto w-full max-w-full overscroll-x-contain">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="text-left">
                <th className="px-2 py-2 text-[#587E67] font-semibold">ID</th>
                <th className="px-2 py-2 text-[#587E67] font-semibold">Name</th>
                <th className="px-2 py-2 text-[#587E67] font-semibold">Type</th>
                <th className="px-2 py-2 text-[#587E67] font-semibold">Local Unit</th>
                <th className="px-2 py-2 text-[#587E67] font-semibold">Members</th>
                <th className="px-2 py-2 text-[#587E67] font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {committees.map((c) => (
                <tr key={c.id} className="border-t border-[#E4F2EA]">
                  <td className="px-2 py-2">{c.id}</td>
                  <td className="px-2 py-2">{c.name}</td>
                  <td className="px-2 py-2">{c.type}</td>
                  <td className="px-2 py-2">
                    {c.localUnit ? `${c.localUnit.name} (${c.localUnit.type})` : "—"}
                  </td>
                  <td className="px-2 py-2">{c._count?.members ?? 0}</td>
                  <td className="px-2 py-2">
                    <button
                      type="button"
                      onClick={() => setCommitteeId(String(c.id))}
                      className="text-xs font-semibold text-[#0D5229] hover:text-[#04330B]"
                    >
                      Use for add member
                    </button>
                  </td>
                </tr>
              ))}
              {!listLoading && committees.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-2 py-6 text-[#587E67]">
                    No committees yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <form onSubmit={onCreate} className="rounded-[8px] border border-[#B9D3C4] bg-white p-4 shadow-sm">
        <h2 className="font-semibold mb-2 text-[#04330B]">Create Committee</h2>
        {createMsg && (
          <div className="rounded border border-green-300 bg-green-50 text-green-800 p-2 mb-2 text-sm">
            {createMsg}
          </div>
        )}
        {createErr && (
          <div className="rounded border border-red-300 bg-red-50 text-red-800 p-2 mb-2 text-sm">
            {createErr}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-[#587E67]">Name</label>
            <input
              className="w-full border border-[#B9D3C4] rounded-[6px] px-3 py-2 text-sm"
              value={cName}
              onChange={(e) => setCName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-[#587E67]">Type</label>
            <select
              className="w-full border border-[#B9D3C4] rounded-[6px] px-3 py-2 text-sm"
              value={cType}
              onChange={(e) => setCType(e.target.value)}
            >
              <option value="CWC">CWC</option>
              <option value="APC">APC</option>
              <option value="PPC">PPC</option>
              <option value="SSP">SSP</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1 text-[#587E67]">Loksabha</label>
            <select
              className="w-full border border-[#B9D3C4] rounded-[6px] px-3 py-2 text-sm"
              value={loksabhaId}
              onChange={(e) => setLoksabhaId(e.target.value)}
              required
            >
              <option value="">Select</option>
              {loksabhas.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1 text-[#587E67]">Vidhan Sabha</label>
            <select
              className="w-full border border-[#B9D3C4] rounded-[6px] px-3 py-2 text-sm disabled:bg-gray-100"
              value={vidhansabhaId}
              onChange={(e) => setVidhansabhaId(e.target.value)}
              disabled={!loksabhaId}
              required
            >
              <option value="">Select</option>
              {vidhansabhas.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1 text-[#587E67]">Local Unit</label>
            <select
              className="w-full border border-[#B9D3C4] rounded-[6px] px-3 py-2 text-sm disabled:bg-gray-100"
              value={localUnitId}
              onChange={(e) => setLocalUnitId(e.target.value)}
              disabled={!vidhansabhaId}
              required
            >
              <option value="">Select ward / gram panchayat</option>
              {localUnits.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                  {u.type ? ` (${u.type})` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <button
            className="bg-[#0D5229] hover:bg-[#0a4220] text-white px-4 py-2 rounded-[8px] text-sm font-semibold disabled:opacity-50"
            disabled={creating}
          >
            {creating ? "Creating…" : "Create Committee"}
          </button>
        </div>
      </form>

      <form onSubmit={onAddMember} className="rounded-[8px] border border-[#B9D3C4] bg-white p-4 shadow-sm">
        <h2 className="font-semibold mb-2 text-[#04330B]">Add Member / Set President</h2>
        {memberMsg && (
          <div className="rounded border border-green-300 bg-green-50 text-green-800 p-2 mb-2 text-sm">
            {memberMsg}
          </div>
        )}
        {memberErr && (
          <div className="rounded border border-red-300 bg-red-50 text-red-800 p-2 mb-2 text-sm">
            {memberErr}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-[#587E67]">Committee</label>
            <select
              className="w-full border border-[#B9D3C4] rounded-[6px] px-3 py-2 text-sm"
              value={committeeId}
              onChange={(e) => setCommitteeId(e.target.value)}
              required
            >
              <option value="">Select committee</option>
              {committees.map((c) => (
                <option key={c.id} value={c.id}>
                  #{c.id} — {c.name} ({c.type})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1 text-[#587E67]">Role</label>
            <select
              className="w-full border border-[#B9D3C4] rounded-[6px] px-3 py-2 text-sm"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="CWCMember">CWCMember</option>
              <option value="ExtendedMember">ExtendedMember</option>
              <option value="CWCPresident">CWCPresident</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1 text-[#587E67]">
              Search member (name / phone / member ID)
            </label>
            <input
              className="w-full border border-[#B9D3C4] rounded-[6px] px-3 py-2 text-sm"
              value={memberQuery}
              onChange={(e) => {
                setMemberQuery(e.target.value);
                setSelectedMember(null);
              }}
              placeholder="Type at least 2 characters…"
            />
            {memberSearching && (
              <p className="text-xs text-[#587E67] mt-1">Searching…</p>
            )}
            {selectedMember ? (
              <div className="mt-2 rounded-[6px] border border-[#B9D3C4] bg-[#F5F8F6] px-3 py-2 text-sm flex items-center justify-between gap-2">
                <span>
                  <span className="font-semibold text-[#04330B]">{selectedMember.name}</span>
                  <span className="text-[#587E67]">
                    {" "}
                    · {selectedMember.phone}
                    {selectedMember.memberId ? ` · ${selectedMember.memberId}` : ""}
                  </span>
                </span>
                <button
                  type="button"
                  className="text-xs font-semibold text-red-700"
                  onClick={() => {
                    setSelectedMember(null);
                    setMemberQuery("");
                  }}
                >
                  Clear
                </button>
              </div>
            ) : (
              memberHits.length > 0 && (
                <ul className="mt-2 max-h-48 overflow-y-auto rounded-[6px] border border-[#B9D3C4] bg-white divide-y divide-[#E4F2EA]">
                  {memberHits.map((m) => (
                    <li key={m.id}>
                      <button
                        type="button"
                        className="w-full text-left px-3 py-2 text-sm hover:bg-[#F5F8F6]"
                        onClick={() => {
                          setSelectedMember(m);
                          setMemberQuery(m.name);
                          setMemberHits([]);
                        }}
                      >
                        <span className="font-semibold text-[#04330B]">{m.name}</span>
                        <span className="text-[#587E67]">
                          {" "}
                          · {m.phone}
                          {m.memberId ? ` · ${m.memberId}` : ""}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )
            )}
          </div>
          <div className="flex items-end">
            <label className="inline-flex items-center gap-2 text-sm text-[#587E67]">
              <input
                type="checkbox"
                checked={isPresident}
                onChange={(e) => setIsPresident(e.target.checked)}
              />
              <span>Make President</span>
            </label>
          </div>
        </div>
        <div className="mt-4">
          <button
            className="bg-[#0D5229] hover:bg-[#0a4220] text-white px-4 py-2 rounded-[8px] text-sm font-semibold disabled:opacity-50"
            disabled={adding}
          >
            {adding ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
