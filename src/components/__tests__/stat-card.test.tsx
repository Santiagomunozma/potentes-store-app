/**
 * @jest-environment jsdom
 */
import { render, screen } from "../../test/test-utils";
import { StatCard } from "../stat-card";

describe("StatCard", () => {
  it("renderiza correctamente con props básicas", () => {
    render(<StatCard label="Ventas Totales" value="$12,345" change="+15%" />);

    // Verificar que los elementos están presentes
    const label = screen.getByText("Ventas Totales");
    const value = screen.getByText("$12,345");
    const change = screen.getByText("+15% desde el mes pasado");

    expect(label).toBeTruthy();
    expect(value).toBeTruthy();
    expect(change).toBeTruthy();
  });

  it("muestra el cambio positivo", () => {
    render(<StatCard label="Usuarios" value="1,234" change="+5%" />);

    const changeText = screen.getByText("+5% desde el mes pasado");
    expect(changeText).toBeTruthy();
  });

  it("muestra el cambio negativo", () => {
    render(<StatCard label="Inventario" value="456" change="-3%" />);

    const changeText = screen.getByText("-3% desde el mes pasado");
    expect(changeText).toBeTruthy();
  });

  it("maneja cambios sin signo", () => {
    render(<StatCard label="Productos" value="789" change="2%" />);

    const changeText = screen.getByText("2% desde el mes pasado");
    expect(changeText).toBeTruthy();
  });

  it("tiene la estructura de Card correcta", () => {
    const { container } = render(
      <StatCard label="Test Label" value="Test Value" change="+10%" />
    );

    const card = container.querySelector(".mantine-Card-root");
    expect(card).toBeTruthy();
  });

  it("muestra el título como heading", () => {
    render(<StatCard label="Pedidos" value="999" change="+25%" />);

    const title = screen.getByRole("heading", { level: 3 });
    expect(title.textContent).toBe("999");
  });

  it("renderiza con valores vacíos", () => {
    render(<StatCard label="" value="" change="" />);

    const changeText = screen.getByText("desde el mes pasado");
    expect(changeText).toBeTruthy();
  });

  it("maneja valores con caracteres especiales", () => {
    render(
      <StatCard label="Ventas & Comisiones" value="$1,234.56" change="+12.5%" />
    );

    expect(screen.getByText("Ventas & Comisiones")).toBeTruthy();
    expect(screen.getByText("$1,234.56")).toBeTruthy();
    expect(screen.getByText("+12.5% desde el mes pasado")).toBeTruthy();
  });
});
