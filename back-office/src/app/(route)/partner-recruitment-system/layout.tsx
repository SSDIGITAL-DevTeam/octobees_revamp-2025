import PartnerRecruitmentModuleShell from "@/components/partials/partner-recruitment/PartnerRecruitmentModuleShell"

export default function PartnerRecruitmentSystemLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PartnerRecruitmentModuleShell>{children}</PartnerRecruitmentModuleShell>
}
