"use client";
import { Input, InputProps } from "@nextui-org/react";
import { KeyboardEvent } from "react";
import { MdSearch } from "react-icons/md";
interface SearchProps {
  className?: string;
  label?: string;
  variant?: InputProps["variant"];
  size?: InputProps["size"];
  onEnterKeyPress?: (value: string, clear: () => void) => void;
}
export default function Search({
  className,
  label,
  variant = "bordered",
  size,
  onEnterKeyPress,
}: SearchProps) {
  const onKeyUp = (e: KeyboardEvent) => {
    const target = e.target as HTMLInputElement;
    const clear = () => {
      target.value = "";
    };
    if (e.key === "Enter") {
      onEnterKeyPress?.(target.value, clear);
    }
  };
  return (
    <Input
      className={className}
      label={label}
      variant={variant}
      size={size}
      startContent={<MdSearch size={22} />}
      onKeyUp={onKeyUp}
    />
  );
}
