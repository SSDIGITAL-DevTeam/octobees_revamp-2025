"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { AffiliateBatch } from "@/hooks/partnership/useBatches";

type InitialCommissionModalProps = {
  batch: AffiliateBatch | null;
  onClose: () => void;
  onSubmit: (
    batchId: string,
    initialCommissionAmount: number,
    initialCommissionFullClientThreshold: number,
  ) => Promise<boolean>;
};

export const InitialCommissionModal = ({
  batch,
  onClose,
  onSubmit,
}: InitialCommissionModalProps) => {
  const [value, setValue] = useState("0");
  const [threshold, setThreshold] = useState("2");
  const [enabled, setEnabled] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValue(String(batch?.initialCommissionAmount ?? 0));
    setThreshold(String(batch?.initialCommissionFullClientThreshold ?? 2));
    setEnabled(Number(batch?.initialCommissionAmount ?? 0) > 0);
  }, [batch]);

  const handleSave = async () => {
    if (!batch) return;
    setSaving(true);
    const thresholdNum = Math.max(1, Math.round(Number(threshold || 2)));
    const success = await onSubmit(
      batch.id,
      enabled ? Number(value || 0) : 0,
      enabled ? thresholdNum : 2,
    );
    setSaving(false);
    if (success) onClose();
  };

  return (
    <Dialog open={Boolean(batch)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Initial Commission</DialogTitle>
          <DialogDescription>
            {batch?.name || "Batch"} will become the master commission value for
            applicants in this batch.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Batch</Label>
            <Input value={batch?.name || ""} readOnly className="bg-slate-50" />
          </div>
          <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <Checkbox
              id="initial-commission-enabled"
              checked={enabled}
              onCheckedChange={(checked) => {
                const nextEnabled = checked === true;
                setEnabled(nextEnabled);
                if (!nextEnabled) {
                  setValue("0");
                }
              }}
            />
            <div className="space-y-1">
              <Label
                htmlFor="initial-commission-enabled"
                className="cursor-pointer"
              >
                Enable initial commission for this batch
              </Label>
              <p className="text-xs text-slate-500">
                Disable this if the batch should not receive any initial
                commission.
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="initialCommissionAmount">
              Initial Commission Amount
            </Label>
            <Input
              id="initialCommissionAmount"
              type="number"
              min="0"
              step="0.01"
              value={value}
              disabled={!enabled}
              onChange={(event) => setValue(event.target.value)}
              placeholder="0.00"
            />
            <p className="text-xs text-slate-500">
              This amount will be synced to all applicants assigned to the same
              batch.
            </p>
          </div>
          {enabled && (
            <div className="space-y-2">
              <Label htmlFor="initialCommissionThreshold">
                Target Closed Clients for Initial Commission
              </Label>
              <Input
                id="initialCommissionThreshold"
                type="number"
                min="1"
                step="1"
                value={threshold}
                onChange={(event) => setThreshold(event.target.value)}
                placeholder="2"
              />
              <p className="text-xs text-slate-500">
                Partner must close at least this many clients to receive the
                initial commission.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
