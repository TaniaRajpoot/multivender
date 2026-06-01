import React from "react";
import { ui } from "../../styles/theme";

const FormField = ({ label, hint, children, htmlFor }) => (
  <div className="mb-4">
    {label && (
      <label htmlFor={htmlFor} className={ui.label}>
        {label}
      </label>
    )}
    {children}
    {hint && <p className={ui.hint}>{hint}</p>}
  </div>
);

export default FormField;
