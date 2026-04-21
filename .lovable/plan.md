
## Problem

The PDF reports come out blank/empty due to a **library version mismatch**:
- `jspdf@^4.2.1` + `jspdf-autotable@^5.0.7` are installed
- The code uses the old v3-era API: `(doc as any).lastAutoTable.finalY`
- In autotable **v5**, that property is no longer attached to the `doc` instance — it's returned from `autoTable()` directly
- Result: `y` becomes `undefined` → `NaN` → all subsequent `doc.text(...)` and `autoTable({ startY: NaN })` calls render nothing → blank pages after the header

The same issue affects `src/pages/ExpensesPage.tsx` (it relies on autotable chaining the next table automatically, which also broke in v5).

## Fix (single approach — recommended)

**Downgrade to the well-tested combination** that matches the existing code patterns and is broadly used in the React/Vite ecosystem:
- `jspdf@^2.5.2`
- `jspdf-autotable@^3.8.4`

These versions:
- Keep `(doc as any).lastAutoTable.finalY` working
- Keep `autoTable(doc, options)` chaining working (used in ExpensesPage)
- Match the API the current code was written against

### Steps
1. Update `package.json` to pin `jspdf@^2.5.2` and `jspdf-autotable@^3.8.4`, then reinstall.
2. No code changes needed in `src/lib/pdfReport.ts` or `src/pages/ExpensesPage.tsx` — the existing API calls will work again.
3. Verify by generating a Daily/Weekly/Monthly report and an Expense report — both should now contain header + summary cards + tables on every page.

### Why not "fix the v5 API"
We could rewrite both files to capture `const result = autoTable(doc, {...}); y = result.finalY` for v5 — but that's two files of changes plus subtle differences across v5's options shape. Downgrading is one-line, low-risk, and preserves the existing structured layout already QA'd in your code.
