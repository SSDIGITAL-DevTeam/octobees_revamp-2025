"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type SEOFormSectionProps = {
  title: string;
  keyword: string;
  description: string;
  onChange: (v: Partial<{ title: string; keyword: string; description: string }>) => void;
};

const SEOFormSection: React.FC<SEOFormSectionProps> = ({ title, keyword, description, onChange }) => {
  const descCount = description?.length || 0;
  return (
    <section className="mt-6 rounded-2xl bg-white border border-border shadow-sm">
      <div className="p-5 md:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO</h3>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="seo-title" className="text-sm font-medium text-gray-700">
              Title
            </label>
            <Input
              id="seo-title"
              aria-label="SEO Title"
              placeholder="Enter a title"
              value={title}
              onChange={(e) => onChange({ title: e.target.value })}
              className="py-2 px-4 text-black focus:ring focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="seo-keyword" className="text-sm font-medium text-gray-700">
              Keyword
            </label>
            <Input
              id="seo-keyword"
              aria-label="SEO Keyword"
              placeholder="Enter the main SEO keyword"
              value={keyword}
              onChange={(e) => onChange({ keyword: e.target.value.slice(0, 70) })}
              maxLength={70}
              className="py-2 px-4 text-black focus:ring focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500">Maksimal 70 karakter</p>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="seo-description" className="text-sm font-medium text-gray-700">
              Description
            </label>
            <Textarea
              id="seo-description"
              aria-label="SEO Description"
              placeholder="Write a short SEO description (max 160 characters)"
              value={description}
              onChange={(e) => onChange({ description: e.target.value.slice(0, 160) })}
              maxLength={160}
              className="py-2 px-4 text-black focus:ring focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="flex justify-end text-xs text-gray-500">{descCount}/160</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SEOFormSection;
