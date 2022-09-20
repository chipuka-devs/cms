import _ from "lodash";

const groupContributionsAnnualy = (list) => {
  const cList = list;
  const yearlyGroupings = _.mapValues(_.groupBy(cList, "year"));

  return yearlyGroupings;
};

const getMonthlyTotalBalance = (list) => {
  const cList = list;
  const yearlyGroupings = _.mapValues(_.groupBy(cList, "year"));

  Object.keys(yearlyGroupings).forEach((year) => {
    const monthlyGroupings = _.mapValues(
      _.groupBy(yearlyGroupings[year], "month")
    );
    Object.keys(monthlyGroupings).forEach((month) => {
      const currentMonthGroupings = _.mapValues(
        _.groupBy(monthlyGroupings[month], "contribution")
      );
      Object.keys(currentMonthGroupings).forEach((cont) => {
        // currentMonthGroupings[cont] = _.mapValues(
        //   _.groupBy(currentMonthGroupings[cont], "user")
        // );

        currentMonthGroupings[cont] = getClosingBalance(
          currentMonthGroupings[cont]
        );
      });
      monthlyGroupings[month] = currentMonthGroupings;
    });

    yearlyGroupings[year] = monthlyGroupings;
  });

  return yearlyGroupings;
};

function getContributionOpeningBalance(list, month, contribution) {
  let total = 0;

  Object.keys(list).forEach((mnth) => {
    if (parseInt(mnth) < parseInt(month)) {
      total += parseInt(list[mnth][contribution]) || 0;
    }
  });

  return total;
}

function getUsersMonthlyTotal(list) {
  let conts = {};

  Object.keys(list).forEach((user) => {
    const total = _.sumBy(list[user], (contrib) => parseInt(contrib?.amount));

    conts[user] = total;
  });

  return conts;
}

function getClosingBalance(list) {
  const total = _.sumBy(list, (contrib) => parseInt(contrib?.amount));

  return total;
}

function getObjectValueTotals(object) {
  let newObject = {};
  Object?.values(object)?.forEach((obj, index) => {
    newObject[index] = _.sum(Object?.values(obj));
  });

  return newObject;
}

const Groupings = {
  groupContributionsAnnualy,
  getClosingBalance,
  getMonthlyTotalBalance,
  getContributionOpeningBalance,
  getUsersMonthlyTotal,
  getObjectValueTotals,
};

export default Groupings;
