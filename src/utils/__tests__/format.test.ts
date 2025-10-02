import { formatCurrency } from "../format";

describe("formatCurrency", () => {
  it("formatea números enteros correctamente", () => {
    expect(formatCurrency(100)).toBe("$100.00");
    expect(formatCurrency(1000)).toBe("$1,000.00");
    expect(formatCurrency(1234567)).toBe("$1,234,567.00");
  });

  it("formatea números decimales correctamente", () => {
    expect(formatCurrency(99.99)).toBe("$99.99");
    expect(formatCurrency(1234.56)).toBe("$1,234.56");
    expect(formatCurrency(0.99)).toBe("$0.99");
  });

  it("maneja el valor cero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("maneja números negativos", () => {
    expect(formatCurrency(-100)).toBe("-$100.00");
    expect(formatCurrency(-1234.56)).toBe("-$1,234.56");
  });

  it("redondea números con más de 2 decimales", () => {
    expect(formatCurrency(99.999)).toBe("$100.00");
    expect(formatCurrency(99.994)).toBe("$99.99");
    expect(formatCurrency(123.456789)).toBe("$123.46");
  });

  it("maneja números muy pequeños", () => {
    expect(formatCurrency(0.01)).toBe("$0.01");
    expect(formatCurrency(0.001)).toBe("$0.00");
  });

  it("maneja números muy grandes", () => {
    expect(formatCurrency(999999999.99)).toBe("$999,999,999.99");
    expect(formatCurrency(1000000000)).toBe("$1,000,000,000.00");
  });

  it("mantiene siempre 2 decimales", () => {
    expect(formatCurrency(100.1)).toBe("$100.10");
    expect(formatCurrency(100.0)).toBe("$100.00");
  });

  it("maneja valores de punto flotante con precisión", () => {
    expect(formatCurrency(0.1 + 0.2)).toBe("$0.30"); // Evita problemas de precisión de JS
    expect(formatCurrency(1.005)).toBe("$1.01"); // Redondeo correcto
  });
});

