import { Divider, Dropdown, Menu } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { CustomTable } from "../../../components/CustomTable";
import { AContext } from "../../../utils/AnalysisContext";
import { Context } from "../../../utils/MainContext";

export const MonthlySummary = () => {
  const { monthlyBasedContributions, months } = useContext(AContext);
  const { allUsers, allContributions } = useContext(Context);
  const [selectedMonth, setSelectedMonth] = useState(
    months[new Date().getMonth()]
  );
  const [tableData, setTableData] = useState();
  const [contributionNames, setContributionNames] = useState([]);

  useEffect(() => {
    let conts = [];

    allContributions?.forEach(
      (c) =>
        c.category === "monthly" && conts.push({ text: c.name, value: c.name })
    );
    setContributionNames(conts);
  }, [allContributions, allUsers]);

  const columns = [
    {
      title: "Name",
      dataIndex: "contribution",
      key: "contribution",
      filters: [...contributionNames],
      onFilter: (value, record) =>
        record?.contribution?.toLowerCase() === value?.toLowerCase(),
    },
    {
      title: "Amount",
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
              {balance?.toLocaleString()}
            </div>
          );
        } else if (balance < 0) {
          return (
            <div className="bg-red-200 m-0 w-24 text-center text-red-500 font-medium p-1">
              {balance?.toLocaleString()}
            </div>
          );
        } else {
          return (
            <div className="bg-blue-200 text-blue-600 m-0 w-24 text-center font-medium p-1">
              {balance?.toLocaleString()}
            </div>
          );
        }
      },
    },
  ];

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

      const tData = [];

      Object.entries(userContributionsGroupedByCont).forEach((c) => {
        const currentCont = allContributions.filter(
          (item) => item.name === c[0]
        )[0];

        if (currentCont && currentCont.category === "monthly") {
          const totalContributionAmount = c[1]
            .map((item) => item.amount)
            .reduce((prev, next) => parseInt(prev) + parseInt(next));

          const cDetails = {
            amount: totalContributionAmount,
            contribution: c[0],
            budget: currentCont.amount,
            balance:
              parseInt(totalContributionAmount) - parseInt(currentCont.amount),
          };

          tData.unshift(cDetails);
        }
      });
      setTableData(tData);
    };

    getTotalUserContributions();
  }, [allContributions, allUsers, monthlyBasedContributions, selectedMonth]);

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
    <>
      <Divider className="font-medium">Monthly Summary Analysis</Divider>

      <div className="flex items-end gap-1 w-full py-3 ">
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
