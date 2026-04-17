import { FileText, Download } from "lucide-react";
import { toast } from "sonner";

const reports = [
  { name: "Daily Sales Report", date: "Apr 16, 2026", type: "Daily", status: "Ready" },
  { name: "Weekly Performance Summary", date: "Apr 14, 2026", type: "Weekly", status: "Ready" },
  { name: "Monthly Target Report - March", date: "Mar 31, 2026", type: "Monthly", status: "Ready" },
  { name: "Area-wise Analysis Q1", date: "Mar 31, 2026", type: "Quarterly", status: "Ready" },
];

export default function ReportsPage() {
  const generate = (label: string) => {
    toast.loading(`Generating ${label}...`, { id: label });
    setTimeout(() => toast.success(`${label} ready`, { id: label, description: "Your PDF is ready to download" }), 1200);
  };
  const download = (name: string) => toast.success(`Downloading ${name}`, { description: "PDF saved to your device" });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-sm text-muted-foreground">Generate and export sales reports</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {["Daily Report", "Weekly Report", "Monthly Report"].map(label => (
          <button key={label} onClick={() => generate(label)}
            className="group flex items-center gap-3 rounded-xl border border-border bg-card p-5 text-left shadow-card-soft hover-lift">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl gradient-primary shadow-elegant">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-card-foreground">Generate {label}</p>
              <p className="text-xs text-muted-foreground">Export as PDF</p>
            </div>
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-card-soft">
        <h3 className="text-sm font-semibold text-card-foreground mb-4">Recent Reports</h3>
        <div className="space-y-2.5">
          {reports.map((r, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg bg-muted/40 p-3 hover:bg-muted/60 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-card-foreground truncate">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.date} · {r.type}</p>
                </div>
              </div>
              <button onClick={() => download(r.name)}
                className="flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                <Download className="h-3 w-3" /> PDF
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
