import { Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/frontend/components/ui/button";
import { exportToCsv } from "@/modules/reports/frontend/utils/exportCsv";

export function ExportCsvButton({
  filename,
  rows,
  label = "Export CSV",
}: {
  filename: string;
  rows: Record<string, string | number>[];
  label?: string;
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-1.5"
      onClick={() => {
        exportToCsv(filename, rows);
        toast.success(`Exported ${filename}.csv`);
      }}
    >
      <Download className="size-3.5" /> {label}
    </Button>
  );
}
