"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthHeader } from "../../lib/supabaseClient";
import { RequireAuth } from "../components/RequireAuth";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002";

type Candidate = { user: { id: number; name: string; phone: string } };

type MyBallotResponse = {
  election: { id: number; councilLevel: string; position: string } | null;
  candidates: Candidate[];
};

export default function MyBallotPage() {
  const [data, setData] = useState<MyBallotResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voteMsg, setVoteMsg] = useState<string | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const router = useRouter();

  const load = async () => {
    setLoading(true);
    setError(null);
    setVoteMsg(null);
    try {
      const auth = await getAuthHeader();
      if (!auth?.Authorization) {
        router.push("/join?returnTo=/vote");
        return;
      }
      const res = await fetch(`${API}/elections/my-ballot`, { headers: { ...auth } });
      if (!res.ok) throw new Error(await res.text());
      const json = (await res.json()) as MyBallotResponse;
      setData(json);
    } catch (e: any) {
      setError(e?.message || "Failed to load ballot");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const canSubmit = useMemo(() => selected.length >= 1 && selected.length <= 21, [selected]);

  const toggle = (id: number) => {
    setError(null);
    setVoteMsg(null);
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 21) return prev; // cap at 21
      return [...prev, id];
    });
  };

  const onSubmitBallot = async () => {
    if (!data?.election?.id) return;
    if (!canSubmit) {
      setError("Select between 1 and 21 candidates");
      return;
    }
    setError(null);
    setVoteMsg(null);
    try {
      const auth = await getAuthHeader();
      const res = await fetch(`${API}/elections/${data.election.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...auth },
        body: JSON.stringify({ candidateUserIds: selected }),
      });
      if (!res.ok) throw new Error(await res.text());
      setVoteMsg("Ballot submitted successfully");
      setSelected([]);
      await load();
    } catch (e: any) {
      setError(e?.message || "Submit failed");
    }
  };

  return (
    <RequireAuth>
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">My Ballot</h1>
      {loading && <div className="rounded border p-3 mb-3">Loading…</div>}
      {error && (
        <div className="rounded border border-red-300 bg-red-50 text-red-800 p-3 mb-3">{error}</div>
      )}
      {voteMsg && (
        <div className="rounded border border-green-300 bg-green-50 text-green-800 p-3 mb-3">{voteMsg}</div>
      )}

      {!loading && !data?.election && (
        <div className="rounded border bg-white p-4">No active APC election found for your district.</div>
      )}

      {data?.election && (
        <div className="rounded border bg-white p-4">
          <div className="mb-2">
            <b>{data.election.councilLevel}</b> — {data.election.position}
          </div>
          <div className="mb-3 text-sm text-gray-700">Select up to 21 candidates. Selected: {selected.length}/21</div>
          <ul className="space-y-2">
            {data.candidates.map((c) => {
              const checked = selected.includes(c.user.id);
              const disableNew = !checked && selected.length >= 21;
              return (
                <li key={c.user.id} className="flex items-center justify-between border rounded p-2">
                  <label className="flex items-center gap-3 w-full">
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disableNew}
                      onChange={() => toggle(c.user.id)}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{c.user.name}</div>
                      <div className="text-sm text-gray-600">{c.user.phone}</div>
                    </div>
                  </label>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 flex justify-end">
            <button
              className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded disabled:opacity-50"
              onClick={onSubmitBallot}
              disabled={!canSubmit}
            >
              Submit Ballot
            </button>
          </div>
        </div>
      )}
      </div>
    </RequireAuth>
  );
}
