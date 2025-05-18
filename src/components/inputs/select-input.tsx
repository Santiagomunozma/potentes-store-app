import {
  useController,
  Control,
  FieldValues,
  FieldPath,
} from "react-hook-form";
import { Select, SelectProps, Text } from "@mantine/core";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface SelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TValue = string | null,
> extends Omit<SelectProps, "value" | "onChange" | "error" | "data"> {
  name: TName;
  control: Control<TFieldValues>;
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  required?: boolean;
  clearable?: boolean;
  searchable?: boolean;
  errorMessage?: string;
  description?: string;
  transform?: {
    input?: (value: TValue) => string | null;
    output?: (value: string | null) => TValue;
  };
}

export function SelectField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TValue = string | null,
>({
  name,
  control,
  label,
  placeholder,
  options,
  required = false,
  clearable = false,
  searchable = false,
  errorMessage,
  description,
  transform,
  ...restProps
}: SelectFieldProps<TFieldValues, TName, TValue>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: {
      required: required ? "This field is required" : false,
    },
  });

  // Transform value before sending to Select component
  const baseValue = field.value;

  let inputValue: string | null;

  if (transform?.input) {
    // The transform.input function is responsible for returning string | null
    inputValue = transform.input(baseValue as TValue);
  } else {
    // If baseValue is undefined (from RHF reset), coerce to null for Mantine Select.
    // If baseValue is already a string or null, it's fine.
    // The type TValue defaults to string | null, but RHF's field.value can become undefined.
    inputValue = baseValue === undefined ? null : (baseValue as string | null);
  }

  // Handle changes and transform if needed
  const handleChange = (value: string | null) => {
    const transformedValue = transform?.output
      ? transform.output(value)
      : value;
    field.onChange(transformedValue);
  };

  return (
    <div className="mb-4">
      <Select
        {...restProps}
        label={label}
        placeholder={placeholder}
        required={required}
        clearable={clearable}
        searchable={searchable}
        value={inputValue}
        onChange={handleChange}
        onBlur={field.onBlur}
        name={field.name}
        error={error?.message || errorMessage}
        description={description}
        data={options.map((option) => ({
          value: option.value,
          label: option.label,
          disabled: option.disabled,
        }))}
      />
      {error && (
        <Text c="red" size="xs" mt={4}>
          {error.message}
        </Text>
      )}
    </div>
  );
}
