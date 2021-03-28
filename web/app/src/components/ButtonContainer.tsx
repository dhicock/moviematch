import React, { ReactNode } from "react";

import "./ButtonContainer.css";

interface ButtonContainerProps {
  children: ReactNode;
  paddingTop?: "s1" | "s2" | "s3" | "s4" | "s5" | "s6" | "s7";
  reverseMobile?: boolean;
}

export const ButtonContainer = ({
  children,
  paddingTop,
  reverseMobile,
}: ButtonContainerProps) => (
  <div
    className={`ButtonContainer ${
      reverseMobile ? "ButtonContainerMobileReverse" : ""
    }`}
    style={paddingTop ? { paddingTop: `var(--${paddingTop})` } : {}}
  >
    {children}
  </div>
);
