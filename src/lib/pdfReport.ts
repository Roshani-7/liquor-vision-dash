import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { store, fmtCompactINR, fmtINR, daysBetween, areaPerformance, topShops } from "./store";

export type ReportPeriod = "daily" | "weekly" | "monthly";

const periodDays: Record<ReportPeriod, number> = { daily: 1, weekly: 7, monthly: 30 };

const daysAgo = (n: number) => { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().split("T")[0]; };

export function generateReport(period: ReportPeriod) {
  const s = store.get();
  const days = periodDays[period];
  const cutoff = daysAgo(days - 1);
  const periodSales = s.sales.filter(x => x.date >= cutoff);
  const total = periodSales.reduce((a, x) => a + x.total, 0);
  const txCount = periodSales.length;

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();

  // Header band
  doc.setFillColor(67, 56, 202);
  doc.rect(0, 0, W, 70, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Sales Intelligence", 40, 32);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const title = `${period.charAt(0).toUpperCase() + period.slice(1)} Sales Report`;
  doc.text(title, 40, 52);
  doc.text(new Date().toLocaleString("en-IN"), W - 40, 52, { align: "right" });

  // Summary cards
  doc.setTextColor(30, 30, 30);
  let y = 100;
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Summary", 40, y);
  y += 8;
  doc.setDrawColor(220, 220, 220);
  doc.line(40, y, W - 40, y);
  y += 22;

  const cards = [
    { label: "Total Sales", value: fmtINR(total) },
    { label: "Transactions", value: String(txCount) },
    { label: "Period", value: `Last ${days} day${days > 1 ? "s" : ""}` },
    { label: "Active Shops", value: String(new Set(periodSales.map(x => x.shopId)).size) },
  ];
  const cardW = (W - 80 - 30) / 4;
  cards.forEach((c, i) => {
    const x = 40 + i * (cardW + 10);
    doc.setFillColor(245, 245, 250);
    doc.roundedRect(x, y, cardW, 56, 6, 6, "F");
    doc.setFontSize(9);
    doc.setTextColor(110, 110, 120);
    doc.setFont("helvetica", "normal");
    doc.text(c.label.toUpperCase(), x + 12, y + 18);
    doc.setFontSize(13);
    doc.setTextColor(30, 30, 30);
    doc.setFont("helvetica", "bold");
    doc.text(c.value, x + 12, y + 40);
  });
  y += 80;

  // Top areas
  const areas = areaPerformance(s, days).sort((a, b) => b.current - a.current);
  autoTable(doc, {
    startY: y,
    head: [["Area", "Sales", "Growth", "vs Previous"]],
    body: areas.map(a => [a.area, fmtINR(a.current), `${a.growth >= 0 ? "+" : ""}${a.growth}%`, fmtINR(a.previous)]),
    headStyles: { fillColor: [67, 56, 202], textColor: 255, fontStyle: "bold" },
    styles: { fontSize: 10, cellPadding: 6 },
    alternateRowStyles: { fillColor: [248, 248, 252] },
    margin: { left: 40, right: 40 },
    didDrawPage: (data) => {
      if (data.pageNumber === 1) {
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 30, 30);
        doc.text("Area Performance", 40, y - 8);
      }
    },
  });
  y = (doc as any).lastAutoTable.finalY + 24;

  // Top shops
  const top = topShops(s, 5, days);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  doc.text("Top Performing Shops", 40, y - 4);
  autoTable(doc, {
    startY: y + 2,
    head: [["Shop", "Area", "Sales", "Trend"]],
    body: top.map(t => [t.name, t.area, fmtINR(t.sales), `${t.trend >= 0 ? "+" : ""}${t.trend}%`]),
    headStyles: { fillColor: [67, 56, 202], textColor: 255, fontStyle: "bold" },
    styles: { fontSize: 10, cellPadding: 6 },
    alternateRowStyles: { fillColor: [248, 248, 252] },
    margin: { left: 40, right: 40 },
  });
  y = (doc as any).lastAutoTable.finalY + 24;

  // Underperforming shops
  const under = s.shops
    .map(sh => ({ ...sh, sales: s.sales.filter(x => x.shopId === sh.id && x.date >= cutoff).reduce((a, x) => a + x.total, 0) }))
    .sort((a, b) => a.sales - b.sales)
    .slice(0, 5);
  if (y > 700) { doc.addPage(); y = 60; }
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(180, 30, 30);
  doc.text("Underperforming Shops (need attention)", 40, y - 4);
  autoTable(doc, {
    startY: y + 2,
    head: [["Shop", "Area", "Sales", "Last Visit"]],
    body: under.map(u => [u.name, u.area, fmtINR(u.sales), u.lastVisit === "Never" ? "Never" : `${daysBetween(u.lastVisit)} days ago`]),
    headStyles: { fillColor: [180, 30, 30], textColor: 255, fontStyle: "bold" },
    styles: { fontSize: 10, cellPadding: 6 },
    alternateRowStyles: { fillColor: [253, 245, 245] },
    margin: { left: 40, right: 40 },
  });

  // Footer page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Sales Intelligence · ${title} · Page ${i} of ${pageCount}`, W / 2, doc.internal.pageSize.getHeight() - 20, { align: "center" });
  }

  const fname = `sales-${period}-${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(fname);
  return { fname, total, txCount };
}

export function buildReportSummary(period: ReportPeriod) {
  const s = store.get();
  const days = periodDays[period];
  const cutoff = daysAgo(days - 1);
  const periodSales = s.sales.filter(x => x.date >= cutoff);
  const total = periodSales.reduce((a, x) => a + x.total, 0);
  const txCount = periodSales.length;
  const activeShops = new Set(periodSales.map(x => x.shopId)).size;
  const areas = areaPerformance(s, days).sort((a, b) => b.current - a.current).slice(0, 3);
  const top = topShops(s, 3, days);
  const title = `${period.charAt(0).toUpperCase() + period.slice(1)} Sales Report`;

  const lines = [
    `*📊 ${title}*`,
    `_${new Date().toLocaleString("en-IN")}_`,
    ``,
    `*Summary*`,
    `• Total Sales: ${fmtINR(total)}`,
    `• Transactions: ${txCount}`,
    `• Active Shops: ${activeShops}`,
    `• Period: Last ${days} day${days > 1 ? "s" : ""}`,
    ``,
    `*Top Areas*`,
    ...areas.map((a, i) => `${i + 1}. ${a.area} — ${fmtINR(a.current)} (${a.growth >= 0 ? "+" : ""}${a.growth}%)`),
    ``,
    `*Top Shops*`,
    ...top.map((t, i) => `${i + 1}. ${t.name} — ${fmtINR(t.sales)}`),
    ``,
    `_Sent from Sales Intelligence_`,
  ];
  return lines.join("\n");
}

export function shareReportOnWhatsApp(period: ReportPeriod, phone?: string) {
  const text = encodeURIComponent(buildReportSummary(period));
  const cleaned = phone ? phone.replace(/[^0-9]/g, "") : "";
  const url = cleaned
    ? `https://api.whatsapp.com/send?phone=${cleaned}&text=${text}`
    : `https://api.whatsapp.com/send?text=${text}`;
  const win = window.open(url, "_blank", "noopener,noreferrer");
  if (!win) {
    // Popup blocked — fall back to same-tab navigation
    window.location.href = url;
  }
}
