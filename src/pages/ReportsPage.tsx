import { FileText, Download } from "lucide-react";

const reports = [
  { name: "Daily Sales Report", date: "Apr 16, 2026", type: "Daily", status: "Ready" },
  { name: "Weekly Performance Summary", date: "Apr 14, 2026", type: "Weekly", status: "Ready" },
  { name: "Monthly Target Report - March", date: "Mar 31, 2026", type: "Monthly", status: "Ready" },
  { name: "Area-wise Analysis Q1", date: "Mar 31, 2026", type: "Quarterly", status: "Ready" },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-sm text-muted-foreground">Generate and export sales reports</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {["Daily Report", "Weekly Report", "Monthly Report"].map(label => (
          <button key={label} className="flex items-center gap-3 rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow text-left">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-card-foreground">Generate {label}</p>
              <p className="text-xs text-muted-foreground">Export as PDF</p>
            </div>
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-card-foreground mb-4">Recent Reports</h3>
        <div className="space-y-3">
          {reports.map((r, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-card-foreground">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.date} · {r.type}</p>
                </div>
              </div>
              <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted">
                <Download className="h-3 w-3" /> PDF
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
