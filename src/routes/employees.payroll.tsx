import { createFileRoute } from "@tanstack/react-router";
import { BadgeDollarSign, CalendarDays, Receipt } from "lucide-react";
import { KpiCard } from "@/components/common/KpiCard";
import { PageHeader } from "@/components/common/PageHeader";
import { payroll } from "@/data/agency";
import { money } from "@/data/agency";

export const Route = createFileRoute("/employees/payroll")({
  head: () => ({ meta: [{ title: "Payroll — AgencyOS" }, { name: "description", content: "Review payroll summaries, compensation and payslip status." }, { property: "og:title", content: "Payroll — AgencyOS" }, { property: "og:description", content: "Review payroll summaries, compensation and payslip status." }] }),
  component: PayrollPage,
});

function PayrollPage() {
  const total = payroll.reduce((sum, item) => sum + item.netPay, 0);
  return <section className="mx-auto max-w-7xl"><PageHeader title="Payroll" description="Manage monthly payroll summaries and payslips." /><div className="grid gap-4 sm:grid-cols-3"><KpiCard title="Net payroll" value={money(total)} icon={BadgeDollarSign} /><KpiCard title="Employees" value={String(payroll.length)} icon={Receipt} /><KpiCard title="Pay date" value="Aug 30" icon={CalendarDays} /></div><div className="surface-card mt-5 p-5"><p className="font-semibold">August payroll run</p><p className="mt-2 text-sm text-muted-foreground">Payroll summaries and payslips are ready for review.</p></div></section>;
}