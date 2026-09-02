import { createFileRoute } from "@tanstack/react-router";
import { attendance } from "@/modules/employees/types";
import { AttendancePage } from "@/modules/employees/frontend/pages/AttendancePage";

export const Route = createFileRoute("/employees/attendance")({
  head: () => ({
    meta: [
      { title: "Attendance — AgencyOS" },
      { name: "description", content: "Monitor agency attendance, check-ins and absences." },
      { property: "og:title", content: "Attendance — AgencyOS" },
      { property: "og:description", content: "Monitor agency attendance, check-ins and absences." },
    ],
  }),
  component: AttendancePage,
});
