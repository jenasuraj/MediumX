"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ChartLegend, ChartLegendContent } from "@/components/ui/chart";

const chartData = [
    { month: "January", Ai: 390, Normal: 205 },
    { month: "February", Ai: 77, Normal: 247 },
    { month: "March", Ai: 306, Normal: 81 },
    { month: "April", Ai: 373, Normal: 178 },
    { month: "May", Ai: 87, Normal: 139 },
    { month: "June", Ai: 66, Normal: 232 },
    { month: "July", Ai: 76, Normal: 105 },
    { month: "August", Ai: 297, Normal: 201 },
    { month: "September", Ai: 70, Normal: 136 },
    { month: "October", Ai: 326, Normal: 228 },
    { month: "November", Ai: 158, Normal: 175 },
    { month: "December", Ai: 255, Normal: 136 }
  ];
  
const chartConfig = {
  Ai: {
    label: "Ai",
    color: "#000000",
  },
  Normal: {
    label: "Normal",
    color: "#A9A9A9",
  },
};

export default function ThirdPage() {
  return (
    <div className="flex justify-center items-center min-h-[70vh] ">
      <div className=" p-8 w-3/4 md:w-2/3 lg:w-1/2">
        <h2 className="text-3xl font-bold text-center  mb-10 text-gray-800">
          Monthly Data Usage
        </h2>
        <ChartContainer config={chartConfig} className="w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="Ai" fill="#000000" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Normal" fill="#A9A9A9" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
