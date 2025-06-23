"use client";

import React, { JSX, useState } from "react";
import { DialogLead } from "@/components/layouts/Dialog";
import { PlanService } from "@/constants/payload";
import SelectCurrency from "./SelectCurrency";

type Currency = {
  id: number;
  code: CurrencyCode;
  symbol: string;
};

const currencies: Currency[] = [
  { id: 0, code: "SGD", symbol: "S" },
  { id: 1, code: "MYR", symbol: "" },
  { id: 2, code: "IDR", symbol: "" },
];

type CurrencyCode = 'IDR' | 'MYR' | 'SGD';

const formatCurrency = (value: number, code: CurrencyCode) => {
  const locales: Record<CurrencyCode, string> = {
    IDR: 'id-ID',
    MYR: 'ms-MY',
    SGD: 'en-SG',
  };

  return new Intl.NumberFormat(locales[code], {
    style: 'currency',
    currency: code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const ChecklistIcon = ({ isPremium }: { isPremium: boolean }) => (
  <span className="text-secondary">
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 16.5C4.85975 16.4955 1.50455 13.1403 1.5 9.00001V8.85001C1.58245 4.72841 4.97594 1.44598 9.098 1.50067C13.2201 1.55537 16.5253 4.92668 16.4983 9.04902C16.4714 13.1714 13.1224 16.4992 9 16.5ZM5.5575 8.69251L4.5 9.75001L7.5 12.75L13.5 6.75001L12.4425 5.68501L7.5 10.6275L5.5575 8.69251Z"
        fill={isPremium ? "#E8D28F" : "#B4000B"}
      />
    </svg>
  </span>
)

export default function PlanComponents({ data }: { data: PlanService[] }): JSX.Element {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]);

  const filteredPlan = data
    .filter((plan) => plan.status === "Active")
    .sort((a, b) => {
      if (a.type === "Standard" && b.type === "Premium") return -1;
      if (a.type === "Premium" && b.type === "Standard") return 1;
      return 0;
    })

  const premiumStyle = {
    background: "bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] border-[#E8D28F] border-[3px] shadow-lg",
    name: "text-[#E8D28F] bg-gradient-to-r from-[#E8D28F] to-[#D4AF37] bg-clip-text text-transparent", //discount
    amount: "bg-gradient-to-r from-[#E8D28F] to-[#D4AF37] text-[#1a1a1a]",
  }

  return (
    <div className="flex flex-col items-center justify-center pb-[80px]">
      <SelectCurrency currencies={currencies} selectedCurrency={selectedCurrency} setSelectedCurrency={setSelectedCurrency} />

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-14 w-full font-jakartaSans">
        {filteredPlan.map((plan, index) => {
          const isPremium = plan.type === "Premium";
          return (
            <li
              key={index}
              className={`flex flex-col gap-y-9 p-5 lg:p-7 rounded-2xl ${isPremium
                ? premiumStyle.background
                : "bg-light border-[#EFE6E5] border-[4px]"
                }`}
            >
              <div className="flex flex-col gap-y-2">
                <h2
                  className={`font-bold text-3xl md:text-4xl ${isPremium
                    ? premiumStyle.name
                    : "text-dark"
                    }`}
                >
                  {plan.name}
                </h2>
              </div>

              {plan.showPrice &&
                <ul className="flex flex-col">
                  {plan.prices?.[selectedCurrency.id]?.amount > 0 && (
                    <li className="flex flex-col gap-y-3">
                      <span
                        className={`font-semibold text-lg line-through px-4 self-start ${isPremium
                          ? premiumStyle.amount
                          : "bg-primary text-white"
                          }`}
                      >
                        {selectedCurrency.symbol}
                        {formatCurrency(plan.prices[selectedCurrency.id].amount, selectedCurrency.code)}

                      </span>
                      <span
                        className={`font-bold text-4xl ${isPremium
                          ? premiumStyle.name
                          : "text-dark"
                          }`}
                      >
                        {selectedCurrency.symbol}
                        {formatCurrency(plan.prices[selectedCurrency.id].discount, selectedCurrency.code)}

                      </span>
                      <span className={`text-lg font-bold ${isPremium ? "text-[#E8D28F]" : "text-dark"}`}>
                        / {plan.options}
                      </span>
                      <p className={`font-jakartaSans ${isPremium ? "text-gray-300" : "text-secondary"}`}>
                        ({plan.descriptions})
                      </p>
                    </li>
                  )}
                </ul>
              }

              {/* BENEFIT */}
              {plan.benefits.length > 0 && (
                <ul className="flex flex-col gap-y-3">
                  {plan.benefits.map((feature, featureIndex) =>
                    feature?.value ? (
                      <li key={featureIndex} className="flex items-center gap-x-3">
                        <ChecklistIcon isPremium={isPremium} />
                        <span className={isPremium ? "text-gray-300" : "text-dark"}>
                          {feature.value}
                        </span>
                      </li>
                    ) : null
                  )}
                </ul>
              )
              }

              <DialogLead
                plan={plan}
                curr={selectedCurrency.code}
                amount={`${plan.showPrice ? plan.prices[selectedCurrency.id]?.discount : 0}`}
              />
            </li>
          );
        })}
      </ul>
    </div >
  );
}