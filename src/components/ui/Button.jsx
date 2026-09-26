import React from "react";

const variantClassNames = {
    primary: "btn-primary",
    outline: "btn-outline",
    ghost: "btn-ghost",
    danger: "btn-danger",
    submit: "btn-submit",
    plain: "",
};

export default function Button({
    variant = "plain",
    className = "",
    type = "button",
    children,
    ...buttonProps
}) {
    const variantClassName = variantClassNames[variant] || "";
    const buttonClassName = `${variantClassName} ${className}`.trim();

    return (
        <button
            type={type}
            className={buttonClassName}
            {...buttonProps}
        >
            {children}
        </button>
    );
}
