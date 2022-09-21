import { Divider, Dropdown, Menu } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CustomTable } from "../../../components/CustomTable";
import { AContext } from "../../../utils/AnalysisContext";
import Groupings from "../../../utils/hooks/Groupings";

export const Project = () => {
  const { months } = useContext(AContext);

  const {
    contributions: cList,
    budgets,
    years,
  } = useSelector((state) => state.contribution);

  const [selectedYear, setSelectedYear] = useState(years[years?.length - 1]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [tableData, setTableData] = useState();

  useEffect(() => {
    const getTotalUserContributions = () => {
      const currentYearContributions =
        Groupings.getMonthlyTotalBalance(cList)[selectedYear];

      if (currentYearContributions) {
        const currentMonthContributions =
          currentYearContributions[selectedMonth] || [];

        let tData = [];

        Object.keys(currentMonthContributions).forEach((cont) => {
          const contributionDetails = budgets[cont];
          if (contributionDetails?.category === "project") {
            const openingBalance = Groupings.getContributionOpeningBalance(
              currentYearContributions,
              selectedMonth,
              cont
            );

            const cDetails = {
              amount: currentMonthContributions[cont],
              contribution: contributionDetails?.name,
              budget: contributionDetails?.target,
              opening_balance: openingBalance,
              balance:
                parseInt(currentMonthContributions[cont]) -
                parseInt(contributionDetails?.target),
            };

            tData.push(cDetails);
          }
        });

        setTableData(tData);
      }
    };

    getTotalUserContributions();
  }, [budgets, cList, selectedMonth, selectedYear]);

  const columns = [
    {
      title: "Name",
      dataIndex: "contribution",
      key: "contribution",
    },
    {
      title: "Actual Amount",
      dataIndex: "amount",
      key: "amount",
      render: (_, item) => parseInt(item?.amount).toLocaleString(),
    },
    {
      title: "Budget",
      dataIndex: "budget",
      key: "budget",
      render: (_, item) => parseInt(item?.budget).toLocaleString(),
    },

    {
      title: "Surplus/Deficit",
      dataIndex: "balance",
      key: "balance",
      render: (_, { balance }) => {
        if (balance > 0) {
          return (
            <div className="bg-green-200 m-0 w-24 text-green-500 font-medium text-center p-1">
              {balance.toLocaleString()}
            </div>
          );
        } else if (balance < 0) {
          return (
            <div className="bg-red-200 m-0 w-24 text-center text-red-500 font-medium p-1">
              {balance.toLocaleString()}
            </div>
          );
        } else {
          return (
            <div className="bg-blue-200 text-blue-600 m-0 w-24 text-center font-medium p-1">
              {balance.toLocaleString()}
            </div>
          );
        }
      },
    },
  ];

  const menu_years = (
    <Menu>
      {years.map((item, i) => (
        <Menu.Item key={i} onClick={() => setSelectedYear(item)}>
          <span target="_blank" rel="noopener noreferrer">
            {item}
          </span>
        </Menu.Item>
      ))}
    </Menu>
  );

  const menu_months = (
    <Menu>
      {months.map((item, i) => (
        <Menu.Item key={i} onClick={() => setSelectedMonth(i)}>
          <span target="_blank" rel="noopener noreferrer">
            {item}
          </span>
        </Menu.Item>
      ))}
    </Menu>
  );
  return (
    <>
      <Divider className="font-medium">Project Budget Analysis</Divider>

      <div className="flex items-end gap-1 w-full py-3 ">
        <div className="">
          <label className="font-medium" htmlFor="type">
            Select year to view:
          </label>
          <Dropdown overlay={menu_years} placement="bottomLeft">
            <div
              className="h-8 bg-white border flex items-center px-3"
              style={{ width: "300px" }}
            >
              {selectedYear}
            </div>
          </Dropdown>
        </div>

        <div className="">
          <label className="font-medium" htmlFor="type">
            Select month:
          </label>
          <Dropdown overlay={menu_months} placement="bottomLeft">
            <div
              className="h-8 bg-white border flex items-center px-3"
              style={{ width: "300px" }}
            >
              {months[selectedMonth]}
            </div>
          </Dropdown>
        </div>
      </div>

      <CustomTable
        cols={columns}
        rows={tableData && tableData}
        summary={{
          cellTotal: true,
          title: "Total",
        }}
      />
    </>
  );
};
