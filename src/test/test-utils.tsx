import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { shadcnTheme } from "../../theme";
import { shadcnCssVariableResolver } from "../../cssVariableResolver";

// Crear un QueryClient para tests
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

// Wrapper personalizado para tests
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        theme={shadcnTheme}
        cssVariablesResolver={shadcnCssVariableResolver}
      >
        {children}
      </MantineProvider>
    </QueryClientProvider>
  );
};

// Función de render personalizada
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-exportar todo
export * from "@testing-library/react";
export { customRender as render };

// Utilidades adicionales para tests
export const mockProduct = {
  id: "1",
  name: "Producto de Prueba",
  description: "Descripción del producto de prueba",
  careInstructions: "Lavar a mano",
  sku: "TEST-001",
  imageUrl: "https://example.com/image.jpg",
  stock: 10,
  price: 29.99,
  status: "active",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  inventories: [
    {
      id: "1",
      color: {
        id: "1",
        color: "Rojo",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
      size: {
        id: "1",
        size: "M",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
      quantity: 10,
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
    },
  ],
};

export const mockUser = {
  id: "1",
  firstName: "Usuario",
  lastName: "Prueba",
  email: "test@example.com",
  phone: "1234567890",
  password: "password123",
  identificationType: "CC",
  identificationNumber: "12345678",
  userType: "Customer" as const,
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z"),
};
