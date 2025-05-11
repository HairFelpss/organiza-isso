import { forwardRef } from "react";
import { Button as BaseButton } from "./button";
import type { ButtonProps } from "./button";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    return <BaseButton {...props} ref={ref} />;
  },
);

Button.displayName = "Button";
