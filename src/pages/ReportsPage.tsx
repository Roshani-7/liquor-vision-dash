import { useState } from "react";
import { FileText, Download, CheckCircle2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { generateReport, shareReportOnWhatsApp, type ReportPeriod } from "@/lib/pdfReport";
import { useStore, fmtCompactINR } from "@/lib/store";

interface RecentReport { name: string; date: string; type: string; period: ReportPeriod; }

export default function ReportsPage() {
  const sales = useStore(s => s.sales);
  const [recent, setRecent] = useState<RecentReport[]>([]);
  const [phone, setPhone] = useState("");

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

  const handleWhatsApp = (period: ReportPeriod) => {
    try {
      shareReportOnWhatsApp(period, phone || undefined);
      toast.success("Opening WhatsApp", {
        description: phone ? `Sharing ${period} report to ${phone}` : `Pick a contact to share the ${period} summary`,
        icon: <MessageCircle className="h-4 w-4" />,
      });
    } catch (e) {
      console.error(e);
      toast.error("Failed to open WhatsApp");
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
        <p className="text-sm text-muted-foreground">Generate, download, and share PDF reports · {sales.length} transactions on file</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-card-soft">
        <label className="text-xs font-medium text-muted-foreground">WhatsApp recipient (optional)</label>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">+</span>
          <input
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="91XXXXXXXXXX (with country code)"
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <p className="mt-1.5 text-[11px] text-muted-foreground">Leave empty to pick a contact in WhatsApp. Numbers only, include country code.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map(c => (
          <div key={c.period}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 text-left shadow-card-soft hover-lift">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl gradient-primary shadow-elegant">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-card-foreground">{c.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{c.desc}</p>
              </div>
            </div>
            <div className="mt-1 flex flex-wrap gap-2">
              <button onClick={() => handleGenerate(c.period)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-card-foreground hover:border-primary hover:text-primary transition-colors">
                <Download className="h-3 w-3" /> PDF
              </button>
              <button onClick={() => handleWhatsApp(c.period)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity">
                <MessageCircle className="h-3 w-3" /> WhatsApp
              </button>
            </div>
          </div>
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
                <div className="flex flex-shrink-0 items-center gap-2">
                  <button onClick={() => handleGenerate(r.period)}
                    className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                    <Download className="h-3 w-3" /> PDF
                  </button>
                  <button onClick={() => handleWhatsApp(r.period)}
                    className="flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity">
                    <MessageCircle className="h-3 w-3" /> Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
