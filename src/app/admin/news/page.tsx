"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Loader2, Newspaper, Plus, Trash2 } from "lucide-react";
import { adminFetch, getAdminScope } from "@/lib/adminApi";
import rawNewsItems from "@/data/news_items.json";

type NewsArticle = {
  id: number;
  titleEn: string;
  titleHi: string;
  dateLabel: string;
  source: string;
  imageUrl: string;
  descEn: string;
  descHi: string;
  contentEn: string[];
  contentHi: string[];
  published: boolean;
  sortOrder: number;
};

const emptyForm = {
  titleEn: "",
  titleHi: "",
  dateLabel: "",
  source: "PGP",
  imageUrl: "",
  descEn: "",
  descHi: "",
  contentEn: "",
  contentHi: "",
  published: true,
  sortOrder: 0,
};

export default function AdminNewsPage() {
  const [items, setItems] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const canEdit = getAdminScope() === "edit";

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminFetch<NewsArticle[]>("admin/news");
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message || "Failed to load news");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const startEdit = (article: NewsArticle) => {
    setEditingId(article.id);
    setForm({
      titleEn: article.titleEn,
      titleHi: article.titleHi,
      dateLabel: article.dateLabel,
      source: article.source,
      imageUrl: article.imageUrl,
      descEn: article.descEn,
      descHi: article.descHi,
      contentEn: (article.contentEn || []).join("\n"),
      contentHi: (article.contentHi || []).join("\n"),
      published: article.published,
      sortOrder: article.sortOrder,
    });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;
    setSaving(true);
    setError("");
    const payload = {
      titleEn: form.titleEn.trim(),
      titleHi: form.titleHi.trim(),
      dateLabel: form.dateLabel.trim(),
      source: form.source.trim() || "PGP",
      imageUrl: form.imageUrl.trim(),
      descEn: form.descEn.trim(),
      descHi: form.descHi.trim(),
      contentEn: form.contentEn.split("\n").map((s) => s.trim()).filter(Boolean),
      contentHi: form.contentHi.split("\n").map((s) => s.trim()).filter(Boolean),
      published: form.published,
      sortOrder: Number(form.sortOrder) || 0,
    };
    try {
      if (editingId) {
        await adminFetch(`admin/news/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch("admin/news", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      resetForm();
      await load();
    } catch (err: any) {
      setError(err?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!canEdit) return;
    if (!window.confirm("Delete this article?")) return;
    try {
      await adminFetch(`admin/news/${id}`, { method: "DELETE" });
      if (editingId === id) resetForm();
      await load();
    } catch (err: any) {
      setError(err?.message || "Delete failed");
    }
  };

  const importStatic = async () => {
    if (!canEdit) return;
    if (!window.confirm("Import all static news JSON into the CMS? Existing IDs will be updated.")) return;
    setImporting(true);
    setError("");
    try {
      await adminFetch("admin/news/import-static", {
        method: "POST",
        body: JSON.stringify({ items: rawNewsItems }),
      });
      await load();
    } catch (err: any) {
      setError(err?.message || "Import failed");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#16A34A]">Content</p>
          <h1 className="mt-1 text-2xl font-black text-[#04330B] flex items-center gap-2">
            <Newspaper size={22} /> News CMS
          </h1>
          <p className="mt-1 text-sm text-[#587E67]">
            Manage public news on /news. Site falls back to static JSON until CMS has published articles.
          </p>
        </div>
        {canEdit && (
          <button
            type="button"
            onClick={importStatic}
            disabled={importing}
            className="inline-flex items-center gap-2 rounded-xl border border-[#B9D3C4] bg-white px-4 py-2.5 text-sm font-semibold text-[#04330B] hover:bg-[#F5FBF7] disabled:opacity-60"
          >
            {importing ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            Import static JSON
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {!canEdit && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm font-semibold text-amber-800">
          View-only admin: you can browse articles but not create or edit.
        </div>
      )}

      {canEdit && (
        <form onSubmit={save} className="rounded-2xl border border-[#B9D3C4] bg-white p-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-bold text-[#04330B]">
              {editingId ? `Edit #${editingId}` : "New article"}
            </h2>
            {editingId && (
              <button type="button" onClick={resetForm} className="text-sm font-semibold text-[#587E67]">
                Cancel edit
              </button>
            )}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <input className="h-11 rounded-xl border border-[#DDEEE4] px-3 text-sm" placeholder="Title (EN)" required value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} />
            <input className="h-11 rounded-xl border border-[#DDEEE4] px-3 text-sm" placeholder="Title (HI)" required value={form.titleHi} onChange={(e) => setForm({ ...form, titleHi: e.target.value })} />
            <input className="h-11 rounded-xl border border-[#DDEEE4] px-3 text-sm" placeholder="Date label" required value={form.dateLabel} onChange={(e) => setForm({ ...form, dateLabel: e.target.value })} />
            <input className="h-11 rounded-xl border border-[#DDEEE4] px-3 text-sm" placeholder="Source" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
            <input className="h-11 rounded-xl border border-[#DDEEE4] px-3 text-sm md:col-span-2" placeholder="Image URL (/News-image/...)" required value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
            <textarea className="min-h-[72px] rounded-xl border border-[#DDEEE4] px-3 py-2 text-sm" placeholder="Short desc (EN)" required value={form.descEn} onChange={(e) => setForm({ ...form, descEn: e.target.value })} />
            <textarea className="min-h-[72px] rounded-xl border border-[#DDEEE4] px-3 py-2 text-sm" placeholder="Short desc (HI)" required value={form.descHi} onChange={(e) => setForm({ ...form, descHi: e.target.value })} />
            <textarea className="min-h-[100px] rounded-xl border border-[#DDEEE4] px-3 py-2 text-sm" placeholder="Body paragraphs EN (one per line)" value={form.contentEn} onChange={(e) => setForm({ ...form, contentEn: e.target.value })} />
            <textarea className="min-h-[100px] rounded-xl border border-[#DDEEE4] px-3 py-2 text-sm" placeholder="Body paragraphs HI (one per line)" value={form.contentHi} onChange={(e) => setForm({ ...form, contentHi: e.target.value })} />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-[#04330B]">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
              Published
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-[#04330B]">
              Sort
              <input type="number" className="h-10 w-20 rounded-xl border border-[#DDEEE4] px-2" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
            </label>
            <button type="submit" disabled={saving} className="ml-auto inline-flex items-center gap-2 rounded-xl bg-[#04330B] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">
              {saving ? <Loader2 size={16} className="animate-spin" /> : null}
              {editingId ? "Update" : "Create"}
            </button>
          </div>
        </form>
      )}

      <div className="rounded-2xl border border-[#B9D3C4] bg-white overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-[#587E67]">
            <Loader2 className="animate-spin" size={18} /> Loading…
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center text-sm font-semibold text-[#587E67]">
            No CMS articles yet. Import static JSON or create one above.
          </div>
        ) : (
          <div className="divide-y divide-[#E6F0EA]">
            {items.map((article) => (
              <div key={article.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-[#04330B] truncate">{article.titleEn}</p>
                  <p className="text-xs text-[#587E67]">
                    #{article.id} · {article.dateLabel} · {article.source} ·{" "}
                    {article.published ? "Published" : "Draft"}
                  </p>
                </div>
                {canEdit && (
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => startEdit(article)} className="rounded-lg border border-[#B9D3C4] px-3 py-1.5 text-xs font-bold text-[#04330B]">
                      Edit
                    </button>
                    <button type="button" onClick={() => remove(article.id)} className="rounded-lg border border-red-200 px-2 py-1.5 text-red-600">
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
