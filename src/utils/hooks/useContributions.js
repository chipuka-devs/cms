import { useContext, useEffect, useState, useMemo } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { AContext } from "../AnalysisContext";
import { Context } from "../MainContext";
import cms from "../cms";

const useContributions = () => {
  const [state, setState] = useState({});
  const { yearBasedProjectContributions, monthlyBasedContributions } =
    useContext(AContext);
  const { allUsers, allContributions } = useContext(Context);

  useEffect(() => {
    fetchUserContributions();
    fetchAllContributions();
    fetchExpenditures();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    makeGroupings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.contributions, state?.userContributions]);

  // const data = useMemo(() => {
  //   return state
  // }, [])

  // useEffect(() => {
  //   console.log(state);
  // }, [state]);

  // function to fetch all contributions made by users
  function fetchUserContributions() {
    try {
      let arrOfConts = [];
      onSnapshot(collection(db, "user_contributions"), (docs) => {
        docs.forEach((d) => arrOfConts.push(d.data()));

        setState((prev) => ({ ...prev, userContributions: arrOfConts }));
      });
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  // function to fetch all created contributions
  function fetchAllContributions() {
    try {
      let arrOfConts = [];
      onSnapshot(collection(db, "contributions"), (docs) => {
        docs.forEach((d) => {
          arrOfConts.push({ ...d.data(), id: d.id });
        });

        setState((prev) => ({ ...prev, contributions: arrOfConts }));
      });
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  function fetchExpenditures() {
    try {
      let arrOfExp = [];
      onSnapshot(collection(db, "deductions"), (docs) =>
        docs.forEach((d) => arrOfExp.push(d.data()))
      );

      setState((prev) => ({ ...prev, expenditures: arrOfExp }));
    } catch (error) {
      console.log("Fetch Expenditure error:", error);
    }
  }

  // group state by date
  function makeGroupings() {
    const yearGroupings = cms.groupByYear(state?.userContributions);

    const monthlyGroupings = cms.groupMonths(state?.userContributions);
    console.log(monthlyGroupings);

    setState((prev) => ({ ...prev, yearGroupings }));
  }

  // calculate total contributions made
  function getTotalContributions() {
    const contributions = state?.userContributions;

    if (contributions && contributions?.length > 0) {
      const total = contributions
        ?.map((item) => item?.amount)
        ?.reduce((prev, next) => parseInt(prev) + parseInt(next));

      return total;
    } else {
      return 0;
    }
  }

  // calculate total budget
  function getTotalBudget() {
    const contributions = state?.contributions;

    let arr = [];
    contributions &&
      contributions.forEach((cont) => {
        const category = cont.category;
        if (category === "project") {
          arr.push({ amount: cont?.target });
        } else {
          arr.push({ amount: cont?.amount });
        }
      });

    const total =
      arr.length > 0
        ? arr
            .map((item) => item?.amount)
            .reduce((prev, next) => parseInt(prev) + parseInt(next))
        : 0;

    return total;
  }

  // calculate surplus/deficit
  const getSurplusDeficit = () => {
    // map contributions made
    const contArr = [];

    yearBasedProjectContributions &&
      Object.values(yearBasedProjectContributions)[0]?.forEach((c) => {
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

    return { total: surplus + deficit, surplus, deficit };
    // setTableData([
    //   { name: "Surplus", amount: surplus },
    //   { name: "Deficit", amount: deficit },
    // ]);
  };

  // monthly contributions, budget, surplus/deficit
  const monthlyGroupings = () => {
    const keys = Object.keys(monthlyBasedContributions);

    let monthlyGroupings = [];

    keys.forEach((key) => {
      const currentMonth = key;
      const currentMonthContributions = monthlyBasedContributions[key];

      // map current month contributions and get their budget
      const currentMonthBudgets = [];
      const currentMonthSurplusDefict = [];
      currentMonthContributions?.forEach((c) => {
        const { contribution } = c;
        if (contribution) {
          // filter contributions based on the contribution
          const currentContributionDetails = state?.contributions?.filter(
            (item) => item?.id === contribution
          )[0];

          // calculate current contribution surplus/deficit

          if (currentContributionDetails?.category === "project") {
            currentMonthBudgets.filter(
              (e) => e?.id === currentContributionDetails?.id
            ).length === 0 &&
              currentMonthBudgets.push({
                id: currentContributionDetails?.id,
                amount: currentContributionDetails?.target,
              });

            const sDeficit =
              parseInt(c?.amount) -
              parseInt(currentContributionDetails?.target);

            currentMonthSurplusDefict.push({ amount: sDeficit });
          } else {
            currentMonthBudgets.filter(
              (e) => e?.id === currentContributionDetails?.id
            ).length === 0 &&
              currentMonthBudgets.push({
                id: currentContributionDetails?.id,
                amount: currentContributionDetails?.amount,
              });

            const sDeficit =
              parseInt(c?.amount) -
              parseInt(currentContributionDetails?.amount);

            currentMonthSurplusDefict.push({ amount: sDeficit });
          }
        }
      });

      const totalBudget = currentMonthBudgets
        .map((item) => item?.amount)
        .reduce((prev, next) => parseInt(prev) + parseInt(next));

      const totalContributions = currentMonthContributions
        .map((item) => item?.amount)
        .reduce((prev, next) => parseInt(prev) + parseInt(next));

      const sDeficit = currentMonthSurplusDefict
        .map((item) => item?.amount)
        .reduce((prev, next) => parseInt(prev) + parseInt(next));

      monthlyGroupings.push({
        name: currentMonth,
        budget: totalBudget,
        total: totalContributions,
        surplus_deficit: sDeficit,
      });

      // budget: {
      //   ...monthlyGroupings?.budget,
      //   [currentMonth]: totalBudget,
      // },
      // };
    });

    return monthlyGroupings;
    // return monthlyBasedContributions;
  };

  const getTotalGroupedContributions = () => {
    const contsArr = [];

    const userContributionsGroupedByContributions =
      state.userContributions &&
      state?.userContributions?.reduce(function (r, a) {
        r[a.contribution] = r[a.contribution] || [];
        r[a.contribution].unshift(a);
        return r;
      }, Object.create(null));

    userContributionsGroupedByContributions &&
      Object.keys(userContributionsGroupedByContributions).forEach((k) => {
        // const id = k;
        const contributions = userContributionsGroupedByContributions[k];

        const totalContributionAmount = contributions
          ?.map((item) => item?.amount)
          .reduce((prev, next) => parseInt(parseInt(prev) + parseInt(next)));

        const item = state?.contributions?.filter((item) => item?.id === k)[0]
          ?.name;
        item &&
          contsArr.push({
            id: k,
            name: item,
            value: parseInt(totalContributionAmount),
          });
      });

    return contsArr;
  };

  const getGroupedExpenditures = () => {
    const dedsArr = [];
    // console.log(state.contributions);

    const deds = state?.expenditures?.reduce(function (r, a) {
      r[a.contribution] = r[a.contribution] || [];
      r[a.contribution].unshift(a);
      return r;
    }, Object.create(null));

    deds &&
      Object.keys(deds).forEach((k) => {
        // const id = k;
        const deductions = deds[k];

        const totalDeductionAmount = deductions
          ?.map((item) => item?.amount)
          .reduce((prev, next) => parseInt(parseInt(prev) + parseInt(next)));

        const item = state?.contributions?.filter((item) => item?.id === k)[0]
          ?.name;
        item &&
          dedsArr.push({
            id: k,
            name: item,
            value: parseInt(totalDeductionAmount),
          });
      });

    return dedsArr;
  };

  return {
    fetchUserContributions,
    state,
    getTotalContributions,
    getTotalBudget,
    getSurplusDeficit,
    monthlyGroupings,
    getTotalGroupedContributions,
    getGroupedExpenditures,
  };
};

export default useContributions;
