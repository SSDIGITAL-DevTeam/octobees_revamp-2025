"use client";

import { Search, Download, X, ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type FilterValue = {
  search: string;
  status: string;
  stage: string;
  sorts: string;
  limit: string;
};

type AffiliateFiltersProps = {
  values: FilterValue;
  onChange: <K extends keyof FilterValue>(
    key: K,
    value: FilterValue[K],
  ) => void;
  onExport: () => void;
  onReset: () => void;
};

const AffiliateFilters = ({
  values,
  onChange,
  onExport,
  onReset,
}: AffiliateFiltersProps) => {
  const selectedSorts = values.sorts
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const hasActiveFilters =
    values.search ||
    values.status ||
    values.stage ||
    values.sorts !== "applied_newest,score_highest";

  const sortOptions = [
    {
      value: "applied_newest",
      label: "Applied Date: Newest",
      group: "applied",
    },
    {
      value: "applied_oldest",
      label: "Applied Date: Oldest",
      group: "applied",
    },
    { value: "score_highest", label: "Score: Highest", group: "score" },
    { value: "score_lowest", label: "Score: Lowest", group: "score" },
  ];

  const sortSummary =
    selectedSorts.length > 0
      ? selectedSorts
          .map(
            (value) =>
              sortOptions.find((option) => option.value === value)?.label ||
              value,
          )
          .join(" • ")
      : "Sort order";

  const handleSortToggle = (sortValue: string) => {
    const isSelected = selectedSorts.includes(sortValue);
    let nextSorts = [...selectedSorts];
    const selectedOption = sortOptions.find(
      (option) => option.value === sortValue,
    );

    if (isSelected) {
      nextSorts = nextSorts.filter((item) => item !== sortValue);
    } else {
      nextSorts = nextSorts.filter((item) => {
        const option = sortOptions.find(
          (candidate) => candidate.value === item,
        );
        return option?.group !== selectedOption?.group;
      });
      nextSorts.push(sortValue);
    }

    if (nextSorts.length === 0) {
      nextSorts = ["applied_newest"];
    }

    onChange("sorts", nextSorts.join(","));
  };

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-slate-900">Filters</p>
          <p className="text-sm text-slate-500">
            Search candidates, filter by stage, or change the list order.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1.6fr)_minmax(220px,0.9fr)_minmax(320px,1.2fr)_minmax(220px,auto)]">
          <div className="relative min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by candidate name or email"
              value={values.search}
              onChange={(e) => onChange("search", e.target.value)}
              className="h-11 rounded-2xl border-slate-200 bg-slate-50 pl-10"
            />
          </div>

          <Select
            value={values.stage || "all"}
            onValueChange={(v) => onChange("stage", v === "all" ? "" : v)}
          >
            <SelectTrigger className="h-11 w-full rounded-2xl border-slate-200 bg-slate-50">
              <SelectValue placeholder="Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="qualified">Passed Qualification</SelectItem>
              <SelectItem value="interview">In Interview</SelectItem>
              <SelectItem value="training">In Training</SelectItem>
              <SelectItem value="certification">In Certification</SelectItem>
              <SelectItem value="onboarded">Approved & Onboarded</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-11 w-full justify-between rounded-2xl border-slate-200 bg-slate-50 px-4 text-left font-normal text-slate-700 hover:bg-slate-100"
              >
                <span className="truncate">{sortSummary}</span>
                <ArrowUpDown className="ml-3 h-4 w-4 shrink-0 text-slate-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-[320px] rounded-2xl p-2"
            >
              <DropdownMenuLabel>Sort Order</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="px-2 pb-1 pt-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                Applied Date
              </div>
              {sortOptions
                .filter((option) => option.group === "applied")
                .map((option) => {
                  const selectedIndex = selectedSorts.indexOf(option.value);
                  return (
                    <DropdownMenuCheckboxItem
                      key={option.value}
                      checked={selectedIndex !== -1}
                      onCheckedChange={() => handleSortToggle(option.value)}
                      className="rounded-xl py-2"
                    >
                      <span>{option.label}</span>
                      {selectedIndex !== -1 ? (
                        <span className="ml-auto text-xs text-slate-500">
                          {selectedIndex + 1}
                        </span>
                      ) : null}
                    </DropdownMenuCheckboxItem>
                  );
                })}
              <DropdownMenuSeparator />
              <div className="px-2 pb-1 pt-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                Score
              </div>
              {sortOptions
                .filter((option) => option.group === "score")
                .map((option) => {
                  const selectedIndex = selectedSorts.indexOf(option.value);
                  return (
                    <DropdownMenuCheckboxItem
                      key={option.value}
                      checked={selectedIndex !== -1}
                      onCheckedChange={() => handleSortToggle(option.value)}
                      className="rounded-xl py-2"
                    >
                      <span>{option.label}</span>
                      {selectedIndex !== -1 ? (
                        <span className="ml-auto text-xs text-slate-500">
                          {selectedIndex + 1}
                        </span>
                      ) : null}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex min-h-[44px] items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className={
                hasActiveFilters
                  ? "h-11 rounded-2xl px-4 text-slate-600 hover:bg-slate-100"
                  : "pointer-events-none h-11 rounded-2xl px-4 text-transparent opacity-0"
              }
              aria-hidden={!hasActiveFilters}
              tabIndex={hasActiveFilters ? 0 : -1}
            >
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="h-11 rounded-2xl border-slate-200 px-4 text-slate-700 hover:bg-slate-100"
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliateFilters;
