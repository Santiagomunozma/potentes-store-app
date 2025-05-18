import {
  useController,
  Control,
  FieldValues,
  FieldPath,
} from "react-hook-form";
import { Text } from "@mantine/core";
import {
  DatePickerInput,
  DatePickerInputProps,
  DateValue,
  DatesRangeValue,
} from "@mantine/dates";

export interface DateInputFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<DatePickerInputProps, "value" | "onChange" | "error"> {
  name: TName;
  control: Control<TFieldValues>;
  label?: string;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  required?: boolean;
  errorMessage?: string;
  description?: string;
}

export function DateInputField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  label,
  placeholder,
  minDate,
  maxDate,
  required = false,
  errorMessage,
  description,
  ...restProps
}: DateInputFieldProps<TFieldValues, TName>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: {
      required: required ? "Este campo es requerido" : false,
    },
  });

  const handleChange = (value: DateValue | DatesRangeValue | Date[]) => {
    // Asegurarnos de que el valor sea un objeto Date válido
    const dateValue = value instanceof Date ? value : null;
    field.onChange(dateValue);
  };

  // Convertir el valor del campo a un objeto Date válido
  const fieldValue = field.value ? new Date(field.value) : null;

  return (
    <div className="mb-4">
      <DatePickerInput
        {...restProps}
        label={label}
        placeholder={placeholder}
        minDate={minDate}
        maxDate={maxDate}
        required={required}
        value={fieldValue}
        onChange={handleChange}
        onBlur={field.onBlur}
        name={field.name}
        error={error?.message || errorMessage}
        description={description}
      />
      {error && (
        <Text color="red" size="xs" mt={4}>
          {error.message}
        </Text>
      )}
    </div>
  );
}
