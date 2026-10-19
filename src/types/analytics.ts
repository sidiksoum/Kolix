import { PeriodType } from './common';

export interface DashboardKpiItem {
  id: string;
  label: string;
  value: string;
  rawValue: number;
  trend: string;
  isPositive: boolean;
  iconName: string;
  iconBg: string;
  iconFg: string;
}

export interface ChartDataPoint {
  label: string;
  ca: number;
  ventes: number;
  formattedCa: string;
}

export interface StatusDistributionItem {
  label: string;
  count: number;
  pct: number;
  color: string;
}

export interface ZoneSalesItem {
  name: string;
  percentage: number;
  formattedPercentage: string;
}

export interface TopProductItem {
  rank: number;
  name: string;
  salesCount: string;
  caFormatted: string;
}

export interface CalendarDayItem {
  dayNumber: number | null;
  isToday: boolean;
  hasPostponed: boolean;
  postponedCount?: number;
  isPast: boolean;
}

export interface DashboardAnalytics {
  period: PeriodType;
  periodLabel: string;
  kpis: DashboardKpiItem[];
  chartData: ChartDataPoint[];
  statusDistribution: StatusDistributionItem[];
  conversionRate: string;
  zones: ZoneSalesItem[];
  topProducts: TopProductItem[];
  calendarDays: CalendarDayItem[];
}
