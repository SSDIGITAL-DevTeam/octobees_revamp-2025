"use client";

import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: "success" | "error" | "info";
}

export function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || toasts.length === 0) return null;

  return createPortal(
    <>
      <style>{`
        @keyframes octobeesToastProgress {
          0% { width: 100%; }
          100% { width: 0%; }
        }
        .animate-octobees-toast-progress {
          animation: octobeesToastProgress 3000ms linear forwards !important;
        }
      `}</style>
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none p-2 sm:p-0">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </div>
    </>,
    document.body,
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}) {
  const onDismissRef = useRef(onDismiss);
  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismissRef.current(toast.id);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast.id]);

  const type = toast.type || "success";

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />,
    info: <Info className="h-5 w-5 text-blue-500 shrink-0" />,
  };

  const bgBorder = {
    success: "border-emerald-300 bg-white text-gray-900 shadow-xl shadow-emerald-500/10",
    error: "border-rose-300 bg-white text-gray-900 shadow-xl shadow-rose-500/10",
    info: "border-blue-300 bg-white text-gray-900 shadow-xl shadow-blue-500/10",
  };

  const progressBg = {
    success: "bg-emerald-500",
    error: "bg-rose-500",
    info: "bg-blue-500",
  };

  return (
    <div
      className={`relative pointer-events-auto overflow-hidden rounded-2xl border p-4 pb-5 backdrop-blur-md transition-all ${bgBorder[type]}`}
      role="alert"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {icons[type]}
          <div className="min-w-0">
            <p className="text-xs font-bold leading-snug">{toast.title}</p>
            {toast.description && (
              <p className="mt-0.5 text-[11px] font-medium text-gray-500 truncate">{toast.description}</p>
            )}
          </div>
        </div>

        <button
          onClick={() => onDismissRef.current(toast.id)}
          className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Countdown Progress Line Bar (3 Seconds) */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-100 overflow-hidden">
        <div
          className={`h-full animate-octobees-toast-progress ${progressBg[type]}`}
          onAnimationEnd={() => onDismissRef.current(toast.id)}
        />
      </div>
    </div>
  );
}
