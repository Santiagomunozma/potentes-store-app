/**
 * Formatea un número como moneda (pesos mexicanos)
 * @param value El valor a formatear
 * @returns El valor formateado como moneda
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};
