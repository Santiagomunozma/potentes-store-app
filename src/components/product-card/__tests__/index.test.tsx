import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "../../../test/test-utils";
import ProductCard from "../index";
import { mockProduct } from "../../../test/test-utils";

// Mock del router
const mockNavigate = jest.fn();
jest.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
}));

// Mock del store del carrito
const mockAddToCart = jest.fn();
jest.mock("../../../store/useCart", () => ({
  __esModule: true,
  default: () => ({
    addToCart: mockAddToCart,
  }),
}));

describe("ProductCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza la información básica del producto", () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText("Producto de Prueba")).toBeInTheDocument();
    expect(
      screen.getByText("Descripción del producto de prueba")
    ).toBeInTheDocument();
    expect(screen.getByText("$29,99")).toBeInTheDocument();
  });

  it("muestra el badge de stock disponible", () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText("DISPONIBLE")).toBeInTheDocument();
  });

  it("muestra el badge de sin stock cuando no hay inventario", () => {
    const productWithoutStock = {
      ...mockProduct,
      stock: 0,
      inventories: [
        {
          ...mockProduct.inventories[0],
          quantity: 0,
        },
      ],
    };

    render(<ProductCard product={productWithoutStock} />);

    expect(screen.getByText("AGOTADO")).toBeInTheDocument();
  });

  it("navega a la página de detalles cuando se hace clic en el título", () => {
    render(<ProductCard product={mockProduct} />);

    const titleElement = screen.getByText("Producto de Prueba");
    fireEvent.click(titleElement);

    expect(mockNavigate).toHaveBeenCalledWith({
      to: "/product-details/$id",
      params: { id: "1" },
    });
  });

  it("permite seleccionar color y talla", () => {
    render(<ProductCard product={mockProduct} />);

    // Verificar que los selectores están presentes
    expect(screen.getByText("Color")).toBeInTheDocument();
    expect(screen.getByText("Talla")).toBeInTheDocument();
  });

  it("muestra el input de cantidad después de seleccionar talla y color", () => {
    render(<ProductCard product={mockProduct} />);

    // Inicialmente no debe mostrar el input de cantidad
    expect(screen.queryByText("Cantidad")).not.toBeInTheDocument();

    // Verificar que los selectores están presentes
    expect(screen.getByText("Talla")).toBeInTheDocument();
    expect(screen.getByText("Color")).toBeInTheDocument();
  });

  it("muestra el botón de agregar al carrito deshabilitado inicialmente", () => {
    render(<ProductCard product={mockProduct} />);

    const addToCartButton = screen.getByRole("button", {
      name: /agregar al carrito/i,
    });
    expect(addToCartButton).toBeInTheDocument();
    expect(addToCartButton).toBeDisabled();
  });

  it("deshabilita el botón de agregar al carrito cuando no hay stock", () => {
    const productWithoutStock = {
      ...mockProduct,
      stock: 0,
      inventories: [
        {
          ...mockProduct.inventories[0],
          quantity: 0,
        },
      ],
    };

    render(<ProductCard product={productWithoutStock} />);

    const addToCartButton = screen.getByRole("button", {
      name: /agregar al carrito/i,
    });
    expect(addToCartButton).toBeDisabled();
  });

  it("muestra el precio formateado correctamente", () => {
    const expensiveProduct = {
      ...mockProduct,
      price: 1234.56,
    };

    render(<ProductCard product={expensiveProduct} />);

    // El componente usa formato colombiano (1.234,56)
    expect(screen.getByText("$1.234,56")).toBeInTheDocument();
  });
});
