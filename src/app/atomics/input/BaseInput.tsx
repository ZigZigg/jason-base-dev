"use client";

import { Input, InputProps } from "antd";
import classNames from "classnames";
import styles from "./BaseInput.module.scss"; // Optional: For custom styles

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface BaseInputProps extends InputProps {
}

export default function BaseInput({
  className,
  type,
  ...props
}: BaseInputProps) {
  // Combine Ant Design's Input classes with custom styles
  const inputClasses = classNames(
    styles.baseInput, // Base styles from CSS Module
    'text-base!',
    className // Allow additional classes from props
  );

  if (type === 'password') {
    return <Input.Password className={inputClasses} {...props} />;
  }

  return <Input className={inputClasses} {...props} />;
}