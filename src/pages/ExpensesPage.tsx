import { useMemo, useRef, useState } from "react";
import { Wallet, Plus, Trash2, Download, Paperclip, X } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useStore, store, fmtINR, type Expense } from "@/lib/store";

const CATEGORIES: Expense["category"][] = ["Travel", "Food", "Lodging", "Fuel", "Other"];
const MAX_BILL_BYTES = 4 * 1024 * 1024; // 4 MB raw upload cap

function fileToCompressedDataUrl(file: File, maxDim = 1280, quality = 0.78): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not read image"));
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas unavailable"));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function loadImageSize(dataUrl: string): Promise<{ w: number; h: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.width, h: img.height });
    img.onerror = () => resolve({ w: 600, h: 800 });
    img.src = dataUrl;
  });
}

export default function ExpensesPage() {
  const expenses = useStore(s => s.expenses);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState<Expense["category"]>("Travel");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [billImage, setBillImage] = useState<string | undefined>(undefined);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const summary = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const monthStart = today.slice(0, 7) + "-01";
    const byCat = new Map<string, number>();
    let monthTotal = 0, todayTotal = 0;
    expenses.forEach(e => {
      byCat.set(e.category, (byCat.get(e.category) ?? 0) + e.amount);
      if (e.date >= monthStart) monthTotal += e.amount;
      if (e.date === today) todayTotal += e.amount;
    });
    const total = expenses.reduce((a, e) => a + e.amount, 0);
    return { total, monthTotal, todayTotal, byCat: [...byCat.entries()].sort((a, b) => b[1] - a[1]) };
  }, [expenses]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { toast.error("Enter a valid amount"); return; }
    store.addExpense({ date, category, amount: amt, notes, billImage });
    toast.success("Expense added");
    setAmount(""); setNotes(""); setBillImage(undefined);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleBillSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) { toast.error("Please select an image"); return; }
    if (f.size > MAX_BILL_BYTES) { toast.error("Image too large (max 4MB)"); return; }
    try {
      const url = await fileToCompressedDataUrl(f);
      setBillImage(url);
      toast.success("Bill attached");
    } catch {
      toast.error("Could not read image");
    }
  };

  const handleDelete = (id: number) => {
    store.deleteExpense(id);
    toast.success("Expense removed");
  };

  const handleReport = async () => {
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    doc.setFontSize(16);
    doc.text("Expense Report", 14, 18);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString("en-IN")}`, 14, 25);

    autoTable(doc, {
      startY: 32,
      head: [["Summary", "Amount"]],
      body: [
        ["Today", fmtINR(summary.todayTotal)],
        ["This Month", fmtINR(summary.monthTotal)],
        ["All-time Total", fmtINR(summary.total)],
        ["Entries", String(expenses.length)],
        ["Bills attached", String(expenses.filter(e => e.billImage).length)],
      ],
      theme: "grid",
      headStyles: { fillColor: [37, 99, 235] },
    });

    if (summary.byCat.length) {
      autoTable(doc, {
        head: [["Category", "Amount"]],
        body: summary.byCat.map(([c, v]) => [c, fmtINR(v)]),
        theme: "striped",
        headStyles: { fillColor: [37, 99, 235] },
      });
    }

    if (expenses.length) {
      autoTable(doc, {
        head: [["Date", "Category", "Amount", "Notes", "Bill"]],
        body: [...expenses]
          .sort((a, b) => b.date.localeCompare(a.date))
          .map(e => [e.date, e.category, fmtINR(e.amount), e.notes ?? "", e.billImage ? "Yes" : "—"]),
        theme: "striped",
        headStyles: { fillColor: [37, 99, 235] },
      });
    }

    const withBills = [...expenses]
      .filter(e => !!e.billImage)
      .sort((a, b) => b.date.localeCompare(a.date));
    for (const e of withBills) {
      doc.addPage();
      doc.setFontSize(14);
      doc.setTextColor(20);
      doc.text("Bill Receipt", 14, 18);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`${e.date} · ${e.category} · ${fmtINR(e.amount)}`, 14, 25);
      if (e.notes) doc.text(`Notes: ${e.notes}`, 14, 31);

      const { w, h } = await loadImageSize(e.billImage!);
      const maxW = pageW - 28;
      const maxH = pageH - 50;
      const ratio = Math.min(maxW / w, maxH / h);
      const drawW = w * ratio;
      const drawH = h * ratio;
      const x = (pageW - drawW) / 2;
      const y = 38;
      try {
        doc.addImage(e.billImage!, "JPEG", x, y, drawW, drawH);
      } catch {
        doc.setTextColor(180, 30, 30);
        doc.text("(Could not embed image)", 14, y + 10);
      }
    }

    const fname = `expense-report-${new Date().toISOString().split("T")[0]}.pdf`;
    doc.save(fname);
    toast.success("Expense report downloaded", { description: fname });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Wallet className="h-6 w-6 text-primary" />
            Expense Tracker
          </h1>
          <p className="text-sm text-muted-foreground">Log travel and daily expenses, then export a quick report.</p>
        </div>
        <Button onClick={handleReport} variant="outline" className="gap-2">
          <Download className="h-4 w-4" /> Download Report
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">Today</p>
          <p className="mt-1 text-xl font-bold">{fmtINR(summary.todayTotal)}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">This Month</p>
          <p className="mt-1 text-xl font-bold">{fmtINR(summary.monthTotal)}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">All-time Total</p>
          <p className="mt-1 text-xl font-bold">{fmtINR(summary.total)}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <form onSubmit={handleAdd} className="space-y-4 rounded-lg border bg-card p-5">
          <h2 className="font-semibold">Add Expense</h2>
          <div className="space-y-2">
            <Label htmlFor="exp-date">Date</Label>
            <Input id="exp-date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Expense["category"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="exp-amt">Amount (₹)</Label>
            <Input id="exp-amt" type="number" min="1" step="1" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="exp-notes">Notes</Label>
            <Input id="exp-notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional" />
          </div>
          <Button type="submit" className="w-full gap-2"><Plus className="h-4 w-4" /> Add Expense</Button>
        </form>

        <div className="rounded-lg border bg-card">
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="font-semibold">Recent Expenses</h2>
            <span className="text-xs text-muted-foreground">{expenses.length} entries</span>
          </div>
          {expenses.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">No expenses yet. Log your first one on the left.</p>
          ) : (
            <div className="divide-y">
              {[...expenses].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 20).map(e => (
                <div key={e.id} className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium">{e.category}</span>
                      <span className="text-xs text-muted-foreground">{e.date}</span>
                    </div>
                    {e.notes && <p className="mt-1 truncate text-sm text-muted-foreground">{e.notes}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{fmtINR(e.amount)}</span>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(e.id)} aria-label="Delete">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {summary.byCat.length > 0 && (
            <div className="border-t p-4">
              <p className="mb-2 text-xs font-medium text-muted-foreground">By Category</p>
              <div className="flex flex-wrap gap-2">
                {summary.byCat.map(([c, v]) => (
                  <span key={c} className="rounded-md bg-muted px-2.5 py-1 text-xs">
                    {c}: <span className="font-semibold">{fmtINR(v)}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
