import { render, screen, fireEvent } from "../../../test/test-utils";
import { useForm } from "react-hook-form";
import { TextInputField } from "../text-input";

// Componente wrapper para testing
const TestWrapper = ({
  required = false,
  minLength,
  maxLength,
  patternRule,
  validate,
}: {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  patternRule?: { value: RegExp; message: string };
  validate?: (value: string) => string | boolean;
}) => {
  const { control } = useForm({
    defaultValues: {
      testField: "",
    },
  });

  return (
    <TextInputField
      name="testField"
      control={control}
      label="Campo de Prueba"
      placeholder="Ingresa texto"
      required={required}
      minLength={minLength}
      maxLength={maxLength}
      patternRule={patternRule}
      validate={validate}
    />
  );
};

describe("TextInputField", () => {
  it("renderiza correctamente con props básicas", () => {
    render(<TestWrapper />);

    expect(screen.getByLabelText("Campo de Prueba")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ingresa texto")).toBeInTheDocument();
  });

  it("muestra el campo como requerido cuando required es true", () => {
    render(<TestWrapper required />);

    const input = screen.getByRole("textbox");
    expect(input).toBeRequired();
  });

  it("permite escribir texto en el campo", () => {
    render(<TestWrapper />);

    const input = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Texto de prueba" } });

    expect(input.value).toBe("Texto de prueba");
  });

  it("renderiza con configuración de longitud mínima", () => {
    render(<TestWrapper minLength={5} />);

    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
  });

  it("renderiza con configuración de longitud máxima", () => {
    render(<TestWrapper maxLength={10} />);

    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
  });

  it("renderiza con validación de patrón personalizado", () => {
    const patternRule = {
      value: /^[A-Za-z]+$/,
      message: "Solo letras permitidas",
    };

    render(<TestWrapper patternRule={patternRule} />);

    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
  });

  it("tiene la clase CSS correcta", () => {
    render(<TestWrapper />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("mantine-TextInput-input");
  });
});
