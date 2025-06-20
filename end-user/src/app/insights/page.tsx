import { JSX } from "react";
import { InsightLayout } from "@/app/insights/_components";
import { SubscriptionHeader } from "./_components/subscriptions";

type Props = {
  searchParams: {
    page?: string;
    search?: string;
  };
};

export default async function PageInsight({ searchParams }: Props): Promise<JSX.Element> {
  return (
    <main className="w-full px-8 md:px-10 lg:px-5 space-y-10 md:space-y-5 py-20 pt-28 md:pt-32">
      <SubscriptionHeader />
      <InsightLayout searchParams={searchParams}/>
    </main>
  );
}