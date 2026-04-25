"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getPartnerPerformanceSettings,
  updatePartnerPerformanceSettings,
  type PartnerPerformanceSettings,
} from "@/lib/api/partnership/dashboardPartnership";
import { EmbeddedRuleConditions } from "@/components/partials/partner-recruitment/EmbeddedRuleConditions";
import { formatWithCurrency, useCurrencyStore } from "@/app/store/currency";

type PerformancePolicyForm = Pick<
  PartnerPerformanceSettings,
  | "basicSalaryAmount"
  | "basicSalarySalesThreshold"
  | "firstMonthMinimumClosedClients"
  | "initialCommissionFullClientThreshold"
  | "terminationGraceDays"
>;

const defaultForm: PerformancePolicyForm = {
  basicSalaryAmount: 3500,
  basicSalarySalesThreshold: 35000,
  firstMonthMinimumClosedClients: 1,
  initialCommissionFullClientThreshold: 2,
  terminationGraceDays: 2,
};

const fields: Array<{
  key: keyof PerformancePolicyForm;
  label: string;
  helper: string;
  min: number;
  step?: number;
}> = [
  {
    key: "basicSalaryAmount",
    label: "Basic Salary Amount",
    helper: "Monthly salary shown to eligible partners.",
    min: 0,
  },
  {
    key: "basicSalarySalesThreshold",
    label: "Basic Salary Sales Threshold",
    helper: "Minimum monthly closed sales value required.",
    min: 1,
  },
  {
    key: "firstMonthMinimumClosedClients",
    label: "Minimum First Month Closed Clients",
    helper: "Partner must close at least this many clients in month one.",
    min: 1,
    step: 1,
  },
  {
    key: "initialCommissionFullClientThreshold",
    label: "Default Min. Closed Clients (fallback for batches)",
    helper:
      "Global fallback for initial commission eligibility. Overridden per-batch if the batch sets its own value.",
    min: 1,
    step: 1,
  },
];

const toNumber = (value: string, defaultValue: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : defaultValue;
};

export const PerformancePolicySettings = () => {
  const { currency } = useCurrencyStore();
  const [form, setForm] = useState<PerformancePolicyForm>(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getPartnerPerformanceSettings();
      setForm({
        basicSalaryAmount: Number(
          response.data.data.basicSalaryAmount ?? defaultForm.basicSalaryAmount,
        ),
        basicSalarySalesThreshold: Number(
          response.data.data.basicSalarySalesThreshold ??
            defaultForm.basicSalarySalesThreshold,
        ),
        firstMonthMinimumClosedClients: Number(
          response.data.data.firstMonthMinimumClosedClients ??
            defaultForm.firstMonthMinimumClosedClients,
        ),
        initialCommissionFullClientThreshold: Number(
          response.data.data.initialCommissionFullClientThreshold ??
            defaultForm.initialCommissionFullClientThreshold,
        ),
        terminationGraceDays: Number(
          response.data.data.terminationGraceDays ??
            defaultForm.terminationGraceDays,
        ),
      });
    } catch {
      toast.error("Failed to load partner performance policy");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const ruleSummary = useMemo(
    () =>
      `Partners need ${formatWithCurrency(form.basicSalarySalesThreshold, currency)} monthly sales for ${formatWithCurrency(form.basicSalaryAmount, currency)} basic salary. Initial commission amount comes from each batch setting; if it is disabled or set to ${formatWithCurrency(0, currency)}, no initial commission is paid. Month-one target is ${form.initialCommissionFullClientThreshold} closed client(s), with ${form.terminationGraceDays} day(s) grace before auto termination.`,
    [currency, form],
  );

  const updateField = (key: keyof PerformancePolicyForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: toNumber(value, prev[key]),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await updatePartnerPerformanceSettings(form);
      setForm({
        basicSalaryAmount: Number(response.data.data.basicSalaryAmount),
        basicSalarySalesThreshold: Number(
          response.data.data.basicSalarySalesThreshold,
        ),
        firstMonthMinimumClosedClients: Number(
          response.data.data.firstMonthMinimumClosedClients,
        ),
        initialCommissionFullClientThreshold: Number(
          response.data.data.initialCommissionFullClientThreshold,
        ),
        terminationGraceDays: Number(response.data.data.terminationGraceDays),
      });
      toast.success("Partner performance policy updated");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update partner performance policy",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Partner Performance Policy
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">
            Basic salary, initial commission, and termination rules
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            {ruleSummary}
          </p>
        </div>
        <Button
          className="h-11 rounded-lg px-5"
          onClick={handleSave}
          disabled={loading || saving}
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Policy
        </Button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {fields.map((field) => (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            <Input
              id={field.key}
              type="number"
              min={field.min}
              step={field.step ?? 0.01}
              value={form[field.key]}
              disabled={loading || saving}
              onChange={(event) => updateField(field.key, event.target.value)}
            />
            <p className="text-xs leading-5 text-slate-500">{field.helper}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-100">
        <EmbeddedRuleConditions
          commissionType="basic_salary"
          ruleName="Basic Salary — Payment Conditions"
          triggerType="monthly_cron"
          scope="per_period"
          periodScope="current_month"
          defaultReward={{ type: "fixed", value: form.basicSalaryAmount }}
          title="When should basic salary be paid?"
          description="Set conditions a partner must meet each month to receive their basic salary. Leave empty to always pay when the monthly payout runs."
        />
      </div>
    </section>
  );
};

export default PerformancePolicySettings;
