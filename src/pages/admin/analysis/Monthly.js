import React, { useContext, useEffect, useState } from "react";
import { AContext } from "../../../utils/AnalysisContext";
import { Context } from "../../../utils/MainContext";
import { Divider, Menu, Dropdown } from "antd";
import { CustomTable } from "../../../components/CustomTable";
import { useSelector } from "react-redux";
import Groupings from "../../../utils/hooks/Groupings";

export const Monthly = () => {
  const { allContributions } = useContext(Context);
  const { months } = useContext(AContext);

  const { budgets, years, groupedContributions, users } = useSelector(
    (state) => state.contribution
  );

  const [selectedYear, setSelectedYear] = useState();

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedContribution, setSelectedContribution] = useState("");
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    setSelectedYear(years[years?.length - 1]);
    setSelectedContribution(
      allContributions?.filter((item) => item?.category === "monthly")[0]?.id
    );
  }, [allContributions, years]);

  useEffect(() => {
    const getTotalUserContributions = () => {
      const currentYearContributions = groupedContributions[selectedYear];

      if (currentYearContributions) {
        const currentMonthContributions =
          currentYearContributions[selectedMonth];

        if (currentMonthContributions) {
          const contributionDetails = budgets[selectedContribution];
          if (contributionDetails?.category === "monthly") {
            // console.log(currentMonthContributions[cont]);

            const userTotals = currentMonthContributions[selectedContribution]
              ? Groupings.getUsersMonthlyTotal(
                  currentMonthContributions[selectedContribution]
                )
              : {};

            let tData = [];

            userTotals &&
              Object.keys(userTotals).forEach((user) => {
                const cDetails = {
                  amount: userTotals[user],
                  user: users[user]?.name,
                  budget: contributionDetails?.amount,
                  balance:
                    parseInt(userTotals[user]) -
                    parseInt(contributionDetails?.amount),
                };

                tData.push(cDetails);
              });

            setTableData(tData);
          }
        }
      }
    };

    getTotalUserContributions();
  }, [
    budgets,
    groupedContributions,
    selectedContribution,
    selectedMonth,
    selectedYear,
    users,
  ]);

  const columns = [
    {
      title: "Name",
      dataIndex: "user",
      key: "user",
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

  const menu = (
    <Menu>
      {allContributions.map(
        (item, i) =>
          item.category === "monthly" && (
            <Menu.Item key={i} onClick={() => setSelectedContribution(item.id)}>
              <span target="_blank" rel="noopener noreferrer">
                {item.name}
              </span>
            </Menu.Item>
          )
      )}
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
      <Divider className="font-medium">Monthly Budget Analysis</Divider>

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
            Select monthly contribution:
          </label>
          <Dropdown overlay={menu} placement="bottomLeft">
            <div
              className="h-8 bg-white border flex items-center px-3"
              style={{ width: "300px" }}
            >
              {budgets[selectedContribution]?.name}
            </div>
          </Dropdown>
        </div>

        <div className="">
          <label className="font-medium" htmlFor="type">
            Select month to view:
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
        summary={{
          cellTotal: true,
          title: "Total",
        }}
        cols={columns}
        rows={tableData && tableData}
        style
      />
    </>
  );
};
