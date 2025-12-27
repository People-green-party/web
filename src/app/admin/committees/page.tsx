"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthHeader } from "../../../lib/supabaseClient";
import { RequireAuth } from "../../components/RequireAuth";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002";

export default function AdminCommitteesPage() {
  const router = useRouter();
  const [actorUserId, setActorUserId] = useState<string>("");
  const [reason, setReason] = useState<string>("");

  // Create committee form
  const [cName, setCName] = useState("");
  const [localUnitId, setLocalUnitId] = useState<string>("");
  const [cType, setCType] = useState<string>("CWC");
  const [createMsg, setCreateMsg] = useState<string | null>(null);
  const [createErr, setCreateErr] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  // Add member form
  const [committeeId, setCommitteeId] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [role, setRole] = useState<string>("CWCMember");
  const [isPresident, setIsPresident] = useState<boolean>(false);
  const [memberMsg, setMemberMsg] = useState<string | null>(null);
  const [memberErr, setMemberErr] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const guard = async () => {
      const auth = await getAuthHeader();
      if (!auth?.Authorization) {
        router.push("/join?returnTo=/admin/committees");
      }
    };
    guard();
  }, [router]);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateMsg(null);
    setCreateErr(null);
    try {
      setCreating(true);
      const auth = await getAuthHeader();
      const res = await fetch(`${API}/admin/committees`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...auth },
        body: JSON.stringify({ name: cName, localUnitId: Number(localUnitId), type: cType, actorUserId: Number(actorUserId || "0"), reason }),
      });
      if (!res.ok) throw new Error(await res.text());
      setCreateMsg("Committee created");
      setCName("");
      setLocalUnitId("");
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
      const auth = await getAuthHeader();
      const res = await fetch(`${API}/admin/committees/${Number(committeeId)}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...auth },
        body: JSON.stringify({ userId: Number(userId), role, isPresident, actorUserId: Number(actorUserId || "0"), reason }),
      });
      if (!res.ok) throw new Error(await res.text());
      setMemberMsg(isPresident ? "President set" : "Member added");
      setUserId("");
      setIsPresident(false);
    } catch (e: any) {
      setMemberErr(e?.message || "Failed to add member");
    } finally {
      setAdding(false);
    }
  };

  return (
    <RequireAuth>
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Admin: Committees</h1>

        <div className="rounded border bg-white p-4 mb-6">
          <h2 className="font-medium mb-2">Actor & Reason</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Actor User ID</label>
              <input className="w-full border rounded px-3 py-2" value={actorUserId} onChange={(e) => setActorUserId(e.target.value)} placeholder="Admin user id" />
            </div>
            <div>
              <label className="block text-sm mb-1">Reason</label>
              <input className="w-full border rounded px-3 py-2" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Audit reason (required)" />
            </div>
          </div>
        </div>

      <form onSubmit={onCreate} className="rounded border bg-white p-4 mb-6">
        <h2 className="font-medium mb-2">Create Committee</h2>
        {createMsg && <div className="rounded border border-green-300 bg-green-50 text-green-800 p-2 mb-2">{createMsg}</div>}
        {createErr && <div className="rounded border border-red-300 bg-red-50 text-red-800 p-2 mb-2">{createErr}</div>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input className="w-full border rounded px-3 py-2" value={cName} onChange={(e) => setCName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Local Unit ID</label>
            <input className="w-full border rounded px-3 py-2" value={localUnitId} onChange={(e) => setLocalUnitId(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Type</label>
            <select className="w-full border rounded px-3 py-2" value={cType} onChange={(e) => setCType(e.target.value)}>
              <option value="CWC">CWC</option>
              <option value="APC">APC</option>
              <option value="PPC">PPC</option>
              <option value="SSP">SSP</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <button className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded disabled:opacity-50" disabled={creating}>
            {creating ? "Creating…" : "Create Committee"}
          </button>
        </div>
      </form>

      <form onSubmit={onAddMember} className="rounded border bg-white p-4">
        <h2 className="font-medium mb-2">Add Member / Set President</h2>
        {memberMsg && <div className="rounded border border-green-300 bg-green-50 text-green-800 p-2 mb-2">{memberMsg}</div>}
        {memberErr && <div className="rounded border border-red-300 bg-red-50 text-red-800 p-2 mb-2">{memberErr}</div>}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm mb-1">Committee ID</label>
            <input className="w-full border rounded px-3 py-2" value={committeeId} onChange={(e) => setCommitteeId(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm mb-1">User ID</label>
            <input className="w-full border rounded px-3 py-2" value={userId} onChange={(e) => setUserId(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Role</label>
            <select className="w-full border rounded px-3 py-2" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="CWCMember">CWCMember</option>
              <option value="ExtendedMember">ExtendedMember</option>
              <option value="CWCPresident">CWCPresident</option>
            </select>
          </div>
          <div className="flex items-end">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={isPresident} onChange={(e) => setIsPresident(e.target.checked)} />
              <span>Make President</span>
            </label>
          </div>
        </div>
        <div className="mt-4">
          <button className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded disabled:opacity-50" disabled={adding}>
            {adding ? "Saving…" : "Save"}
          </button>
        </div>
      </form>

      </div>
    </RequireAuth>
  );
}
