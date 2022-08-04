import React from "react";
import Chart from "../../components/admin/Charts";
import PiChart from "../../components/admin/PieChart";
import useContributions from "../../utils/hooks/useContributions";

export const Dashboard = () => {
  const {
    getTotalContributions,
    getSurplusDeficit,
    getTotalBudget,
    getTotalGroupedContributions,
  } = useContributions();

  const state = getTotalGroupedContributions();

  const colors = [
    "#FFAF00",
    "#FF7300",
    "#FF0000",
    "#26D7AE",
    "#2DCB75",
    "#E01E84",
    "#C758D0",
    "#8E6CEF",
    "#8399EB",
    "#FFEC00",
    "#007ED6",
    "#97D9FF",
    "#5FB7D4",
    "#7CDDDD",
    "#1BAA2F",
    "#D5F30B",
  ];

  return (
    <>
      <div
        className=" grid grid-cols-3 justify-between gap-5 p-2 rounded-sm text-white"
        style={{
          backgroundImage: "linear-gradient(180deg,#001529,#1890FF)",
        }}
      >
        {/* Total Contributions */}
        <Card>
          <span className="font-extrabold text-lg">Total Contributions</span>

          <span className="text-2xl font-bold text-center">
            {getTotalContributions()?.toLocaleString()}
            <span className="text-sm pl-1">kshs</span>
          </span>
        </Card>
        {/* Total Deductions */}
        <Card>
          <span className="font-extrabold text-lg ">Budget</span>

          <span className="text-2xl font-bold text-center">
            {getTotalBudget()?.toLocaleString()}
            <span className="text-sm pl-1">kshs</span>
          </span>
        </Card>
        {/* Grand Total */}
        <Card>
          <span className="font-extrabold text-lg">Surplus/Deficit</span>

          <span className="text-2xl font-bold text-center">
            {getSurplusDeficit()?.total?.toLocaleString()}
            <span className="text-sm pl-1">kshs</span>
          </span>
        </Card>
      </div>

      {/* charts */}
      <div className="py-4 flex gap-2">
        <div className="w-7/12 rounded-lg bg-white p-2 min-h-[500px]">
          <h3>Actual vs Budget Overview</h3>
          <Chart />
        </div>
        <div className="w-5/12 rounded-lg bg-white p-2">
        <h3> Contribution Mix </h3>
          <PiChart state={state} colors={colors} />
        </div>
      </div>
    </>
  );
};

const Card = ({ children }) => (
  <div className="h-32 flex flex-col items-center justify-center gap-2 text-slate-50">
    {children}
  </div>
);
