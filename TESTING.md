# Testing Guide

Este proyecto utiliza Jest y React Testing Library para tests unitarios.

## Configuración

Los tests están configurados con:

- **Jest**: Framework de testing
- **React Testing Library**: Utilidades para testing de componentes React
- **@testing-library/jest-dom**: Matchers adicionales para Jest
- **@testing-library/user-event**: Simulación de eventos de usuario

## Comandos Disponibles

```bash
# Ejecutar todos los tests una vez
npm test

# Ejecutar tests en modo watch (se re-ejecutan al cambiar archivos)
npm run test:watch

# Ejecutar tests con reporte de cobertura
npm run test:coverage

# Ejecutar tests para CI (sin watch, con cobertura)
npm run test:ci
```

## Estructura de Tests

Los tests están organizados de la siguiente manera:

```
src/
├── components/
│   ├── __tests__/           # Tests de componentes generales
│   └── inputs/
│       └── __tests__/       # Tests de componentes de input
├── store/
│   └── __tests__/           # Tests de stores (Zustand)
├── utils/
│   └── __tests__/           # Tests de utilidades
└── test/
    ├── setup.ts             # Configuración global de tests
    └── test-utils.tsx       # Utilidades y wrappers para tests
```

## Ejemplos de Tests Incluidos

### 1. Componente TextInputField

- Renderizado básico
- Validaciones (required, minLength, maxLength, pattern)
- Interacciones de usuario

### 2. Componente ProductCard

- Renderizado de información del producto
- Estados de stock
- Navegación y eventos
- Integración con store del carrito

### 3. Componente StatCard

- Renderizado de estadísticas
- Colores condicionales
- Formateo de datos

### 4. Store de Autenticación

- Estados iniciales
- Autenticación de diferentes tipos de usuario
- Permisos de administrador
- Logout

### 5. Utilidades de Formato

- Formateo de moneda
- Manejo de casos edge
- Precisión numérica

## Escribir Nuevos Tests

### Para Componentes React:

```tsx
import { render, screen, fireEvent } from "../../../test/test-utils";
import { MiComponente } from "../mi-componente";

describe("MiComponente", () => {
  it("renderiza correctamente", () => {
    render(<MiComponente prop="valor" />);

    expect(screen.getByText("Texto esperado")).toBeInTheDocument();
  });

  it("maneja eventos de usuario", () => {
    const mockHandler = jest.fn();
    render(<MiComponente onClick={mockHandler} />);

    fireEvent.click(screen.getByRole("button"));
    expect(mockHandler).toHaveBeenCalled();
  });
});
```

### Para Stores (Zustand):

```tsx
import { renderHook, act } from "../../test/test-utils";
import useMiStore from "../useMiStore";

describe("useMiStore", () => {
  it("tiene el estado inicial correcto", () => {
    const { result } = renderHook(() => useMiStore());

    expect(result.current.valor).toBe(valorEsperado);
  });

  it("actualiza el estado correctamente", () => {
    const { result } = renderHook(() => useMiStore());

    act(() => {
      result.current.actualizarValor(nuevoValor);
    });

    expect(result.current.valor).toBe(nuevoValor);
  });
});
```

### Para Funciones Utilitarias:

```tsx
import { miFuncion } from "../mi-utilidad";

describe("miFuncion", () => {
  it("procesa entrada correctamente", () => {
    const resultado = miFuncion(entrada);
    expect(resultado).toBe(resultadoEsperado);
  });

  it("maneja casos edge", () => {
    expect(miFuncion(null)).toBe(valorPorDefecto);
    expect(miFuncion(undefined)).toBe(valorPorDefecto);
  });
});
```

## Mocking

### Mocking de Módulos:

```tsx
jest.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
}));
```

### Mocking de Stores:

```tsx
jest.mock("../../../store/useCart", () => ({
  __esModule: true,
  default: () => ({
    addToCart: mockAddToCart,
  }),
}));
```

## Cobertura de Código

El reporte de cobertura se genera en la carpeta `coverage/` e incluye:

- Líneas cubiertas
- Funciones cubiertas
- Branches cubiertas
- Statements cubiertas

Para ver el reporte en HTML, abre `coverage/lcov-report/index.html` en tu navegador.

## Mejores Prácticas

1. **Nombra los tests descriptivamente**: Usa "debería..." o "cuando... entonces..."
2. **Organiza con describe/it**: Agrupa tests relacionados
3. **Usa beforeEach/afterEach**: Para setup y cleanup
4. **Testea comportamiento, no implementación**: Enfócate en lo que hace el componente
5. **Usa screen queries apropiadas**: getByRole, getByText, getByLabelText, etc.
6. **Mock dependencias externas**: APIs, routers, stores cuando sea necesario
7. **Testea casos edge**: valores null, undefined, arrays vacíos, etc.

## Troubleshooting

### Error: "Cannot find module"

- Verifica que todas las dependencias estén instaladas
- Revisa los paths en moduleNameMapping en jest.config.js

### Error: "window.matchMedia is not a function"

- Ya está configurado en setup.ts, pero verifica que se esté importando

### Tests lentos

- Usa `test:watch` para desarrollo
- Considera usar `test.only()` para tests específicos durante desarrollo

### Problemas con ES Modules

- La configuración ya maneja ES modules, pero verifica jest.config.js si hay problemas

