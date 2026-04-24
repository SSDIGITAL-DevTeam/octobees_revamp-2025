"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createAffiliateLeadNote,
  deleteAffiliateLeadNote,
  getAffiliateLeadNotes,
  updateAffiliateLeadNote,
} from "@/services/dashboardService";
import { getPartnerToken, formatDateTime } from "@/lib/partner-portal";
import { Shimmer } from "@/components/ui/Shimmer";

type Note = {
  id: string;
  content: string;
  createdByType: string;
  createdAt: string;
  updatedAt: string;
};

type LeadNotesPanelProps = {
  leadId: string;
};

const LeadNotesPanel = ({ leadId }: LeadNotesPanelProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newContent, setNewContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadNotes = useCallback(async () => {
    const token = getPartnerToken();
    if (!token) return;
    try {
      setLoading(true);
      const res = await getAffiliateLeadNotes(token, leadId);
      setNotes(res?.data || []);
    } catch (err: any) {
      setError(err?.message || "Failed to load notes");
    } finally {
      setLoading(false);
    }
  }, [leadId]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const handleAdd = async () => {
    const token = getPartnerToken();
    if (!token || !newContent.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      await createAffiliateLeadNote(token, leadId, newContent.trim());
      setNewContent("");
      await loadNotes();
    } catch (err: any) {
      setError(err?.message || "Failed to add note");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveEdit = async (noteId: string) => {
    const token = getPartnerToken();
    if (!token || !editContent.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      await updateAffiliateLeadNote(token, leadId, noteId, editContent.trim());
      setEditingId(null);
      await loadNotes();
    } catch (err: any) {
      setError(err?.message || "Failed to update note");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (noteId: string) => {
    const token = getPartnerToken();
    if (!token) return;
    setError("");
    try {
      await deleteAffiliateLeadNote(token, leadId, noteId);
      await loadNotes();
    } catch (err: any) {
      setError(err?.message || "Failed to delete note");
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <h3 className="text-base font-semibold text-slate-900">Notes</h3>
      <p className="mt-1 text-sm text-slate-500">
        Keep track of important details, call summaries, or next steps for this lead.
      </p>

      {error ? (
        <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="mt-4 space-y-2">
        <textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Write a note..."
          disabled={submitting}
          className="min-h-[90px] w-full rounded-3xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#E30613] focus:outline-none transition"
        />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleAdd}
            disabled={submitting || !newContent.trim()}
            className="rounded-full bg-[#E30613] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#b1050f] disabled:opacity-60"
          >
            {submitting ? "Adding..." : "Add Note"}
          </button>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {loading ? (
          <div className="space-y-3" aria-busy="true" aria-live="polite">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 space-y-2">
                    <Shimmer className="h-3 w-full" />
                    <Shimmer className="h-3 w-11/12" />
                    <Shimmer className="h-3 w-2/3" />
                    <Shimmer className="mt-1 h-2.5 w-40" />
                  </div>
                  <div className="hidden shrink-0 items-center gap-3 sm:flex">
                    <Shimmer className="h-3 w-8" />
                    <Shimmer className="h-3 w-10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-5 text-sm text-slate-500">
            No notes yet. Add the first note above.
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              {editingId === note.id ? (
                <div className="space-y-3">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="min-h-[80px] w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-[#E30613] focus:outline-none transition"
                    disabled={submitting}
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(note.id)}
                      disabled={submitting || !editContent.trim()}
                      className="rounded-full bg-[#E30613] px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="rounded-full border border-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <p className="text-sm leading-6 text-slate-800 whitespace-pre-wrap">{note.content}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {note.createdByType === "admin" ? "Admin" : "You"} · {formatDateTime(note.createdAt)}
                      {note.updatedAt !== note.createdAt ? ` · edited` : ""}
                    </p>
                  </div>
                  {note.createdByType === "partner" && (
                    <div className="flex shrink-0 items-center gap-3">
                      <button
                        type="button"
                        onClick={() => { setEditingId(note.id); setEditContent(note.content); }}
                        className="text-xs font-semibold text-[#E30613] transition hover:text-[#b1050f]"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(note.id)}
                        className="text-xs font-semibold text-slate-400 transition hover:text-rose-600"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LeadNotesPanel;
