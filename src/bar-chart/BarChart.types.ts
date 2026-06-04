export type BarChartDatum = {
  label: string;
  value: number;
};

export type BarChartProps = {
  data: BarChartDatum[];
  width?: number;
  height?: number;
  ariaLabel?: string;
};
