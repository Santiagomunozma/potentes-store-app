import "@testing-library/jest-dom";

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(className: string): R;
      toHaveStyle(style: Record<string, unknown>): R;
      toHaveTextContent(text: string): R;
      toBeRequired(): R;
      toBeDisabled(): R;
      toHaveValue(value: unknown): R;
      toHaveAttribute(attr: string, value?: string): R;
      toBeVisible(): R;
      toBeEmptyDOMElement(): R;
      toHaveFocus(): R;
    }
  }
}
