import { Divider, Dropdown, Menu } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { CustomTable } from "../../../components/CustomTable";
import { AContext } from "../../../utils/AnalysisContext";
import { Context } from "../../../utils/MainContext";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Bar } from "react-chartjs-2";

export const NetBalance = () => {
  const { yearBasedProjectContributions, years } = useContext(AContext);
  const { allUsers, allContributions } = useContext(Context);
  const [selectedYear, setSelectedMonth] = useState([new Date().getFullYear()]);
  const [tableData, setTableData] = useState([{ surplus: 0 }, { deficit: 0 }]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (_, { amount }) => {
        if (amount < 0) {
          return (
            <div className="bg-red-200 m-0 w-24 text-center text-red-500 font-medium p-1">
              {amount?.toLocaleString()}
            </div>
          );
        } else {
          return (
            <div className="bg-green-200 m-0 w-24 text-center text-green-500 font-medium p-1">
              {amount?.toLocaleString()}
            </div>
          );
        }
      },
    },
  ];

  useEffect(() => {
    const getTotalUserContributions = () => {
      const contArr = [];

      yearBasedProjectContributions &&
        yearBasedProjectContributions[selectedYear] &&
        yearBasedProjectContributions[selectedYear].forEach((c) => {
          const currentUser = allUsers.filter((item) => item.uid === c.user)[0];
          const currentContribution = allContributions.filter(
            (item) => item.id === c.contribution
          )[0];

          currentContribution &&
            contArr.unshift({
              ...c,
              contribution: currentContribution && currentContribution.name,
              user: currentUser && currentUser.name,
            });
        });

      const userContributionsGroupedByCont =
        contArr &&
        contArr.reduce(function (r, a) {
          r[a.contribution] = r[a.contribution] || [];
          r[a.contribution].unshift(a);
          return r;
        }, Object.create(null));

      let surplus = 0;
      let deficit = 0;

      Object.entries(userContributionsGroupedByCont).forEach((c) => {
        const currentCont = allContributions.filter(
          (item) => item.name === c[0]
        )[0];

        if (currentCont && currentCont.category === "project") {
          const totalContributionAmount = c[1]
            .map((item) => item.amount)
            .reduce((prev, next) => parseInt(prev) + parseInt(next));

          //   console.log(currentCont);
          const balance =
            parseInt(totalContributionAmount) - parseInt(currentCont.target);

          balance < 0 ? (deficit += balance) : (surplus += balance);

          //   tData.push(cDetails);
        } else {
          const totalContributionAmount = c[1]
            .map((item) => item.amount)
            .reduce((prev, next) => parseInt(prev) + parseInt(next));

          const balance =
            parseInt(totalContributionAmount) - parseInt(currentCont.amount);

          balance < 0 ? (deficit += balance) : (surplus += balance);
        }
      });
      setTableData([
        { name: "Surplus", amount: surplus },
        { name: "Deficit", amount: deficit },
      ]);
    };

    getTotalUserContributions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allContributions, allUsers, yearBasedProjectContributions, selectedYear]);

  const menu_months = (
    <Menu>
      {years.map((item, i) => (
        <Menu.Item key={i} onClick={() => setSelectedMonth(item)}>
          <span target="_blank" rel="noopener noreferrer">
            {item}
          </span>
        </Menu.Item>
      ))}
    </Menu>
  );
  return (
    <>
      <Divider className="font-medium">NetBalance</Divider>

      <div className="flex items-end gap-1 w-full py-3 ">
        <div className="">
          <label className="font-medium" htmlFor="type">
            Select Year to view:
          </label>
          <Dropdown overlay={menu_months} placement="bottomLeft">
            <div
              className="h-8 bg-white border flex items-center px-3"
              style={{ width: "300px" }}
            >
              {selectedYear}
            </div>
          </Dropdown>
        </div>
      </div>

      <CustomTable cols={columns} rows={tableData} />
    </>
  );
};

// export const options = {
//   plugins: {
//     title: {
//       display: true,
//       text: "Net Balance Chart:",
//     },
//   },
//   responsive: true,
//   interaction: {
//     mode: "index",
//     intersect: false,
//   },
//   scales: {
//     x: {
//       stacked: true,
//     },
//     y: {
//       stacked: true,
//     },
//   },
// };

// const Chart = ({ d }) => {
//   ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     BarElement,
//     Title,
//     Tooltip,
//     Legend
//   );

//   const labels = ["Type"];

//   const data = {
//     labels,
//     datasets: [
//       {
//         label: "Surplus",
//         data: { Type: d[0]?.amount },
//         backgroundColor: "rgb(34,197,142)",
//         stack: "Stack 0",
//       },
//       {
//         label: "Deficit",
//         data: { Type: d[1]?.amount },
//         backgroundColor: "rgb(254,202,202)",
//         stack: "Stack 0",
//       },
//     ],
//   };

//   return <Bar options={options} data={data} />;
// };
