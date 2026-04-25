"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  BookOpen,
  Eye,
  FileText,
  Link as LinkIcon,
  PlayCircle,
  Wallet,
} from "lucide-react";
import { toast } from "react-toastify";

const VideoPlayer = dynamic(() => import("@/components/ui/VideoPlayer"), {
  ssr: false,
});

import Topbar from "@/components/layout/Topbar";
import { Shimmer } from "@/components/ui/Shimmer";
import {
  formatCurrencyIdr,
  formatServiceCommissionLabel,
  getPartnerToken,
  type PartnerServiceItem,
  type SalesMaterialItem,
} from "@/lib/partner-portal";
import {
  getAffiliateSalesMaterials,
  getAffiliateServices,
} from "@/services/dashboardService";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3005/api/v1";
const UPLOADS_BASE_URL = BASE_URL.replace(/\/api\/v1$/, "");

const resolveMaterialUrl = (material: SalesMaterialItem) => {
  if (material.fileUrl) {
    return material.fileUrl.startsWith("http")
      ? material.fileUrl
      : `${UPLOADS_BASE_URL}${material.fileUrl}`;
  }
  return material.externalUrl || null;
};

const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
};

const MaterialIcon = ({
  type,
}: {
  type: SalesMaterialItem["materialType"];
}) => {
  switch (type) {
    case "video":
      return <PlayCircle className="h-5 w-5 text-[#E30613]" />;
    case "link":
      return <LinkIcon className="h-5 w-5 text-[#2A399D]" />;
    case "file":
      return <FileText className="h-5 w-5 text-[#0F766E]" />;
    case "rich_text":
    default:
      return <BookOpen className="h-5 w-5 text-[#7C3AED]" />;
  }
};

const SalesKnowledgeBasePage = () => {
  const [services, setServices] = useState<PartnerServiceItem[]>([]);
  const [materials, setMaterials] = useState<SalesMaterialItem[]>([]);
  const [previewMaterial, setPreviewMaterial] =
    useState<SalesMaterialItem | null>(null);
  const [loading, setLoading] = useState(true);

  const sortedMaterials = useMemo(
    () =>
      [...materials].sort((a, b) => {
        const sortA = Number(a.sortOrder ?? 0);
        const sortB = Number(b.sortOrder ?? 0);
        if (sortA !== sortB) return sortA - sortB;
        return (
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
        );
      }),
    [materials],
  );

  useEffect(() => {
    const loadData = async () => {
      const token = getPartnerToken();
      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        setLoading(true);
        const [servicesResponse, materialsResponse] = await Promise.all([
          getAffiliateServices(token),
          getAffiliateSalesMaterials(token),
        ]);
        setServices((servicesResponse?.data || []) as PartnerServiceItem[]);
        setMaterials((materialsResponse?.data || []) as SalesMaterialItem[]);
      } catch (err: any) {
        toast.error(err?.message || "Failed to load sales knowledge base.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <Topbar title="Sales Knowledge Base" />

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-card">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#E30613]">
              SALES ENABLEMENT
            </p>
            {/* <h1 className="mt-3 text-3xl font-semibold text-slate-950">
              Product to sell and commission
            </h1> */}
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Study the latest sales materials prepared by OCTOBEES Singapore
              team.
            </p>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Knowledge Base Scope
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Sales scripts, rich-text playbooks, downloadable files, and
              supporting videos.
            </p>
          </div>
        </div>
      </section>

      {/* <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-card">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-[#E30613]/5 p-3">
            <Wallet className="h-5 w-5 text-[#E30613]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Products to sell and commission</h2>
            <p className="mt-1 text-sm text-slate-500">
              The data below is synced from the back-office commission control.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="mt-6 grid gap-4 xl:grid-cols-2" aria-busy="true" aria-live="polite">
            {Array.from({ length: 4 }).map((_, i) => (
              <article
                key={i}
                className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-5"
              >
                <Shimmer className="h-5 w-1/2" />
                <Shimmer className="mt-3 h-3 w-full" />
                <Shimmer className="mt-2 h-3 w-4/5" />
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-white bg-white p-4">
                    <Shimmer className="h-3 w-24" />
                    <Shimmer className="mt-3 h-5 w-28" />
                  </div>
                  <div className="rounded-2xl border border-white bg-white p-4">
                    <Shimmer className="h-3 w-24" />
                    <Shimmer className="mt-3 h-5 w-28" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : services.length > 0 ? (
          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {services.map((service) => (
              <article key={service.id} className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-950">{service.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{service.description}</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {formatServiceCommissionLabel(service)} Commission
                  </span>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-white bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Project Value</p>
                    <p className="mt-2 text-base font-semibold text-slate-900">
                      {formatCurrencyIdr(service.projectValue)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Commission Rate</p>
                    <p className="mt-2 text-base font-semibold text-slate-900">
                      {formatServiceCommissionLabel(service)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-sm text-slate-500">
            No active services are available yet.
          </div>
        )}
      </section> */}

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-card">
        {/* <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-[#2A399D]/5 p-3">
            <BookOpen className="h-5 w-5 text-[#2A399D]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-950">
              Sales materials
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Read-only resources published by the back-office team to support
              your selling conversations.
            </p>
          </div>
        </div> */}

        {loading ? (
          <div className="mt-6 flex flex-col gap-2" aria-busy="true" aria-live="polite">
            {Array.from({ length: 5 }).map((_, i) => (
              <article
                key={i}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3"
              >
                <Shimmer className="h-10 w-10 rounded-xl" />
                <div className="flex-1">
                  <Shimmer className="h-4 w-1/2" />
                  <Shimmer className="mt-2 h-3 w-3/4" />
                </div>
                <Shimmer className="h-8 w-20 rounded-full" />
              </article>
            ))}
          </div>
        ) : sortedMaterials.length > 0 ? (
          <div className="mt-6 flex flex-col gap-2">
            {sortedMaterials.map((material) => {
              const materialUrl = resolveMaterialUrl(material);
              return (
                <article
                  key={material.id}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3"
                >
                  <div className="rounded-xl bg-white p-2 shadow-sm shrink-0">
                    <MaterialIcon type={material.materialType} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-slate-950 truncate">
                      {material.title}
                    </h3>
                    {material.summary ? (
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {material.summary}
                      </p>
                    ) : null}
                  </div>
                  <span className="hidden sm:inline-flex shrink-0 items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    {material.materialType.replace("_", " ")}
                  </span>
                  {(material.materialType === "file" ||
                    material.materialType === "link") &&
                  materialUrl ? (
                    <a
                      href={materialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:border-[#E30613] hover:text-[#E30613]"
                    >
                      <Eye className="h-3.5 w-3.5" />{" "}
                      {material.materialType === "link"
                        ? "Open Link"
                        : "Open File"}
                    </a>
                  ) : (
                    <button
                      onClick={() => setPreviewMaterial(material)}
                      className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:border-[#E30613] hover:text-[#E30613]"
                    >
                      <Eye className="h-3.5 w-3.5" /> Preview
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-sm text-slate-500">
            No sales materials are available yet.
          </div>
        )}
      </section>
      {previewMaterial && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-md"
            onClick={() => setPreviewMaterial(null)}
          />
          <div className="fixed inset-0 z-[70] overflow-y-auto overscroll-contain">
            <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
              <div className="relative w-full max-w-4xl rounded-2xl bg-white p-5 shadow-2xl sm:rounded-[28px] sm:p-8">
                <div className="flex items-start justify-between gap-6 pb-6 border-b border-slate-100">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-900">
                      {previewMaterial.title}
                    </h2>
                    <p className="mt-2 text-xs font-semibold text-slate-400 uppercase tracking-[0.18em]">
                      {previewMaterial.materialType.replace("_", " ")}
                    </p>
                  </div>
                  <button
                    onClick={() => setPreviewMaterial(null)}
                    className="rounded-full bg-slate-50 p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 border border-slate-200"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="mt-8">
                  {previewMaterial.summary && (
                    <p className="text-sm text-slate-600 mb-6 bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50 leading-relaxed">
                      {previewMaterial.summary}
                    </p>
                  )}

                  {previewMaterial.materialType === "video" &&
                    resolveMaterialUrl(previewMaterial) && (
                      <div className="mb-6">
                        <VideoPlayer
                          url={resolveMaterialUrl(previewMaterial)!}
                        />
                      </div>
                    )}

                  {previewMaterial.content &&
                    (() => {
                      let htmlContent = previewMaterial.content;
                      const baseApi = process.env.NEXT_PUBLIC_BASE_URL || "";
                      const baseUploads = baseApi
                        ? baseApi.replace("/api/v1", "/uploads")
                        : "http://localhost:3005/uploads";

                      htmlContent = htmlContent.replace(
                        /src="\/uploads\//g,
                        `src="${baseUploads}/`,
                      );
                      htmlContent = htmlContent.replace(
                        /src="http:\/\/localhost:3005\/uploads\//g,
                        `src="${baseUploads}/`,
                      );

                      return (
                        <div className="prose prose-sm xl:prose-base max-w-none text-slate-700">
                          <div
                            dangerouslySetInnerHTML={{ __html: htmlContent }}
                          />
                        </div>
                      );
                    })()}

                  {previewMaterial.materialType !== "video" &&
                    resolveMaterialUrl(previewMaterial) && (
                      <div
                        className={`flex justify-center ${previewMaterial.content ? "mt-10 pt-8 border-t border-slate-100" : ""}`}
                      >
                        <a
                          href={resolveMaterialUrl(previewMaterial)!}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex rounded-full bg-[#E30613] px-10 py-3.5 text-sm font-semibold text-white transition hover:bg-[#b1050f] shadow-md hover:shadow-lg"
                        >
                          Open Attachment / External Link
                        </a>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SalesKnowledgeBasePage;
