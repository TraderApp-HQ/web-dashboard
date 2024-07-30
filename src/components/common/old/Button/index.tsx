import clsx from "clsx";
import type { ReactNode, MouseEventHandler } from "react";
import React, { useMemo } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  onClick?: MouseEventHandler;
  disabled?: boolean;
  fluid?: boolean;
  bgColor?: "bg-blue" | "bg-black" | "bg-white" | "bg-stone-50";
  color?: "text-white" | "text-gray" | "text-blue-800";
  size?: "small" | "medium";
  type?: "submit" | "reset" | "button";
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "medium",
  disabled,
  fluid,
  onClick,
  className,
  innerClassName,
  type = "button",
  color,
  bgColor,
}) => {
  const sizeClassnames = useMemo<string>(() => {
    switch (size) {
      case "small": {
        return "px-3 py-2 text-sm leading-4";
      }

      case "medium": {
        return "px-6 py-2.5 text-sm font-bold";
      }
    }
  }, [size]);
  return (
    <span className={clsx("inline-flex rounded-md", fluid && "w-full", className)}>
      <button
        type={type} /* eslint-disable-line react/button-has-type */
        className={clsx(
          "inline-flex justify-center items-center uppercase rounded-md border border-transparent transition focus:outline-none bg-blue-800 hover:bg-blue-dark active:bg-blue-dark focus:bg-blue-dark disabled:bg-gray-400",
          color ?? "text-white",
          sizeClassnames,
          disabled && "cursor-not-allowed",
          fluid && "w-full",
          innerClassName,
          bgColor,
        )}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    </span>
  );
};

export default Button;
