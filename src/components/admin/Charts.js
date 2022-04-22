import React, { memo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import useContributions from "../../utils/hooks/useContributions";

// const data = [
//   {
//     name: "March",
//     budget: 40000,
//     total: 24000,
//     surplus_deficit: 10400,
//   },
//   {
//     name: "April",
//     budget: 3000,
//     total: 20000,
//     surplus_deficit: 10400,
//   },
// ];

const Chart = () => {
  const { monthlyGroupings } = useContributions();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={monthlyGroupings()}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => value.toLocaleString()} />
        <Legend />
        <ReferenceLine y={0} stroke="#000" />
        <Bar dataKey="budget" fill="teal">
          <LabelList
            dataKey="budget"
            // content={(c) => c.amount}
            formatter={(value) => value.toLocaleString()}
            position="top"
            style={{ fill: "#00152990", fontWeight: "bold", fontSize: "15px" }}
          />
        </Bar>
        <Bar dataKey="total" fill="#1890FF">
          <LabelList
            dataKey="total"
            // content={(c) => c.amount}
            formatter={(value) => value.toLocaleString()}
            position="top"
            style={{ fill: "#00152990", fontWeight: "bold", fontSize: "15px" }}
          />
        </Bar>
        <Bar dataKey="surplus_deficit" fill="red">
          <LabelList
            dataKey="surplus_deficit"
            formatter={(value) => value.toLocaleString()}
            // content={(c) => c.amount}
            position="top"
            style={{ fill: "#00152990", fontWeight: "bold", fontSize: "15px" }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default memo(Chart);
