const shops = [
  { name: "Royal Wine Shop", area: "North", sales: "₹3,45,000", trend: "+15%" },
  { name: "City Beverages", area: "West", sales: "₹2,98,000", trend: "+12%" },
  { name: "Metro Spirits", area: "Central", sales: "₹2,67,000", trend: "+8%" },
  { name: "Star Liquors", area: "South", sales: "₹2,34,000", trend: "+5%" },
  { name: "Diamond Wines", area: "East", sales: "₹2,12,000", trend: "-2%" },
];

export function TopShops() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-card-foreground">Top Performing Shops</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="pb-2 font-medium">Shop</th>
              <th className="pb-2 font-medium">Area</th>
              <th className="pb-2 font-medium text-right">Sales</th>
              <th className="pb-2 font-medium text-right">Trend</th>
            </tr>
          </thead>
          <tbody>
            {shops.map((shop, i) => (
              <tr key={i} className="border-b border-border/50 last:border-0">
                <td className="py-2.5 font-medium text-card-foreground">{shop.name}</td>
                <td className="py-2.5 text-muted-foreground">{shop.area}</td>
                <td className="py-2.5 text-right text-card-foreground">{shop.sales}</td>
                <td className={`py-2.5 text-right font-medium ${shop.trend.startsWith("+") ? "text-success" : "text-destructive"}`}>{shop.trend}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
