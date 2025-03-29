"use client";

import { Button, ButtonProps } from "antd";
import classNames from "classnames";
import styles from "./BaseButton.module.scss"; // Optional: For custom styles

interface BaseButtonProps extends ButtonProps {
    customType?: "primaryActive" | undefined;
}

export default function BaseButton({
    className,
    ...props
}: BaseButtonProps) {
    const { customType, ...restProps } = props;
    // Combine Ant Design's Button classes with custom styles
    const buttonClasses = classNames(
        styles.baseButton,
        {
            [styles.activeButton]: customType === "primaryActive",
        },
        className
    );

    return <Button className={buttonClasses} {...restProps} />;
}