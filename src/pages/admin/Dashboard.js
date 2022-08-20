import { Dropdown, Menu } from "antd";
import React from "react";
import Chart from "../../components/admin/Charts";
import PiChart from "../../components/admin/PieChart";
import useContributions from "../../utils/hooks/useContributions";
import { DownOutlined } from "@ant-design/icons";

export const Dashboard = () => {
  const {
    getTotalContributions,
    getSurplusDeficit,
    getTotalBudget,
    getTotalGroupedContributions,
    state,
  } = useContributions();

  // const state = getTotalGroupedContributions();
  const [selected, setSelected] = React.useState({
    year: "",
  });

  React.useEffect(() => {
    if (state?.yearGroupings) {
      const years = Object.keys(state?.yearGroupings);
      setSelected((prev) => ({
        ...prev,
        year: years[years.length - 1],
      }));
    }
  }, [state?.yearGroupings]);

  const menu = (
    <Menu
      onClick={(e) => setSelected((prev) => ({ ...prev, year: e.key }))}
      items={Object.keys(state?.yearGroupings || [])?.map((y) => ({
        label: y,
        key: y,
        // icon: <UserOutlined />,
      }))}
    />
  );

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
      <div className="flex">
        <div>
          selected year:
          <br />
          <Dropdown.Button
            // className="w-[300px]"
            icon={<DownOutlined />}
            overlay={menu}
          >
            {selected?.year}
          </Dropdown.Button>
        </div>
      </div>
      {/* charts */}
      <div>
        <div className="py-4 flex gap-2">
          <div className="w-7/12 rounded-lg bg-white p-2 min-h-[500px]">
            <Chart />
          </div>
          <div className="w-5/12 rounded-lg bg-white p-2">
            {/* <PiChart state={state} colors={colors} /> */}
          </div>
        </div>
        <h3 className="text-lg text-center font-medium">
          Actual vs Budget Overview bar chart And The contribution mix pie chart{" "}
        </h3>
      </div>
    </>
  );
};

const Card = ({ children }) => (
  <div className="h-32 flex flex-col items-center justify-center gap-2 text-slate-50">
    {children}
  </div>
);
