"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type MetaRow = {
  key: string; // 'name' | 'property'
  value: string; // e.g., description, og:title
  content: string; // meta content
};

type Props = {
  metas: MetaRow[];
  onChange: (rows: MetaRow[]) => void;
};

export default function SEOMetaFormSection({ metas, onChange }: Props) {
  const updateRow = (idx: number, patch: Partial<MetaRow>) => {
    const next = metas.map((row, i) => (i === idx ? { ...row, ...patch } : row));
    onChange(next);
  };

  const addRow = () => {
    onChange([
      ...metas,
      {
        key: "name",
        value: "",
        content: "",
      },
    ]);
  };

  const removeRow = (idx: number) => {
    const next = metas.filter((_, i) => i !== idx);
    onChange(next.length ? next : [{ key: "name", value: "", content: "" }]);
  };

  return (
    <section className="mt-6 rounded-2xl bg-white border border-border shadow-sm">
      <div className="p-5 md:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Meta Tags</h3>
        <p className="text-sm text-gray-600 mb-4">Isi meta tag seperti description, og:title, twitter:card. Field key akan otomatis diatur ke "name" atau "property".</p>

        <div className="flex flex-col gap-5">
          {metas.map((row, idx) => (
            <div key={idx} className="rounded-xl border border-gray-200 p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor={`meta-key-${idx}`} className="text-sm font-medium text-gray-700">Key</label>
                  <Input
                    id={`meta-key-${idx}`}
                    aria-label="Meta key"
                    placeholder="name atau property"
                    value={row.key}
                    onChange={(e) => updateRow(idx, { key: e.target.value })}
                    className="py-2 px-4 text-black focus:ring focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor={`meta-value-${idx}`} className="text-sm font-medium text-gray-700">Value</label>
                  <Input
                    id={`meta-value-${idx}`}
                    aria-label="Meta value"
                    placeholder="e.g. description, og:title, twitter:card"
                    value={row.value}
                    onChange={(e) => updateRow(idx, { value: e.target.value })}
                    className="py-2 px-4 text-black focus:ring focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-2 md:col-span-1">
                  <label htmlFor={`meta-content-${idx}`} className="text-sm font-medium text-gray-700">Content</label>
                  <Textarea
                    id={`meta-content-${idx}`}
                    aria-label="Meta content"
                    placeholder="Isi konten meta, misalnya deskripsi singkat atau judul untuk Open Graph"
                    value={row.content}
                    onChange={(e) => updateRow(idx, { content: e.target.value })}
                    className="py-2 px-4 text-black focus:ring focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-end text-xs text-gray-500">
                <button
                  type="button"
                  onClick={() => removeRow(idx)}
                  className="text-red-600 hover:text-red-700"
                  aria-label="Remove meta row"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div>
            <button
              type="button"
              onClick={addRow}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
            >
              + Add Meta Tag
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
