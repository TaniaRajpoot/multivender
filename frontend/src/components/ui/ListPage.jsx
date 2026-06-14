import React from "react";
import { ui } from "../../styles/theme";

const ListPage = ({ title, subtitle, action, children, loading }) => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div>
        <h1 className={ui.titleSm}>{title}</h1>
        {subtitle && <p className={ui.subtitle}>{subtitle}</p>}
      </div>
      {action}
    </div>
    <div className={`${ui.card} ${ui.cardPadding} overflow-hidden`}>
      {loading ? <p className={ui.empty}>Loading...</p> : children}
    </div>
  </div>
);

export default ListPage;
