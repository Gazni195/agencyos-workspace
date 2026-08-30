import { createFileRoute } from "@tanstack/react-router";
import { FileText, FolderOpen, Upload } from "lucide-react";
import { KpiCard } from "@/components/common/KpiCard";
import { PageHeader } from "@/components/common/PageHeader";
import { employeeDocuments } from "@/data/agency";

export const Route = createFileRoute("/employees/documents")({
  head: () => ({ meta: [{ title: "Employee Documents — AgencyOS" }, { name: "description", content: "Organize employee contracts, policies and HR documents." }, { property: "og:title", content: "Employee Documents — AgencyOS" }, { property: "og:description", content: "Organize employee contracts, policies and HR documents." }] }),
  component: DocumentsPage,
});

function DocumentsPage() {
  return <section className="mx-auto max-w-7xl"><PageHeader title="Documents" description="Keep contracts, policies and employee files organized." /><div className="grid gap-4 sm:grid-cols-3"><KpiCard title="All documents" value={String(employeeDocuments.length)} icon={FileText} /><KpiCard title="Folders" value="6" icon={FolderOpen} /><KpiCard title="Needs upload" value="4" icon={Upload} /></div><div className="surface-card mt-5 p-5"><p className="font-semibold">Employee document library</p><p className="mt-2 text-sm text-muted-foreground">Secure document records are ready for upload and review.</p></div></section>;
}