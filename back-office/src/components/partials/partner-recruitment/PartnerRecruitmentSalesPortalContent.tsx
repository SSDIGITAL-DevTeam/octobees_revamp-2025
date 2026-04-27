"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  Plus,
  Trash2,
  DollarSign,
  Gift,
  AlertCircle,
  ChevronDown,
  Clock3,
  Percent,
  Info,
  Calendar,
  Library,
  FileText,
  Pencil,
  RotateCcw,
  Tag,
  Timer,
  UploadCloud,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import Header from "@/components/layout/header/Header";
import { CommissionControlTable } from "@/components/partials/partnership/CommissionControlTable";
import { CommissionServiceModal } from "@/components/partials/partnership/CommissionServiceModal";
import { PerformancePolicySettings } from "@/components/partials/partnership/PerformancePolicySettings";
import { CommissionDisbursementPanel } from "@/components/partials/partnership/CommissionDisbursementPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  PartnerServiceApiItem,
  SalesMaterialApiItem,
} from "@/lib/api/partnership/dashboardPartnership";
import {
  createSalesMaterial,
  deleteSalesMaterial,
  updateSalesMaterial,
  getSalesMaterials,
  getPartnerTermsAndConditions,
  getPartnerServices,
  updatePartnerServiceCommissionSetting,
  getPartnerPerformanceSettings,
  updatePartnerTermsAndConditions,
  updatePartnerPerformanceSettings,
} from "@/lib/api/partnership/dashboardPartnership";
import {
  getAssessmentSettings,
  updateAssessmentSettings,
  type AssessmentSettings,
} from "@/lib/api/assessment";
import { useBatches } from "@/hooks/partnership/useBatches";
import useRecruitmentModuleConfig from "./useRecruitmentModuleConfig";
import { EmbeddedRuleConditions } from "@/components/partials/partner-recruitment/EmbeddedRuleConditions";
import { WelcomeBonusRuleTable } from "@/components/partials/partner-recruitment/WelcomeBonusRulePanel";
import { getCurrencySymbol, useCurrencyStore } from "@/app/store/currency";

const CKEditorComponent = dynamic(
  () => import("@/components/partials/form/CKEditorComponent"),
  { ssr: false },
);

const salesMaterialTypeOptions = [
  { label: "PDF / Image", value: "file" },
  { label: "Video", value: "video" },
  { label: "Link", value: "link" },
  { label: "Text-based", value: "rich_text" },
] as const;

const getSalesMaterialInputLabel = (materialType: string) => {
  if (materialType === "file") return "Upload File";
  if (materialType === "rich_text") return "Text Content";
  return "External URL";
};

export type SalesPortalSection =
  | "product-service"
  | "commission-setting"
  | "disbursement"
  | "initial-commission"
  | "basic-commission"
  | "sales-commission"
  | "terms-and-conditions";

const salesPortalSectionMeta: Record<
  SalesPortalSection,
  { title: string; description: string }
> = {
  "product-service": {
    title: "Product & Service Catalog",
    description:
      "Manage the catalog of products that partners can sell, and upload promotional materials (like flyers or links) that partners can use to make a sale.",
  },
  "commission-setting": {
    title: "Commission Setting Overview",
    description:
      "Overview of all financial configurations. Select a specific category below to adjust how partners are compensated.",
  },
  disbursement: {
    title: "Payout & Disbursement",
    description:
      "Schedule payout dates and process commission payouts for your partners. You must upload a transfer receipt before a payout is officially marked as 'Paid'.",
  },
  "initial-commission": {
    title: "Welcome Bonus (Initial Commission)",
    description:
      "Set up per-batch welcome bonus tiers and payout conditions for new partners.",
  },
  "basic-commission": {
    title: "Basic Commission & Penalty Rules",
    description:
      "Set minimum sales targets (e.g., minimum transactions per month) and configure warnings/penalties for inactive partners.",
  },
  "sales-commission": {
    title: "Sales Commission Rates",
    description:
      "Define exactly how much commission a partner earns every time they successfully sell a specific product or service.",
  },
  "terms-and-conditions": {
    title: "Partner Terms & Conditions",
    description:
      "Write and update the legally binding agreement that partners must accept before they can start selling.",
  },
};

export const PartnerRecruitmentSalesPortalContent = ({
  section = "product-service",
}: {
  section?: SalesPortalSection;
}) => {
  const { batches, updateBatch } = useBatches();
  const { config, updateConfig } = useRecruitmentModuleConfig();
  const { currency } = useCurrencyStore();
  const currencySymbol = getCurrencySymbol(currency);

  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] =
    useState<PartnerServiceApiItem | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [materials, setMaterials] = useState<SalesMaterialApiItem[]>([]);
  const [serviceRows, setServiceRows] = useState<PartnerServiceApiItem[]>([]);
  const [materialForm, setMaterialForm] = useState({
    title: "",
    summary: "",
    materialType: "file",
    content: "",
    externalUrl: "",
    file: null as File | null,
  });
  const [savingMaterial, setSavingMaterial] = useState(false);
  const [materialModalOpen, setMaterialModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] =
    useState<SalesMaterialApiItem | null>(null);
  const [materialToDelete, setMaterialToDelete] =
    useState<SalesMaterialApiItem | null>(null);
  const [loadingTerms, setLoadingTerms] = useState(true);
  const [savingTerms, setSavingTerms] = useState(false);
  const [assessmentSettings, setAssessmentSettings] =
    useState<AssessmentSettings | null>(null);
  const [assessmentSettingsForm, setAssessmentSettingsForm] = useState({
    examWaitHours: 24,
    examDurationMinutes: 60,
    screeningPassingScore: 80,
    maxExamAttempts: 2,
  });
  const [savingAssessmentSettings, setSavingAssessmentSettings] =
    useState(false);
  const [savingBasicWarnings, setSavingBasicWarnings] = useState(false);
  const [savingSalesCommissionId, setSavingSalesCommissionId] = useState<
    string | null
  >(null);
  const [payoutDate, setPayoutDate] = useState("");
  const [savingPayoutDate, setSavingPayoutDate] = useState(false);
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(
    null,
  );

  const [graceDays, setGraceDays] = useState("");
  const [savingGrace, setSavingGrace] = useState(false);

  const [warningDraft, setWarningDraft] = useState(
    config.basicCommissionWarnings,
  );

  useEffect(() => {
    setWarningDraft(config.basicCommissionWarnings);
  }, [config.basicCommissionWarnings]);

  const loadSalesPortalDependencies = async () => {
    const [
      materialsRes,
      servicesRes,
      perfSettingsRes,
      termsRes,
      assessmentRes,
    ] = await Promise.all([
      getSalesMaterials(),
      getPartnerServices({ page: 1, limit: 100 }),
      getPartnerPerformanceSettings().catch(() => null),
      getPartnerTermsAndConditions().catch(() => null),
      getAssessmentSettings().catch(() => null),
    ]);

    setMaterials(materialsRes.data.data || []);
    const nextServiceRows = servicesRes.data.data || [];
    setServiceRows(nextServiceRows);
    updateConfig((current) => ({
      ...current,
      salesCommissionByServiceId: nextServiceRows.reduce(
        (acc, service) => {
          acc[service.id] = {
            mode: service.commissionMode || "percentage",
            value: Number(
              service.commissionValue ?? service.commissionPercentage ?? 0,
            ),
          };
          return acc;
        },
        {} as typeof current.salesCommissionByServiceId,
      ),
    }));

    // Load payout date & other settings from server
    if (perfSettingsRes?.data?.data) {
      const serverDate = String(
        perfSettingsRes.data.data.monthlyPayoutDate || "",
      );
      setPayoutDate(serverDate);

      const grace = String(
        perfSettingsRes.data.data.terminationGraceDays || "",
      );
      setGraceDays(grace);

      updateConfig((current) => ({
        ...current,
        disbursementDate: serverDate,
      }));
    }

    if (termsRes?.data?.data?.html) {
      updateConfig((current) => ({
        ...current,
        termsAndConditionsHtml: termsRes.data.data.html,
      }));
    }

    if (assessmentRes?.data) {
      setAssessmentSettings(assessmentRes.data);
      setAssessmentSettingsForm({
        examWaitHours: Number(assessmentRes.data.examWaitHours || 24),
        examDurationMinutes: Number(
          assessmentRes.data.examDurationMinutes || 60,
        ),
        screeningPassingScore: Number(
          assessmentRes.data.screeningPassingScore || 80,
        ),
        maxExamAttempts: Number(assessmentRes.data.maxExamAttempts || 2),
      });
    }
  };

  useEffect(() => {
    const run = async () => {
      try {
        setLoadingTerms(true);
        await loadSalesPortalDependencies();
      } catch {
        toast.error("Failed to load sales portal data");
      } finally {
        setLoadingTerms(false);
      }
    };

    run();
  }, [refreshKey]);

  const saveTermsAndConditions = async () => {
    setSavingTerms(true);

    try {
      await updatePartnerTermsAndConditions(config.termsAndConditionsHtml);
      toast.success("Terms & Conditions saved successfully");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save Terms & Conditions",
      );
    } finally {
      setSavingTerms(false);
    }
  };

  const saveAssessmentRuntimeRules = async () => {
    if (!assessmentSettings?.id) {
      toast.error("Assessment settings record is not available");
      return;
    }

    if (
      assessmentSettingsForm.examWaitHours < 1 ||
      assessmentSettingsForm.examDurationMinutes < 1 ||
      assessmentSettingsForm.screeningPassingScore < 1 ||
      assessmentSettingsForm.screeningPassingScore > 100 ||
      assessmentSettingsForm.maxExamAttempts < 1
    ) {
      toast.error("Please enter valid assessment rule values");
      return;
    }

    try {
      setSavingAssessmentSettings(true);
      await updateAssessmentSettings(assessmentSettings.id, {
        examWaitHours: assessmentSettingsForm.examWaitHours,
        examDurationMinutes: assessmentSettingsForm.examDurationMinutes,
        screeningPassingScore: assessmentSettingsForm.screeningPassingScore,
        maxExamAttempts: assessmentSettingsForm.maxExamAttempts,
      });
      toast.success("Assessment runtime rules updated");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save assessment runtime rules",
      );
    } finally {
      setSavingAssessmentSettings(false);
    }
  };

  const saveMaterial = async () => {
    if (!materialForm.title.trim()) {
      toast.error("Material title is required");
      return;
    }

    try {
      setSavingMaterial(true);
      const payload = new FormData();
      payload.append("title", materialForm.title);
      payload.append("summary", materialForm.summary);
      payload.append("materialType", materialForm.materialType);
      payload.append("content", materialForm.content);
      payload.append("externalUrl", materialForm.externalUrl);
      payload.append("isActive", "true");

      if (materialForm.file) {
        payload.append("file", materialForm.file);
      }

      if (editingMaterial) {
        await updateSalesMaterial(editingMaterial.id, payload);
        toast.success("Sales material updated");
      } else {
        payload.append("sortOrder", String(materials.length + 1));
        await createSalesMaterial(payload);
        toast.success("Sales material added");
      }

      setMaterialForm({
        title: "",
        summary: "",
        materialType: "file",
        content: "",
        externalUrl: "",
        file: null,
      });
      setEditingMaterial(null);
      setMaterialModalOpen(false);
      setRefreshKey((current) => current + 1);
    } catch {
      toast.error(
        editingMaterial
          ? "Failed to update sales material"
          : "Failed to add sales material",
      );
    } finally {
      setSavingMaterial(false);
    }
  };

  const handleOpenMaterialModal = (material?: SalesMaterialApiItem) => {
    if (material) {
      setEditingMaterial(material);
      setMaterialForm({
        title: material.title || "",
        summary: material.summary || "",
        materialType: material.materialType || "file",
        content: material.content || "",
        externalUrl: material.externalUrl || material.fileUrl || "",
        file: null,
      });
    } else {
      setEditingMaterial(null);
      setMaterialForm({
        title: "",
        summary: "",
        materialType: "file",
        content: "",
        externalUrl: "",
        file: null,
      });
    }
    setMaterialModalOpen(true);
  };

  const saveBasicWarnings = async () => {
    setSavingBasicWarnings(true);
    updateConfig((current) => ({
      ...current,
      basicCommissionWarnings: warningDraft,
    }));
    setSavingBasicWarnings(false);
    toast.success("Basic commission warning rules saved");
  };

  const saveSalesCommissionRow = async (service: PartnerServiceApiItem) => {
    const serviceConfig = config.salesCommissionByServiceId[service.id] || {
      mode: (service.commissionMode || "percentage") as "percentage" | "fixed",
      value: Number(
        service.commissionValue ?? service.commissionPercentage ?? 0,
      ),
    };

    try {
      setSavingSalesCommissionId(service.id);
      await updatePartnerServiceCommissionSetting(service.id, serviceConfig);
      toast.success(
        serviceConfig.mode === "percentage"
          ? "Percentage commission saved"
          : "Fixed commission saved",
      );
      setRefreshKey((current) => current + 1);
    } catch {
      toast.error("Failed to save sales commission setting");
    } finally {
      setSavingSalesCommissionId(null);
    }
  };

  const activeSectionMeta = salesPortalSectionMeta[section];

  let pageContent: React.ReactNode = null;

  if (section === "product-service") {
    pageContent = (
      <section className="space-y-6">
        {/* <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl text-white shadow-md">
          <div className="flex items-center gap-4">
             <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
               <Tag className="h-6 w-6 text-blue-400" />
             </div>
             <div>
               <h2 className="text-xl font-bold tracking-tight">Product & Service Catalog</h2>
               <p className="text-slate-300 text-sm mt-1">Manage the fundamental packages available for your partners to sell.</p>
             </div>
          </div>
        </div> */}

        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <CommissionControlTable
            key={refreshKey}
            onRefresh={() => setRefreshKey((current) => current + 1)}
            onAddNew={() => {
              setEditingService(null);
              setServiceModalOpen(true);
            }}
            onEdit={(service) => {
              setEditingService(service);
              setServiceModalOpen(true);
            }}
          />
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/50 p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 flex-shrink-0 bg-blue-50 border border-blue-100 flex items-center justify-center rounded-2xl">
                <Library className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Sales Material Library
                </h3>
                <p className="text-sm text-slate-500 mt-1 max-w-2xl">
                  Upload promotional assets (flyers, videos, links) that your
                  partners can use to make a sale.
                </p>
              </div>
            </div>
            <Button
              onClick={() => handleOpenMaterialModal()}
              className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl px-5 font-semibold shrink-0"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Material
            </Button>
          </div>

          <div className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-100/50 text-slate-600 hover:bg-slate-100/50">
                  <TableHead className="font-semibold px-6 py-4">
                    Title
                  </TableHead>
                  <TableHead className="font-semibold py-4">Type</TableHead>
                  <TableHead className="font-semibold py-4">Summary</TableHead>
                  <TableHead className="font-semibold text-right px-6 py-4">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-40 text-center text-slate-500"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Library className="h-8 w-8 text-slate-300" />
                        <p>No sales material configured yet.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  materials.map((item) => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <TableCell className="font-semibold text-slate-900 px-6 py-4">
                        {item.title}
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 uppercase tracking-wider">
                          {item.materialType}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-500 py-4">
                        {item.summary || "-"}
                      </TableCell>
                      <TableCell className="text-right px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 text-slate-400 transition-colors"
                            onClick={() => handleOpenMaterialModal(item)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-rose-50 hover:text-rose-600 text-slate-400 transition-colors"
                            onClick={() => setMaterialToDelete(item)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <Dialog open={materialModalOpen} onOpenChange={setMaterialModalOpen}>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingMaterial ? "Edit Sales Material" : "Add Sales Material"}
              </DialogTitle>
              <DialogDescription>
                Make changes or add new promotional assets for your partners.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700">
                    Material Title <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    placeholder="e.g. Product brochure Q2 2026"
                    value={materialForm.title}
                    onChange={(e) =>
                      setMaterialForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700">
                    Material Type
                  </Label>
                  <Select
                    value={materialForm.materialType}
                    onValueChange={(value) =>
                      setMaterialForm((prev) => ({
                        ...prev,
                        materialType: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {salesMaterialTypeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {materialForm.materialType === "rich_text" ? (
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700">
                    Text Content
                  </Label>
                  <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:border-blue-500 transition-colors">
                    <CKEditorComponent
                      value={materialForm.content}
                      uploadUrl="/back-office/partner/upload-content-image"
                      onChange={(value) =>
                        setMaterialForm((prev) => ({ ...prev, content: value }))
                      }
                    />
                  </div>
                </div>
              ) : materialForm.materialType === "file" ? (
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700">
                    Upload Document / Image
                  </Label>
                  <label className="flex flex-col items-center justify-center w-full h-32 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer group relative overflow-hidden">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center z-10">
                      <UploadCloud className="h-8 w-8 text-slate-400 group-hover:text-blue-500 mb-2 transition-colors" />
                      {materialForm.file ? (
                        <p className="text-sm font-semibold text-slate-700 px-4 line-clamp-1">
                          {materialForm.file.name}
                        </p>
                      ) : (
                        <>
                          <p className="text-sm font-semibold text-slate-700">
                            Click or drag file to upload
                          </p>
                          <p className="text-xs text-slate-500 mt-1 px-4">
                            PDF, DOCX, PPTX, or Images
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*,.pdf,.doc,.docx,.ppt,.pptx"
                      onChange={(e) =>
                        setMaterialForm((prev) => ({
                          ...prev,
                          file: e.target.files?.[0] || null,
                        }))
                      }
                    />
                  </label>
                  {editingMaterial?.fileUrl && !materialForm.file && (
                    <div className="flex items-center gap-2 mt-2 px-1">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <p className="text-xs text-slate-500">
                        Currently attached:{" "}
                        <span className="font-semibold text-slate-700">
                          {editingMaterial.fileName}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700">
                    {getSalesMaterialInputLabel(materialForm.materialType)}
                  </Label>
                  <Input
                    placeholder="https://..."
                    value={materialForm.externalUrl}
                    onChange={(e) =>
                      setMaterialForm((prev) => ({
                        ...prev,
                        externalUrl: e.target.value,
                      }))
                    }
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700">
                  Summary (optional)
                </Label>
                <Input
                  placeholder="Short description of this material"
                  value={materialForm.summary}
                  onChange={(e) =>
                    setMaterialForm((prev) => ({
                      ...prev,
                      summary: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setMaterialModalOpen(false)}
                className="rounded-xl px-5"
              >
                Cancel
              </Button>
              <Button
                disabled={savingMaterial || !materialForm.title.trim()}
                onClick={saveMaterial}
                className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl px-6 font-semibold"
              >
                {savingMaterial
                  ? "Saving..."
                  : editingMaterial
                    ? "Update Material"
                    : "Add Material"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog
          open={!!materialToDelete}
          onOpenChange={(open) => !open && setMaterialToDelete(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Sales Material</DialogTitle>
              <DialogDescription>
                Are you sure you want to remove "{materialToDelete?.title}"?
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() => setMaterialToDelete(null)}
                className="rounded-xl px-5"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  if (!materialToDelete) return;
                  try {
                    await deleteSalesMaterial(materialToDelete.id);
                    setMaterials((prev) =>
                      prev.filter((m) => m.id !== materialToDelete.id),
                    );
                    toast.success("Sales material deleted");
                  } catch {
                    toast.error("Failed to delete sales material");
                  } finally {
                    setMaterialToDelete(null);
                  }
                }}
                className="rounded-xl px-6 font-semibold bg-rose-600 hover:bg-rose-700"
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </section>
    );
  }

  if (section === "commission-setting") {
    pageContent = (
      <section className="rounded-3xl border border-border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">
          Overview: Commission & Payments
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          This section contains all the rules regarding how your partners earn
          and receive money. Please select a category from the sidebar to review
          or edit its specific rules.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Payout & Disbursement",
              description:
                "Manage monthly payout dates, track which partners have been paid, and securely upload transfer receipts as proof of payment.",
              icon: <DollarSign className="h-6 w-6 text-emerald-600" />,
              bg: "bg-emerald-50",
            },
            {
              title: "Welcome Bonus",
              description:
                "Configure per-batch welcome bonus tiers and conditions for new partners.",
              icon: <Gift className="h-6 w-6 text-blue-600" />,
              bg: "bg-blue-50",
            },
            {
              title: "Performance Penalties",
              description:
                "Define the minimum activity required (e.g., minimum sales per month) and set up warning systems for inactive partners.",
              icon: <AlertCircle className="h-6 w-6 text-rose-600" />,
              bg: "bg-rose-50",
            },
            {
              title: "Product Commission Rates",
              description:
                "Specify the exact commission (in percentage) that partners earn for selling each specific product or service.",
              icon: <Percent className="h-6 w-6 text-purple-600" />,
              bg: "bg-purple-50",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 hover:shadow-lg hover:border-slate-300 transition-all group flex flex-col cursor-default"
            >
              <div
                className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${item.bg}`}
              >
                {item.icon}
              </div>
              <h3 className="font-semibold text-slate-900 text-base">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (section === "disbursement") {
    pageContent = (
      <section className="space-y-6">
        <div className="max-w-3xl">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="bg-blue-50 text-blue-600 h-14 w-14 rounded-2xl flex items-center justify-center flex-shrink-0 border border-blue-100">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Monthly Payout Date
                </h3>
                <p className="text-sm text-slate-500 mt-1 max-w-sm leading-relaxed">
                  Set the recurring day of the month when partner commissions
                  are processed and basic salary records auto-generated.
                </p>
              </div>
            </div>

            <div className="flex flex-row items-center gap-3 w-full sm:w-auto">
              <div className="relative">
                <Input
                  type="number"
                  min="1"
                  max="31"
                  placeholder="25"
                  className="h-12 w-28 pl-4 pr-9 bg-slate-50 border-slate-200 font-bold text-center text-lg focus-visible:ring-blue-500"
                  value={payoutDate}
                  onChange={(event) => {
                    let val = event.target.value;
                    if (val !== "") {
                      let num = parseInt(val, 10);
                      if (num > 31) val = "31";
                      if (num < 1) val = "1";
                    }
                    setPayoutDate(val);
                    updateConfig((current) => ({
                      ...current,
                      disbursementDate: val,
                    }));
                  }}
                />
                <span className="absolute right-3 top-3.5 text-slate-400 font-medium text-sm select-none">
                  th
                </span>
              </div>
              <Button
                disabled={savingPayoutDate || !payoutDate}
                onClick={async () => {
                  const dateNum = parseInt(payoutDate, 10);
                  if (!dateNum || dateNum < 1 || dateNum > 31) {
                    toast.error("Please enter a valid day (1-31)");
                    return;
                  }
                  try {
                    setSavingPayoutDate(true);
                    await updatePartnerPerformanceSettings({
                      monthlyPayoutDate: dateNum,
                    });
                    toast.success(
                      `Monthly Payout Date set to the ${dateNum}${dateNum === 1 ? "st" : dateNum === 2 ? "nd" : dateNum === 3 ? "rd" : "th"} of every month`,
                    );
                  } catch {
                    toast.error("Failed to save payout date");
                  } finally {
                    setSavingPayoutDate(false);
                  }
                }}
                className="h-12 bg-slate-900 text-white hover:bg-slate-800 rounded-xl px-6 font-semibold shadow-sm shrink-0"
              >
                {savingPayoutDate ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>

        <CommissionDisbursementPanel />
      </section>
    );
  }

  if (section === "initial-commission") {
    pageContent = (
      <section className="space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 text-blue-600 h-12 w-12 rounded-2xl flex items-center justify-center border border-blue-100 flex-shrink-0">
              <Gift className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 leading-tight">
                Welcome Bonus Setup
              </h2>
              <p className="text-sm text-slate-500 mt-1 max-w-2xl">
                Configure welcome bonus tiers and extra payout conditions per
                recruitment batch. Each batch owns its own rule, so there is no
                global welcome bonus condition shared across batches.
              </p>
            </div>
          </div>
        </div>

        <WelcomeBonusRuleTable
          batches={batches}
          onTiersSaved={async (batchId, tiers) => {
            const saved = await updateBatch(batchId, {
              initialCommissionTiers: tiers,
            });
            if (!saved) {
              throw new Error("Failed to sync batch welcome bonus tiers.");
            }
          }}
        />
      </section>
    );
  }

  if (section === "basic-commission") {
    pageContent = (
      <section className="space-y-6">
        <PerformancePolicySettings />
      </section>
    );
  }

  if (section === "sales-commission") {
    pageContent = (
      <section className="space-y-4">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/50 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
                Sales Commission Rates
              </h2>
              <p className="mt-1 text-sm text-slate-500 max-w-2xl">
                Configure how much partners earn per successful sale, and
                optionally set extra conditions required to earn each
                commission.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {serviceRows.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                <Tag className="h-8 w-8 text-slate-300 mb-2" />
                <p>No products found in the catalog.</p>
                <p className="text-xs mt-1">
                  Add products first to set their commission rates.
                </p>
              </div>
            ) : (
              serviceRows.map((service) => {
                const rowConfig = config.salesCommissionByServiceId[
                  service.id
                ] || {
                  mode: (service.commissionMode || "percentage") as
                    | "percentage"
                    | "fixed",
                  value: Number(
                    service.commissionValue ??
                      service.commissionPercentage ??
                      0,
                  ),
                };
                const isExpanded = expandedServiceId === service.id;

                return (
                  <div key={service.id}>
                    {/* Rate row */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                          <Tag className="h-5 w-5" />
                        </div>
                        <span className="font-semibold text-slate-900 truncate">
                          {service.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                        <Select
                          value={rowConfig.mode}
                          onValueChange={(value) =>
                            updateConfig((current) => ({
                              ...current,
                              salesCommissionByServiceId: {
                                ...current.salesCommissionByServiceId,
                                [service.id]: {
                                  ...rowConfig,
                                  mode: value as "percentage" | "fixed",
                                },
                              },
                            }))
                          }
                        >
                          <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-white min-w-[130px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">
                              Percentage (%)
                            </SelectItem>
                            <SelectItem value="fixed">
                              Fixed Amount ({currency})
                            </SelectItem>
                          </SelectContent>
                        </Select>

                        <div className="relative">
                          {rowConfig.mode === "fixed" && (
                            <span className="absolute left-3 top-2.5 text-slate-400 font-medium">
                              {currencySymbol}
                            </span>
                          )}
                          <Input
                            type="number"
                            min="0"
                            className={`h-10 rounded-xl border-slate-200 bg-white font-semibold text-slate-800 w-28 ${rowConfig.mode === "fixed" ? "pl-7" : "pl-4 pr-7"}`}
                            value={rowConfig.value}
                            onChange={(event) =>
                              updateConfig((current) => ({
                                ...current,
                                salesCommissionByServiceId: {
                                  ...current.salesCommissionByServiceId,
                                  [service.id]: {
                                    ...rowConfig,
                                    value: Number(event.target.value || 0),
                                  },
                                },
                              }))
                            }
                          />
                          {rowConfig.mode === "percentage" && (
                            <span className="absolute right-3 top-2.5 text-slate-400 font-medium">
                              %
                            </span>
                          )}
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          className={`h-10 px-3 rounded-xl border-slate-200 text-slate-600 gap-1.5 text-md font-medium ${isExpanded ? "bg-slate-50" : ""}`}
                          onClick={() =>
                            setExpandedServiceId(isExpanded ? null : service.id)
                          }
                        >
                          Conditions
                          <ChevronDown
                            className={`h-3.5 w-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                          />
                        </Button>

                        <Button
                          type="button"
                          onClick={() => saveSalesCommissionRow(service)}
                          disabled={savingSalesCommissionId === service.id}
                          className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium"
                        >
                          {savingSalesCommissionId === service.id
                            ? "Saving..."
                            : "Save Rate"}
                        </Button>
                      </div>
                    </div>

                    {/* Expandable conditions panel */}
                    {isExpanded && (
                      <div className="px-5 pb-5 animate-in fade-in slide-in-from-top-2 duration-200">
                        <EmbeddedRuleConditions
                          commissionType="sales"
                          ruleName={`Sales Commission — ${service.name}`}
                          triggerType="lead_won"
                          scope="per_lead"
                          periodScope="any_month"
                          defaultReward={{ type: "service_config" }}
                          priority={-1}
                          lockedConditions={[
                            {
                              field: "lead_service_id",
                              op: "eq",
                              value: service.id,
                            },
                          ]}
                          lockedLabel={`Applies only to: ${service.name}`}
                          title="Commission Conditions"
                          description="Set extra requirements a partner must meet to earn commission on this product. Leave empty to always pay when a deal is won."
                        />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className="border-t border-slate-100 bg-slate-50/30 px-6 py-4 flex items-start gap-3 text-sm text-slate-600">
            <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Conditions</strong> let you restrict when commission is
              earned per product — for example, only if the deal value exceeds a
              minimum. Click <strong>Conditions</strong> on any row to configure
              them. Leave empty to always pay when a deal is won.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (section === "terms-and-conditions") {
    pageContent = (
      <section className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/50 p-6 flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center flex-shrink-0">
              <FileText className="h-6 w-6 text-slate-700" />
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
                    Terms & Conditions Agreement
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Compose the legally binding agreement that all new partners
                    must accept before onboarding.
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={saveTermsAndConditions}
                  disabled={loadingTerms || savingTerms}
                  className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11 px-6 font-medium shadow-sm"
                >
                  {savingTerms ? "Saving..." : "Save Legal Document"}
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50/30">
            {loadingTerms ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-10 text-sm text-slate-500">
                Loading Terms & Conditions...
              </div>
            ) : (
              <CKEditorComponent
                value={config.termsAndConditionsHtml}
                uploadUrl="/back-office/partner/upload-content-image"
                onChange={(value) =>
                  updateConfig((current) => ({
                    ...current,
                    termsAndConditionsHtml: value,
                  }))
                }
              />
            )}

            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
              <Info className="h-4 w-4" />
              <span>
                Partners will be required to scroll to the bottom of this text
                and explicitly check an agreement box.
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-50 text-blue-600 h-12 w-12 rounded-2xl flex items-center justify-center border border-blue-100 flex-shrink-0">
              <Clock3 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Assessment Runtime Rules
              </h3>
              <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
                Global timing and retry rules for recruitment after candidates
                enter the AI-driven training and certification stages. Exam
                passing threshold stays per batch inside recruitment batch
                configuration.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="bg-rose-50 text-rose-600 h-12 w-12 rounded-2xl flex items-center justify-center border border-rose-100 flex-shrink-0">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Termination Grace Period
              </h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm leading-relaxed">
                Admin alert window before auto termination is applied.
              </p>
            </div>
          </div>
          <div className="flex flex-row items-center gap-3 w-full sm:w-auto">
            <div className="relative">
              <Input
                type="number"
                min="1"
                placeholder="2"
                className="h-12 w-42 px-4 bg-slate-50 border-slate-200 font-bold text-center text-lg focus-visible:ring-blue-500"
                value={graceDays}
                onChange={(event) => setGraceDays(event.target.value)}
              />
              <span className="absolute right-4 top-3 text-sm font-medium text-slate-400">
                Days
              </span>
            </div>
            <Button
              disabled={savingGrace || !graceDays}
              onClick={async () => {
                const num = parseInt(graceDays, 10);
                if (!num || num < 1) {
                  toast.error("Please enter a valid target (min 1)");
                  return;
                }
                try {
                  setSavingGrace(true);
                  await updatePartnerPerformanceSettings({
                    terminationGraceDays: num,
                  });
                  toast.success(
                    `Termination grace days updated to ${num} day(s)`,
                  );
                } catch {
                  toast.error("Failed to save grace days");
                } finally {
                  setSavingGrace(false);
                }
              }}
              className="h-12 bg-slate-900 text-white hover:bg-slate-800 rounded-xl px-6 font-semibold shadow-sm shrink-0"
            >
              {savingGrace ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="grid gap-0 md:grid-cols-2">
            <div className="border-b border-slate-100 p-6 md:border-b-0 md:border-r">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-3 text-blue-600">
                  <Clock3 className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <Label className="text-sm font-semibold text-slate-900">
                    Exam Window After Training
                  </Label>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    How many hours a candidate can wait before the exam link
                    expires after training is completed.
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <Input
                      type="number"
                      min="1"
                      className="h-11 w-32"
                      value={assessmentSettingsForm.examWaitHours}
                      onChange={(event) =>
                        setAssessmentSettingsForm((current) => ({
                          ...current,
                          examWaitHours: parseInt(event.target.value, 10) || 0,
                        }))
                      }
                    />
                    <span className="text-sm font-medium text-slate-500">
                      Hours
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-slate-100 p-6 md:border-b-0">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl border border-orange-100 bg-orange-50 p-3 text-orange-600">
                  <Timer className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <Label className="text-sm font-semibold text-slate-900">
                    Exam Duration
                  </Label>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Countdown duration once the candidate presses Start Exam.
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <Input
                      type="number"
                      min="1"
                      className="h-11 w-32"
                      value={assessmentSettingsForm.examDurationMinutes}
                      onChange={(event) =>
                        setAssessmentSettingsForm((current) => ({
                          ...current,
                          examDurationMinutes:
                            parseInt(event.target.value, 10) || 0,
                        }))
                      }
                    />
                    <span className="text-sm font-medium text-slate-500">
                      Minutes
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-slate-100 p-6 md:border-b-0 md:border-r md:border-t">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-emerald-600">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <Label className="text-sm font-semibold text-slate-900">
                    Initial Screening Passing Score
                  </Label>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Minimum AI screening score from the application form before
                    a candidate is allowed to continue.
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      className="h-11 w-32"
                      value={assessmentSettingsForm.screeningPassingScore}
                      onChange={(event) =>
                        setAssessmentSettingsForm((current) => ({
                          ...current,
                          screeningPassingScore:
                            parseInt(event.target.value, 10) || 0,
                        }))
                      }
                    />
                    <span className="text-sm font-medium text-slate-500">
                      Points
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 md:border-t">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl border border-violet-100 bg-violet-50 p-3 text-violet-600">
                  <RotateCcw className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <Label className="text-sm font-semibold text-slate-900">
                    Maximum Certification Attempts
                  </Label>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Total exam attempts allowed per candidate, including the
                    first attempt.
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      className="h-11 w-32"
                      value={assessmentSettingsForm.maxExamAttempts}
                      onChange={(event) =>
                        setAssessmentSettingsForm((current) => ({
                          ...current,
                          maxExamAttempts:
                            parseInt(event.target.value, 10) || 0,
                        }))
                      }
                    />
                    <span className="text-sm font-medium text-slate-500">
                      Attempts
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4 flex justify-end">
            <Button
              type="button"
              onClick={saveAssessmentRuntimeRules}
              disabled={loadingTerms || savingAssessmentSettings}
              className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11 px-6 font-medium shadow-sm"
            >
              {savingAssessmentSettings ? "Saving..." : "Save Runtime Rules"}
            </Button>
          </div>
        </div>

        <div className="rounded-3xl border border-rose-100 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-rose-100 bg-gradient-to-r from-rose-50 to-white px-6 py-5 flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white border border-rose-100 flex items-center justify-center flex-shrink-0 shadow-sm">
              <AlertCircle className="h-6 w-6 text-rose-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 tracking-tight">
                Warning Trigger System
              </h3>
              <p className="mt-1 text-sm text-slate-500 max-w-2xl">
                Automatically flag or penalize partners who don't meet their
                targets within the specified timeframes. Set up your warning
                matrix below.
              </p>
            </div>
          </div>

          <div className="p-6 bg-slate-50/50">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200">
                <Label className="text-slate-700 font-semibold flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs">
                    1
                  </span>
                  No Sales
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    min="1"
                    className="pl-4 pr-20 h-12 bg-slate-50 font-medium text-lg"
                    value={warningDraft.noSalesMonths}
                    onChange={(event) =>
                      setWarningDraft((current) => ({
                        ...current,
                        noSalesMonths: Number(event.target.value || 1),
                      }))
                    }
                  />
                  <span className="absolute right-4 top-3 text-sm font-medium text-slate-400">
                    Months
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Triggered if partner records 0 total sales over this
                  consecutive duration.
                </p>
              </div>

              <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200">
                <Label className="text-slate-700 font-semibold flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs">
                    2
                  </span>
                  Never Hit Target
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    min="1"
                    className="pl-4 pr-20 h-12 bg-slate-50 font-medium text-lg"
                    value={warningDraft.noTargetMonths}
                    onChange={(event) =>
                      setWarningDraft((current) => ({
                        ...current,
                        noTargetMonths: Number(event.target.value || 1),
                      }))
                    }
                  />
                  <span className="absolute right-4 top-3 text-sm font-medium text-slate-400">
                    Months
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Triggered if a partner fails to reach their minimum basic
                  sales goal consistently.
                </p>
              </div>

              <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200">
                <Label className="text-slate-700 font-semibold flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs">
                    3
                  </span>
                  Regression
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    min="1"
                    className="pl-4 pr-20 h-12 bg-slate-50 font-medium text-lg"
                    value={warningDraft.regressionMonths}
                    onChange={(event) =>
                      setWarningDraft((current) => ({
                        ...current,
                        regressionMonths: Number(event.target.value || 1),
                      }))
                    }
                  />
                  <span className="absolute right-4 top-3 text-sm font-medium text-slate-400">
                    Months
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Fails repeatedly within this period after initially hitting
                  the target.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end pt-6 border-t border-slate-200">
              <Button
                type="button"
                onClick={saveBasicWarnings}
                disabled={savingBasicWarnings}
                className="h-11 px-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium"
              >
                {savingBasicWarnings
                  ? "Saving System Rules..."
                  : "Save Warning Rules"}
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <main className="flex w-full flex-col gap-5 pb-12">
      <Header
        title={activeSectionMeta.title}
        label="Partner Recruitment System"
        breadcrumbs={[
          {
            label: "Partner Recruitment System",
            href: "/partner-recruitment-system",
          },
          {
            label: "Sales Portal Management",
            href: "/partner-recruitment-system/sales-portal-management/commission-setting",
          },
          { label: activeSectionMeta.title },
        ]}
      />
      <section className="rounded-3xl border border-border bg-white p-6 shadow-sm hidden">
        <h2 className="text-xl font-semibold text-slate-950">
          {activeSectionMeta.title}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          {activeSectionMeta.description}
        </p>
      </section>

      {pageContent}

      <CommissionServiceModal
        open={serviceModalOpen}
        onClose={() => {
          setServiceModalOpen(false);
          setEditingService(null);
        }}
        onSuccess={() => {
          setRefreshKey((current) => current + 1);
          setEditingService(null);
        }}
        initialData={editingService}
      />
    </main>
  );
};

export default PartnerRecruitmentSalesPortalContent;
