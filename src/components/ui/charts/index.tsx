
import React from "react";
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  RadarChart as RechartsRadarChart,
  Bar,
  Line,
  Pie,
  Radar as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ReferenceLine,
} from "recharts";
import { ChartContainer, ChartTooltipContent, ChartLegendContent } from "@/components/ui/chart";

type ChartProps = {
  data: {
    labels: string[];
    datasets: Array<{
      label?: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string;
      pointBackgroundColor?: string;
      tension?: number;
      fill?: boolean;
      yAxisID?: string;
    }>;
  };
  height?: number;
  showLegend?: boolean;
  options?: any;
};

export const BarChart = ({
  data,
  height = 300,
  showLegend = true,
  options,
}: ChartProps) => {
  const mappedData = data.labels.map((label, index) => {
    const obj: Record<string, any> = { name: label };
    data.datasets.forEach((dataset, i) => {
      obj[dataset.label || `Dataset ${i + 1}`] = dataset.data[index];
    });
    return obj;
  });

  const config = data.datasets.reduce((acc, dataset, index) => {
    const colors = Array.isArray(dataset.backgroundColor)
      ? dataset.backgroundColor
      : [dataset.backgroundColor || `hsl(${index * 50}, 70%, 50%)`];
    
    acc[dataset.label || `Dataset ${index + 1}`] = {
      label: dataset.label,
      color: colors[0],
    };
    
    return acc;
  }, {} as Record<string, any>);

  return (
    <ChartContainer config={config} className="w-full" style={{ height: height }}>
      <RechartsBarChart data={mappedData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" {...(options?.scales?.x || {})} />
        <YAxis dataKey="name" type="category" {...(options?.scales?.y || {})} />
        <Tooltip content={<ChartTooltipContent />} />
        {showLegend && <Legend content={<ChartLegendContent />} />}
        
        {data.datasets.map((dataset, index) => (
          <Bar
            key={index}
            dataKey={dataset.label || `Dataset ${index + 1}`}
            fill={
              Array.isArray(dataset.backgroundColor)
                ? dataset.backgroundColor[0]
                : dataset.backgroundColor || `hsl(${index * 50}, 70%, 50%)`
            }
          >
            {Array.isArray(dataset.backgroundColor) &&
              data.labels.map((_, i) => (
                <Cell
                  key={`cell-${i}`}
                  fill={dataset.backgroundColor[i % dataset.backgroundColor.length]}
                />
              ))}
          </Bar>
        ))}
      </RechartsBarChart>
    </ChartContainer>
  );
};

export const LineChart = ({
  data,
  height = 300,
  showLegend = true,
  options,
}: ChartProps) => {
  const mappedData = data.labels.map((label, index) => {
    const obj: Record<string, any> = { name: label };
    data.datasets.forEach((dataset, i) => {
      obj[dataset.label || `Dataset ${i + 1}`] = dataset.data[index];
    });
    return obj;
  });

  const config = data.datasets.reduce((acc, dataset, index) => {
    acc[dataset.label || `Dataset ${index + 1}`] = {
      label: dataset.label,
      color: dataset.borderColor || `hsl(${index * 50}, 70%, 50%)`,
    };
    return acc;
  }, {} as Record<string, any>);

  return (
    <ChartContainer config={config} className="w-full" style={{ height: height }}>
      <RechartsLineChart data={mappedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" {...(options?.scales?.x || {})} />
        {data.datasets.map((dataset, index) => (
          <YAxis
            key={`yAxis-${index}`}
            {...(dataset.yAxisID
              ? { yAxisId: dataset.yAxisID, ...(options?.scales?.[dataset.yAxisID] || {}) }
              : { ...(options?.scales?.y || {}) })}
          />
        ))}
        <Tooltip content={<ChartTooltipContent />} />
        {showLegend && <Legend content={<ChartLegendContent />} />}
        
        {data.datasets.map((dataset, index) => (
          <Line
            key={index}
            type="monotone"
            dataKey={dataset.label || `Dataset ${index + 1}`}
            stroke={dataset.borderColor || `hsl(${index * 50}, 70%, 50%)`}
            fill={dataset.fill ? dataset.backgroundColor || `rgba(${index * 50}, 70%, 50%, 0.1)` : undefined}
            dot={{ stroke: dataset.pointBackgroundColor || dataset.borderColor || `hsl(${index * 50}, 70%, 50%)` }}
            yAxisId={dataset.yAxisID || undefined}
            activeDot={{ r: 8 }}
            {...(dataset.tension ? { curve: "natural" } : {})}
          />
        ))}
      </RechartsLineChart>
    </ChartContainer>
  );
};

export const PieChart = ({
  data,
  height = 300,
  showLegend = true,
}: ChartProps) => {
  // For pie charts, we need a different data structure
  const mappedData = data.datasets[0].data.map((value, index) => ({
    name: data.labels[index],
    value,
  }));

  const colors = data.datasets[0].backgroundColor || 
    data.labels.map((_, i) => `hsl(${i * 50}, 70%, 50%)`);

  const config = data.labels.reduce((acc, label, index) => {
    acc[label] = {
      label,
      color: Array.isArray(colors) ? colors[index % colors.length] : colors,
    };
    return acc;
  }, {} as Record<string, any>);

  return (
    <ChartContainer config={config} className="w-full" style={{ height: height }}>
      <RechartsPieChart>
        <Tooltip content={<ChartTooltipContent />} />
        {showLegend && <Legend content={<ChartLegendContent />} />}
        <Pie
          data={mappedData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {mappedData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={Array.isArray(colors) ? colors[index % colors.length] : colors}
            />
          ))}
        </Pie>
      </RechartsPieChart>
    </ChartContainer>
  );
};

export const Radar = ({
  data,
  height = 300,
  showLegend = true,
}: ChartProps) => {
  const mappedData = data.labels.map((label, index) => {
    const obj: Record<string, any> = { name: label };
    data.datasets.forEach((dataset, i) => {
      obj[dataset.label || `Dataset ${i + 1}`] = dataset.data[index];
    });
    return obj;
  });

  const config = data.datasets.reduce((acc, dataset, index) => {
    acc[dataset.label || `Dataset ${index + 1}`] = {
      label: dataset.label,
      color: dataset.borderColor || `hsl(${index * 50}, 70%, 50%)`,
    };
    return acc;
  }, {} as Record<string, any>);

  return (
    <ChartContainer config={config} className="w-full" style={{ height: height }}>
      <RechartsRadarChart data={mappedData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="name" />
        <PolarRadiusAxis />
        <Tooltip content={<ChartTooltipContent />} />
        {showLegend && <Legend content={<ChartLegendContent />} />}
        
        {data.datasets.map((dataset, index) => (
          <RechartsRadar
            key={index}
            name={dataset.label || `Dataset ${index + 1}`}
            dataKey={dataset.label || `Dataset ${index + 1}`}
            stroke={dataset.borderColor || `hsl(${index * 50}, 70%, 50%)`}
            fill={dataset.backgroundColor || `rgba(${index * 50}, 70%, 50%, 0.2)`}
            fillOpacity={0.6}
          />
        ))}
      </RechartsRadarChart>
    </ChartContainer>
  );
};
