/** Design tokens — use across all pages */
export const ui = {
  page: "min-h-screen bg-gray-50 text-gray-800",
  container: "max-w-6xl mx-auto px-4 sm:px-6",
  containerWide: "max-w-7xl mx-auto px-4 sm:px-6",
  section: "py-10 md:py-14",
  card: "bg-white rounded-xl border border-gray-200 shadow-sm",
  cardPadding: "p-5 sm:p-6",
  cardHover: "bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow",

  title: "text-2xl sm:text-3xl font-semibold text-gray-900",
  titleSm: "text-xl font-semibold text-gray-900",
  subtitle: "text-sm text-gray-600 mt-1",
  sectionTitle: "text-lg font-semibold text-gray-900",
  label: "block text-sm font-medium text-gray-700 mb-1.5",
  hint: "text-xs text-gray-500 mt-1",

  input:
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 outline-none transition",
  select:
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 outline-none",
  textarea:
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 outline-none resize-y min-h-[100px]",

  btnPrimary:
    "inline-flex items-center justify-center gap-2 rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 focus:ring-2 focus:ring-teal-600/30 transition disabled:opacity-50",
  btnSecondary:
    "inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition",
  btnDanger:
    "inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition",
  btnAccent:
    "inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition",

  badge: "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  badgeGreen: "bg-green-100 text-green-800",
  badgeYellow: "bg-yellow-100 text-yellow-800",
  badgeGray: "bg-gray-100 text-gray-700",

  sidebarLink:
    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition w-full",
  sidebarLinkActive:
    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold bg-teal-700 text-white shadow-sm w-full",

  tableWrap: "bg-white rounded-xl border border-gray-200 overflow-hidden",
  empty: "text-center py-12 text-gray-500 text-sm",
};

export default ui;
