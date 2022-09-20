import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import Groupings from "../../../utils/hooks/Groupings";
import _ from "lodash";
import { useCallback } from "react";
import { Dropdown, Menu } from "antd";
import { AContext } from "../../../utils/AnalysisContext";

const Net = () => {
  const { contributions, groupedExpenditures } = useSelector(
    (state) => state.contribution
  );
  const { months } = useContext(AContext);

  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [currentYearExpList, setCurrentYearExpList] = useState([]);
  // const [monthTotals, setMonthTotals] = useState([]);
  //   const [yearTotals, setYearTotals] = useState([]);
  const [state, setState] = useState({
    opening_balance: 0,
    closing_balance: 0,
    expenditure: 0,
  });

  const [monthlyState, setMonthlyState] = useState({
    opening_balance: 0,
    closing_balance: 0,
    expenditure: 0,
  });

  // <Contributions>
  React.useEffect(() => {
    const monthlyTotals = Groupings.getMonthlyTotalBalance(contributions);
    //   if
    setYears(Object.keys(monthlyTotals));
    setSelectedYear(
      Object.keys(monthlyTotals)[Object.keys(monthlyTotals).length - 1]
    );
  }, [contributions]);

  const getCurrentYearMonthTotals = useCallback(() => {
    const monthlyTotals = Groupings.getMonthlyTotalBalance(contributions);

    const currentYearTotals = monthlyTotals[selectedYear];
    const monthTotals = currentYearTotals
      ? Groupings.getObjectValueTotals(currentYearTotals)
      : {};

    const yearTotals = _.sum(Object.values(monthTotals));

    setState((prev) => ({ ...prev, closing_balance: yearTotals }));
  }, [contributions, selectedYear]);

  const getPreviousYearTotalContributions = useCallback(() => {
    const monthlyTotals = Groupings.getMonthlyTotalBalance(contributions);

    //   const previousYear = years.filter(year=>year===selectedYear)

    const currentYearTotals =
      monthlyTotals[years[years.indexOf(selectedYear) - 1]] || 0;
    //   const monthTotals = Groupings.getObjectValueTotals(currentYearTotals);
    const monthTotals = currentYearTotals
      ? Groupings.getObjectValueTotals(currentYearTotals)
      : {};

    const yearTotals = _.sum(Object.values(monthTotals));

    setState((prev) => ({ ...prev, opening_balance: yearTotals }));
  }, [contributions, years, selectedYear]);

  React.useEffect(() => {
    getCurrentYearMonthTotals();
    getPreviousYearTotalContributions();
  }, [getCurrentYearMonthTotals, getPreviousYearTotalContributions]);
  // </contributions>

  React.useEffect(() => {
    const monthlyExpenditureTotals = groupedExpenditures;
    const currentYearTotals = monthlyExpenditureTotals[selectedYear];
    setCurrentYearExpList(currentYearTotals);

    if (currentYearTotals) {
      const yearTotals = _.sum(Object.values(currentYearTotals));

      setState((prev) => ({ ...prev, expenditure: yearTotals }));
    } else {
      setState((prev) => ({ ...prev, expenditure: 0 }));
    }
  }, [groupedExpenditures, selectedYear]);

  React.useEffect(() => {
    const monthlyTotals = Groupings.getMonthlyTotalBalance(contributions);
    const currentYearTotals = monthlyTotals[selectedYear];

    if (currentYearTotals) {
      const monthTotals = currentYearTotals
        ? Groupings.getObjectValueTotals(currentYearTotals)
        : {};
      const currentMonthContributionOpeningBalance =
        _.sum(Object.values(monthTotals).slice(0, selectedMonth)) +
        state?.opening_balance;

      const currentMonthExpenditureOpeningBalance = currentYearExpList
        ? _.sum(Object.values(currentYearExpList).slice(0, selectedMonth))
        : 0;

      const currentMonthOpeningBalance =
        currentMonthContributionOpeningBalance -
        currentMonthExpenditureOpeningBalance;
      const currentMonthContributions =
        Object.values(monthTotals)[selectedMonth];
      const currentMonthExpenditures = currentYearExpList
        ? Object.values(currentYearExpList)[selectedMonth]
        : 0;

      setMonthlyState({
        opening_balance: currentMonthOpeningBalance,
        closing_balance: currentMonthContributions,
        expenditure: currentMonthExpenditures,
      });
    }
  }, [
    state.opening_balance,
    selectedYear,
    contributions,
    selectedMonth,
    currentYearExpList,
  ]);

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
  const month_years = (
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
      {/* <pre>{JSON.stringify(groupedContributions)}</pre> */}

      <div className="w-8/12 bg-white m-3 p-5 ">
        {/* header */}
        <div className="py-3">
          <div className="flex justify-center p-4">
            <span className="text-2xl font-bold uppercase text-gray-700">
              Annual Balance
            </span>
          </div>

          <Dropdown overlay={menu_years} placement="bottomLeft">
            <div
              className="h-8 bg-white border flex items-center px-3"
              style={{ width: "300px" }}
            >
              {selectedYear}
            </div>
          </Dropdown>
        </div>

        {/* table */}
        <table className="w-full">
          {/* <pre>{JSON.stringify(stmt)}</pre> */}
          <tbody>
            <tr className=" w-full text-base text-black font-medium">
              <td className="border-black border-[1px] p-2 w-6/12">
                {"Opening Balance"}
              </td>
              <td className="border-black border-[1px] p-2 ">
                {state?.opening_balance}
              </td>
            </tr>
            <tr className=" w-full text-base text-black font-medium">
              <td className="border-black border-[1px] p-2 w-6/12">
                {"Receipts"}
              </td>
              <td className="border-black border-[1px] p-2 ">
                {state?.closing_balance}
              </td>
            </tr>
            <tr className=" w-full text-base text-black font-medium">
              <td className="border-black border-[1px] p-2 w-6/12">
                {"Expenditure"}
              </td>
              <td className="border-black border-[1px] p-2 ">
                {state?.expenditure}
              </td>
            </tr>
            {/* })} */}
          </tbody>

          <tfoot>
            <tr className="font-medium text-base">
              <td className="border-gray-100 font-bold border-[1px] p-2 text-white bg-[#002140]">
                TOTAL
              </td>
              <td className=" border-gray-100 text-white  bg-[#002140]  p-2 ">
                {state?.opening_balance +
                  state?.closing_balance -
                  state?.expenditure}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="w-8/12 bg-white m-3 p-5 ">
        {/* header */}
        <div className="py-3">
          <div className="flex justify-center p-4">
            <span className="text-2xl font-bold uppercase text-gray-700">
              Monthly Balance
            </span>
          </div>

          <Dropdown overlay={month_years} placement="bottomLeft">
            <div
              className="h-8 bg-white border flex items-center px-3"
              style={{ width: "300px" }}
            >
              {months[selectedMonth]}
            </div>
          </Dropdown>
        </div>

        {/* table */}
        <table className="w-full">
          {/* <pre>{JSON.stringify(stmt)}</pre> */}
          <tbody>
            <tr className=" w-full text-base text-black font-medium">
              <td className="border-black border-[1px] p-2 w-6/12">
                {"Opening Balance"}
              </td>
              <td className="border-black border-[1px] p-2 ">
                {monthlyState?.opening_balance}
              </td>
            </tr>
            <tr className=" w-full text-base text-black font-medium">
              <td className="border-black border-[1px] p-2 w-6/12">
                {"Receipts"}
              </td>
              <td className="border-black border-[1px] p-2 ">
                {monthlyState?.closing_balance}
              </td>
            </tr>
            <tr className=" w-full text-base text-black font-medium">
              <td className="border-black border-[1px] p-2 w-6/12">
                {"Expenditure"}
              </td>
              <td className="border-black border-[1px] p-2 ">
                {monthlyState?.expenditure}
              </td>
            </tr>
            {/* })} */}
          </tbody>

          <tfoot>
            <tr className="font-medium text-base">
              <td className="border-gray-100 font-bold border-[1px] p-2 text-white bg-[#002140]">
                TOTAL
              </td>
              <td className=" border-gray-100 text-white  bg-[#002140]  p-2 ">
                {monthlyState?.opening_balance +
                  monthlyState?.closing_balance -
                  monthlyState?.expenditure}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
};

export default Net;
