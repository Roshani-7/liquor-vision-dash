import { useStore, topShops, fmtCompactINR } from "@/lib/store";

export function TopShops() {
  const shops = useStore(s => topShops(s, 5, 30));
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card-soft">
      <h3 className="text-sm font-semibold text-card-foreground">Top Performing Shops (30d)</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="pb-2 font-semibold">Shop</th>
              <th className="pb-2 font-semibold">Area</th>
              <th className="pb-2 font-semibold text-right">Sales</th>
              <th className="pb-2 font-semibold text-right">Trend</th>
            </tr>
          </thead>
          <tbody>
            {shops.map(shop => (
              <tr key={shop.id} className="border-b border-border/50 last:border-0">
                <td className="py-2.5 font-medium text-card-foreground">{shop.name}</td>
                <td className="py-2.5 text-muted-foreground">{shop.area}</td>
                <td className="py-2.5 text-right text-card-foreground">{fmtCompactINR(shop.sales)}</td>
                <td className={`py-2.5 text-right font-semibold ${shop.trend >= 0 ? "text-success" : "text-destructive"}`}>
                  {shop.trend >= 0 ? "+" : ""}{shop.trend}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
