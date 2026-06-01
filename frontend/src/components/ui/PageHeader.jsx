import React from "react";
import { ui } from "../../styles/theme";

const PageHeader = ({ title, subtitle, action }) => (
  <div className={`${ui.card} ${ui.cardPadding} mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4`}>
    <div>
      <h1 className={ui.title}>{title}</h1>
      {subtitle && <p className={ui.subtitle}>{subtitle}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

export default PageHeader;
