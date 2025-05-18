import {
  useController,
  Control,
  FieldValues,
  FieldPath,
} from "react-hook-form";
import { PasswordInput, PasswordInputProps } from "@mantine/core";

export interface PasswordInputFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<PasswordInputProps, "value" | "onChange" | "error"> {
  name: TName;
  control: Control<TFieldValues>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  patternRule?: {
    value: RegExp;
    message: string;
  };
  validate?: (value: string) => string | boolean;
  errorMessage?: string;
  description?: string;
}

export function PasswordInputField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  label,
  placeholder,
  required = false,
  minLength,
  maxLength,
  patternRule,
  validate,
  errorMessage,
  description,
  ...restProps
}: PasswordInputFieldProps<TFieldValues, TName>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: {
      required: required ? "This field is required" : false,
      minLength:
        minLength !== undefined
          ? {
              value: minLength,
              message: `Minimum ${minLength} characters required`,
            }
          : undefined,
      maxLength:
        maxLength !== undefined
          ? {
              value: maxLength,
              message: `Maximum ${maxLength} characters allowed`,
            }
          : undefined,
      pattern: patternRule,
      validate,
    },
  });

  return (
    <div className="mb-4">
      <PasswordInput
        {...restProps}
        label={label}
        placeholder={placeholder}
        required={required}
        value={field.value || ""}
        onChange={field.onChange}
        onBlur={field.onBlur}
        name={field.name}
        error={error?.message || errorMessage}
        description={description}
      />
    </div>
  );
}
