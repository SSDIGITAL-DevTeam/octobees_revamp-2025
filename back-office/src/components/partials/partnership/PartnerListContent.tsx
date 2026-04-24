"use client";

import { useEffect, useMemo, useState } from "react";

import Header from "@/components/layout/header/Header";
import { PartnersFilterBar } from "@/components/partials/partnership/PartnersFilterBar";
import type {
  PartnerApiEntry,
  PartnerLeadApiItem,
  PartnerServiceApiItem,
} from "@/lib/api/partnership/dashboardPartnership";
import {
  calculatePartnerMonthlyMetrics,
  formatDate,
  getAllApprovedPartners,
  getAllPartnerLeads,
  getAllPartnerServices,
  type PartnerPaymentStatus,
} from "@/lib/partnership/partnerList";
import { PartnerListTable, type PartnerListRow } from "./PartnerListTable";

type PartnerListComputedRow = PartnerListRow & {
  paymentStatus: PartnerPaymentStatus;
};

export const PartnerListContent = () => {
  const [partners, setPartners] = useState<PartnerApiEntry[]>([]);
  const [leads, setLeads] = useState<PartnerLeadApiItem[]>([]);
  const [services, setServices] = useState<PartnerServiceApiItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [partnerData, leadData, serviceData] = await Promise.all([
          getAllApprovedPartners(),
          getAllPartnerLeads(),
          getAllPartnerServices(),
        ]);

        setPartners(partnerData);
        setLeads(leadData);
        setServices(serviceData);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load partner list.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const rows = useMemo<PartnerListComputedRow[]>(() => {
    const query = search.trim().toLowerCase();

    return partners
      .map((partner) => {
        const metrics = calculatePartnerMonthlyMetrics(
          partner.id,
          leads,
          services,
        );

        return {
          id: partner.id,
          fullName: partner.fullName,
          email: partner.email,
          joinedDate: formatDate(partner.createdAt),
          salesThisMonth: metrics.salesThisMonth,
          commissionThisMonth: metrics.commissionThisMonth,
          paymentStatus: metrics.paymentStatus,
        };
      })
      .filter((partner) => {
        if (!query) return true;

        return [partner.fullName, partner.email, partner.joinedDate].some(
          (value) => value.toLowerCase().includes(query),
        );
      })
      .sort(
        (a, b) =>
          b.salesThisMonth - a.salesThisMonth ||
          a.fullName.localeCompare(b.fullName),
      );
  }, [leads, partners, search, services]);

  return (
    <main className="flex w-full flex-col gap-5 pb-12">
      <Header title="Partner List" label="Partnership Program" />

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <section className="flex flex-col gap-4">
        <PartnersFilterBar search={search} onSearchChange={setSearch} />

        {loading ? (
          <div className="rounded-2xl border border-border bg-white px-5 py-10 text-center text-slate-500 shadow-sm">
            Loading approved partner list...
          </div>
        ) : (
          <PartnerListTable rows={rows} />
        )}
      </section>
    </main>
  );
};

export default PartnerListContent;
