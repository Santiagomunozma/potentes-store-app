import { render, screen } from "../../test/test-utils";
import { StatCard } from "../stat-card";

describe("StatCard", () => {
  it("renderiza correctamente con props básicas", () => {
    render(<StatCard label="Ventas Totales" value="$12,345" change="+15%" />);

    expect(screen.getByText("Ventas Totales")).toBeInTheDocument();
    expect(screen.getByText("$12,345")).toBeInTheDocument();
    expect(screen.getByText("+15% desde el mes pasado")).toBeInTheDocument();
  });

  it("muestra el cambio positivo en color verde", () => {
    render(<StatCard label="Usuarios" value="1,234" change="+5%" />);

    const changeText = screen.getByText("+5% desde el mes pasado");
    expect(changeText).toHaveStyle({
      color: "var(--mantine-color-green-filled)",
    });
  });

  it("muestra el cambio negativo en color rojo", () => {
    render(<StatCard label="Inventario" value="456" change="-3%" />);

    const changeText = screen.getByText("-3% desde el mes pasado");
    expect(changeText).toHaveStyle({
      color: "var(--mantine-color-red-filled)",
    });
  });

  it("maneja cambios sin signo como negativos", () => {
    render(<StatCard label="Productos" value="789" change="2%" />);

    const changeText = screen.getByText("2% desde el mes pasado");
    expect(changeText).toHaveStyle({
      color: "var(--mantine-color-red-filled)",
    });
  });

  it("tiene la estructura de Card correcta", () => {
    const { container } = render(
      <StatCard label="Test Label" value="Test Value" change="+10%" />
    );

    const card = container.querySelector(".mantine-Card-root");
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass("mantine-Card-root");
  });

  it("muestra el título con el orden correcto", () => {
    render(<StatCard label="Pedidos" value="999" change="+25%" />);

    const title = screen.getByRole("heading", { level: 3 });
    expect(title).toHaveTextContent("999");
  });

  it("renderiza con valores vacíos", () => {
    render(<StatCard label="" value="" change="" />);

    expect(screen.getByText("desde el mes pasado")).toBeInTheDocument();
  });

  it("maneja valores con caracteres especiales", () => {
    render(
      <StatCard label="Ventas & Comisiones" value="$1,234.56" change="+12.5%" />
    );

    expect(screen.getByText("Ventas & Comisiones")).toBeInTheDocument();
    expect(screen.getByText("$1,234.56")).toBeInTheDocument();
    expect(screen.getByText("+12.5% desde el mes pasado")).toBeInTheDocument();
  });
});
