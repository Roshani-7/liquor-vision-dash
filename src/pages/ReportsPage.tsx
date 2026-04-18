import { useState } from "react";
import { FileText, Download, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { generateReport, type ReportPeriod } from "@/lib/pdfReport";
import { useStore, fmtCompactINR } from "@/lib/store";

interface RecentReport { name: string; date: string; type: string; period: ReportPeriod; }

export default function ReportsPage() {
  const sales = useStore(s => s.sales);
  const [recent, setRecent] = useState<RecentReport[]>([]);

  const handleGenerate = (period: ReportPeriod) => {
    try {
      const { fname, total, txCount } = generateReport(period);
      toast.success(`${period[0].toUpperCase() + period.slice(1)} report downloaded`, {
        description: `${fname} · ${fmtCompactINR(total)} from ${txCount} transactions`,
        icon: <CheckCircle2 className="h-4 w-4" />,
      });
      setRecent([{ name: fname, date: new Date().toLocaleString("en-IN"), type: period[0].toUpperCase() + period.slice(1), period }, ...recent].slice(0, 8));
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate PDF");
    }
  };

  const cards: { label: string; period: ReportPeriod; desc: string }[] = [
    { label: "Daily Report", period: "daily", desc: "Today's sales, top areas, underperformers" },
    { label: "Weekly Report", period: "weekly", desc: "Last 7 days summary with growth" },
    { label: "Monthly Report", period: "monthly", desc: "30-day overview with comparisons" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-sm text-muted-foreground">Generate and download PDF reports · {sales.length} transactions on file</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map(c => (
          <button key={c.period} onClick={() => handleGenerate(c.period)}
            className="group flex items-start gap-3 rounded-xl border border-border bg-card p-5 text-left shadow-card-soft hover-lift">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl gradient-primary shadow-elegant">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-card-foreground">{c.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{c.desc}</p>
              <p className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-primary"><Download className="h-3 w-3" /> Download PDF</p>
            </div>
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-card-soft">
        <h3 className="text-sm font-semibold text-card-foreground mb-4">Recently Generated</h3>
        {recent.length === 0 ? (
          <p className="text-xs text-muted-foreground py-6 text-center">No reports generated yet — click a card above to create one</p>
        ) : (
          <div className="space-y-2.5">
            {recent.map((r, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-muted/40 p-3">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-card-foreground truncate">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.date} · {r.type}</p>
                  </div>
                </div>
                <button onClick={() => handleGenerate(r.period)}
                  className="flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                  <Download className="h-3 w-3" /> Re-download
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
