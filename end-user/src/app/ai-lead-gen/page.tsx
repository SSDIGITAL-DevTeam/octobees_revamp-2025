"use client";

import React, { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Sparkles, Inbox } from "lucide-react";

import { GoogleSearchScraper } from "./_components/GoogleSearchScraper";
import { ScanResults } from "./_components/ScanResults";
import { ScanDetailsModal } from "./_components/ScanDetailsModal";

function AILeadGenContent() {
  // Track only the most recently broadcasted scan to notify the results table
  const [latestScan, setLatestScan] = useState<any>(null);
  const [selectedScan, setSelectedScan] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"scraper" | "history">("scraper");

  const handleNewScan = (newScan: any) => {
    setLatestScan(newScan);
    setSelectedScan(newScan); // Automatically open the dialog globally
    // User requested NOT to switch tabs automatically anymore
  };

  return (
    <div className="min-h-screen pt-36 pb-10 px-4 md:px-8 font-body bg-[url('/webp/asset-background.webp')] bg-cover bg-center bg-no-repeat">
      <div className="mx-auto max-w-6xl">
        {/* Header (Premium Look aligned with app) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-12 flex flex-col items-center justify-center text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary">
            <Bot className="h-4 w-4" />
            <span>AI-Powered Tool</span>
          </div>
          <h1 className="text-4xl uppercase leading-tight md:text-5xl lg:text-6xl font-heading">
            <span>Generate Leads with</span>
            <br />
            <span className="text-primary mt-2 inline-block">Intelligence</span>
          </h1>
          <p className="mt-6 text-lg text-gray-500 max-w-2xl font-body">
            Unleash our enterprise-grade scraper to instantly discover, extract,
            and organize prospects from across the web.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center rounded-full border border-border/50 bg-white/50 p-1.5 backdrop-blur-sm shadow-sm">
            <button
              onClick={() => setActiveTab("scraper")}
              className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all ${
                activeTab === "scraper"
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              New Scan
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all ${
                activeTab === "history"
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Inbox className="h-4 w-4" />
              Task History
            </button>
          </div>
        </div>

        {/* Main Content Area with AnimatePresence for smooth tab switching */}
        <div className="relative min-h-[500px]">
          {/* Optional massive background glow */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 h-[600px] w-full max-w-[800px] rounded-full bg-primary/[0.04] blur-[100px]"></div>

          <AnimatePresence mode="wait">
            {activeTab === "scraper" && (
              <motion.div
                key="scraper"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <GoogleSearchScraper onScanComplete={handleNewScan} />
              </motion.div>
            )}

            {activeTab === "history" && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="scroll-mt-32"
              >
                <ScanResults latestScan={latestScan} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Global Data Preview Modal */}
        <ScanDetailsModal
          scan={selectedScan}
          onClose={() => setSelectedScan(null)}
        />
      </div>
    </div>
  );
}

export default function AILeadGenPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen p-8 text-center text-gray-500">
          Loading...
        </div>
      }
    >
      <AILeadGenContent />
    </Suspense>
  );
}
