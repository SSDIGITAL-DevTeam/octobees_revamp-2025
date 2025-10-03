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

const MAX = { title: 60, keyword: 70, description: 160 };

const SEOFormSection: React.FC<SEOFormSectionProps> = React.memo(({ title, keyword, description, onChange }) => {
  const titleCount = title?.length || 0;
  const keyCount = keyword?.length || 0;
  const descCount = description?.length || 0;

  const color = (ok: boolean) => (ok ? "text-green-600" : "text-red-600");
  const border = (ok: boolean) => (ok ? "border-gray-300" : "border-red-500");

  return (
    <section className="mt-6 rounded-2xl bg-white border border-border shadow-sm">
      <div className="p-5 md:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO</h3>

        <div className="flex flex-col gap-4">
          {/* SEO Title */}
          <div className="flex flex-col gap-2">
            <label htmlFor="seo-title" className="text-sm font-medium text-gray-700">
              Title
            </label>
            <Input
              id="seo-title"
              aria-label="SEO Title"
              placeholder="Enter a title (max 60)"
              value={title}
              onChange={(e) => onChange({ title: e.target.value.slice(0, MAX.title) })}
              className={`py-2 px-4 text-black focus:ring focus:ring-blue-500 focus:border-blue-500 ${border(titleCount <= MAX.title)}`}
              maxLength={MAX.title}
            />
            <div className={`flex justify-end text-xs ${color(titleCount <= MAX.title)}`}>{titleCount}/{MAX.title}</div>
          </div>

          {/* SEO Keyword */}
          <div className="flex flex-col gap-2">
            <label htmlFor="seo-keyword" className="text-sm font-medium text-gray-700">
              Keyword
            </label>
            <Input
              id="seo-keyword"
              aria-label="SEO Keyword"
              placeholder="Enter the main SEO keyword (max 70)"
              value={keyword}
              onChange={(e) => onChange({ keyword: e.target.value.slice(0, MAX.keyword) })}
              maxLength={MAX.keyword}
              className={`py-2 px-4 text-black focus:ring focus:ring-blue-500 focus:border-blue-500 ${border(keyCount <= MAX.keyword)}`}
            />
            <div className={`flex justify-end text-xs ${color(keyCount <= MAX.keyword)}`}>{keyCount}/{MAX.keyword}</div>
          </div>

          {/* SEO Description */}
          <div className="flex flex-col gap-2">
            <label htmlFor="seo-description" className="text-sm font-medium text-gray-700">
              Description
            </label>
            <Textarea
              id="seo-description"
              aria-label="SEO Description"
              placeholder="Write a short SEO description (max 160)"
              value={description}
              onChange={(e) => onChange({ description: e.target.value.slice(0, MAX.description) })}
              maxLength={MAX.description}
              className={`py-2 px-4 text-black focus:ring focus:ring-blue-500 focus:border-blue-500 ${border(descCount <= MAX.description)}`}
            />
            <div className={`flex justify-end text-xs ${color(descCount <= MAX.description)}`}>{descCount}/{MAX.description}</div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default SEOFormSection;
