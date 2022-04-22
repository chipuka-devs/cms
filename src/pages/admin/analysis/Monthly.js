import React, { useContext, useEffect, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { AContext } from "../../../utils/AnalysisContext";
import { Context } from "../../../utils/MainContext";
import { Divider, Menu, Dropdown } from "antd";
import { CustomTable } from "../../../components/CustomTable";

export const Monthly = () => {
  const { allUsers, allContributions } = useContext(Context);
  const { monthlyBasedContributions, months } = useContext(AContext);
  const [selectedMonth, setSelectedMonth] = useState("March");
  const [selectedContribution, setSelectedContribution] = useState("Breakfast");
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const getTotalUserContributions = () => {
      const contArr = [];

      monthlyBasedContributions &&
        monthlyBasedContributions[selectedMonth] &&
        monthlyBasedContributions[selectedMonth].forEach((c) => {
          const currentUser = allUsers.filter((item) => item.uid === c.user)[0];
          const currentContribution = allContributions.filter(
            (item) => item.id === c.contribution
          )[0];

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

      const currentSelectedContribution =
        userContributionsGroupedByCont[selectedContribution];

      const currentSelectedContributionByUser =
        currentSelectedContribution &&
        Object.entries(
          currentSelectedContribution.reduce(function (r, a) {
            r[a.user] = r[a.user] || [];
            r[a.user].unshift(a);
            return r;
          }, Object.create(null))
        );
      // currentSelectedContributionByUser.forEach((c) => console.log(c));
      const tData = [];
      currentSelectedContributionByUser &&
        currentSelectedContributionByUser.forEach((c) => {
          const userTotalAmount = c[1]
            .map((item) => item.amount)
            .reduce((prev, next) => parseInt(prev) + parseInt(next));

          const currentCont = allContributions.filter(
            (item) => item && item.name === selectedContribution
          )[0];

          const cDetails = {
            amount: userTotalAmount,
            user: c[0],
            budget: currentCont && currentCont.amount,
            balance:
              parseInt(userTotalAmount) -
              parseInt(currentCont && currentCont.amount),
          };
          tData.unshift(cDetails);
        });
      setTableData(tData);
    };

    getTotalUserContributions();
  }, [
    allContributions,
    allUsers,
    monthlyBasedContributions,
    selectedContribution,
    selectedMonth,
  ]);

  const columns = [
    {
      title: "Name",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
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
              {balance}
            </div>
          );
        } else if (balance < 0) {
          return (
            <div className="bg-red-200 m-0 w-24 text-center text-red-500 font-medium p-1">
              {balance}
            </div>
          );
        } else {
          return (
            <div className="bg-blue-200 text-blue-600 m-0 w-24 text-center font-medium p-1">
              {balance}
            </div>
          );
        }
      },
    },
  ];

  const menu = (
    <Menu>
      {allContributions.map(
        (item, i) =>
          item.category === "monthly" && (
            <Menu.Item
              key={i}
              onClick={() => setSelectedContribution(item.name)}
            >
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
        <Menu.Item key={i} onClick={() => setSelectedMonth(item)}>
          <span target="_blank" rel="noopener noreferrer">
            {item}
          </span>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <AdminLayout current="2" breadcrumbs={["Admin", "analysis", "monthly"]}>
      <Divider className="font-medium">Monthly Budget Analysis</Divider>

      <div className="flex items-end gap-1 w-full py-3 ">
        <div className="">
          <label className="font-medium" htmlFor="type">
            Select monthly contribution:
          </label>
          <Dropdown overlay={menu} placement="bottomLeft">
            <div
              className="h-8 bg-white border flex items-center px-3"
              style={{ width: "300px" }}
            >
              {selectedContribution.name
                ? selectedContribution.name
                : selectedContribution}
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
              {selectedMonth}
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
    </AdminLayout>
  );
};
