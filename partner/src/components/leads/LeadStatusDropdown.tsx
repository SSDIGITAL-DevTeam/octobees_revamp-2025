"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import Badge from "@/components/ui/Badge";
import {
  getLeadStatusVariant,
  PARTNER_LEAD_PIPELINE_STATUSES,
  type PartnerLeadPipelineStatus,
} from "@/lib/partner-portal";

type LeadStatusDropdownProps = {
  status: string;
  disabled?: boolean;
  onChange: (nextStatus: string) => Promise<void> | void;
  triggerMode?: "badge" | "button";
  buttonLabel?: string;
  statuses?: PartnerLeadPipelineStatus[];
};

const LeadStatusDropdown = ({
  status,
  disabled = false,
  onChange,
  triggerMode = "badge",
  buttonLabel = "Move",
  statuses,
}: LeadStatusDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuStyle, setMenuStyle] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const [placement, setPlacement] = useState<"top" | "bottom">("bottom");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const menuWidth = 220;
      const estimatedMenuHeight = 360;
      const viewportPadding = 16;
      const nextLeft = Math.min(
        rect.left,
        window.innerWidth - menuWidth - viewportPadding,
      );
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const nextPlacement =
        spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow
          ? "top"
          : "bottom";

      setPlacement(nextPlacement);
      setMenuStyle({
        top:
          nextPlacement === "top"
            ? Math.max(viewportPadding, rect.top - estimatedMenuHeight - 8)
            : Math.max(viewportPadding, rect.bottom + 8),
        left: Math.max(viewportPadding, nextLeft),
      });
    };

    updatePosition();

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedTrigger = containerRef.current?.contains(target);
      const clickedMenu = menuRef.current?.contains(target);

      if (!clickedTrigger && !clickedMenu) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [open]);

  const handleSelect = async (nextStatus: string) => {
    if (nextStatus === status || isSubmitting) {
      setOpen(false);
      return;
    }

    try {
      setIsSubmitting(true);
      await onChange(nextStatus);
      setOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div ref={containerRef} className="relative inline-flex">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          if (disabled || isSubmitting) return;
          setOpen((prev) => !prev);
        }}
        disabled={disabled || isSubmitting}
        className="group inline-flex items-center"
      >
        {triggerMode === "button" ? (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition ${
              disabled || isSubmitting
                ? "opacity-70"
                : "group-hover:border-[#E30613] group-hover:text-[#E30613]"
            }`}
          >
            <span>{buttonLabel}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.7}
              stroke="currentColor"
              className={`h-3.5 w-3.5 transition ${open ? "rotate-180" : ""}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </span>
        ) : (
          <Badge
            category="status"
            variant={getLeadStatusVariant(status)}
            className={`cursor-pointer gap-1.5 transition ${
              disabled || isSubmitting ? "opacity-70" : "group-hover:brightness-95"
            }`}
          >
            <span>{status}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.7}
              stroke="currentColor"
              className={`h-3.5 w-3.5 transition ${open ? "rotate-180" : ""}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </Badge>
        )}
      </button>

      {mounted && open
        ? createPortal(
            <div
              ref={menuRef}
              className="fixed z-[120] min-w-[220px] rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"
              style={menuStyle}
            >
              <div
                className={`absolute left-6 h-3 w-3 rotate-45 border-slate-200 bg-white ${
                  placement === "top"
                    ? "-bottom-[7px] border-b border-r"
                    : "-top-[7px] border-l border-t"
                }`}
              />
              <div className="mb-1 px-2 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Pipeline Status
              </div>
              <div className="space-y-1">
                {(statuses?.length
                  ? statuses.map((item) => item.value)
                  : [...PARTNER_LEAD_PIPELINE_STATUSES]
                ).map((option) => {
                  const active = option === status;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleSelect(option)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
                        active
                          ? "bg-slate-100 font-semibold text-slate-950"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                      }`}
                    >
                      <span>{option}</span>
                      {active ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.8}
                          stroke="currentColor"
                          className="h-4 w-4 text-[#E30613]"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m4.5 12.75 6 6 9-13.5"
                          />
                        </svg>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
};

export default LeadStatusDropdown;
