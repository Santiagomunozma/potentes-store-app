type SaleLine = {
  quantity: number;
  totalPrice: number;
  product?: { name?: string };
  color?: { color?: string };
  size?: { size?: string };
};

type InvoiceSale = {
  id?: string;
  createdAt?: string;
  totalPrice: number;
  couponCode?: string | null;
  status?: string;
  customer?: { user?: { firstName?: string; lastName?: string } };
  productSells?: SaleLine[];
};

const statusLabel: Record<string, string> = {
  paid: "Pagado",
  preparing: "Preparando",
  shipped: "Enviado",
  cancelled: "Anulado",
};

export const downloadInvoice = (sale: InvoiceSale) => {
  const lines = (sale.productSells || [])
    .map(
      (line) =>
        `<tr><td>${line.product?.name || "Producto"}</td><td>${line.size?.size || ""}</td><td>${line.color?.color || ""}</td><td>${line.quantity}</td><td>${line.totalPrice}</td></tr>`
    )
    .join("");
  const customer = sale.customer?.user
    ? `${sale.customer.user.firstName || ""} ${sale.customer.user.lastName || ""}`.trim()
    : "Cliente";
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Factura ${sale.id || ""}</title>
<style>body{font-family:Arial,sans-serif;padding:32px;color:#111}table{width:100%;border-collapse:collapse;margin-top:16px}td,th{border:1px solid #ddd;padding:8px;text-align:left}</style>
</head><body>
<h1>Potentes Store</h1>
<h2>Factura ${sale.id || ""}</h2>
<p>Cliente: ${customer}</p>
<p>Fecha: ${sale.createdAt ? new Date(sale.createdAt).toLocaleDateString("es-CO") : ""}</p>
<p>Estado: ${statusLabel[sale.status || "paid"] || sale.status}</p>
<p>Cupón: ${sale.couponCode || "Ninguno"}</p>
<table><thead><tr><th>Producto</th><th>Talla</th><th>Color</th><th>Cantidad</th><th>Subtotal</th></tr></thead><tbody>${lines}</tbody></table>
<h3>Total: ${sale.totalPrice}</h3>
</body></html>`;
  const blob = new Blob([html], { type: "text/html" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `factura-${(sale.id || "venta").slice(0, 8)}.html`;
  link.click();
  URL.revokeObjectURL(link.href);
};

export { statusLabel };
