import * as _ from "lodash/collection";
import * as _a from "lodash/array";

const viewData = async () => {
  fetch("http://localhost:8000/data")
    .then((response) => response.json())
    .then((data) => {
      let newArr = [];

      data?.forEach((d) => {
        let item = { ...d, Date: new Date(d.Date).toISOString() };

        newArr.push(item);
      });

      const groupedByYear = groupByYear(newArr);

      Object.entries(groupedByYear).forEach((year) => {
        const months = year[1];
        const monthGrouping = groupMonths(months);

        let currentYearMonths = [];

        Object.entries(monthGrouping).forEach((month) => {
          // total monthly amount
          const total = getTotalAmount(month[1]);

          currentYearMonths.push({
            month: month[0],
            data: month[1],
            totalContributions: total,
          });
        });
        currentYearMonths = _.sortBy(currentYearMonths, [
          function (month) {
            return month.month;
          },
        ]);

        const quartelyGrouping = groupQuarters(currentYearMonths);
        console.log(quartelyGrouping);

        // monthsArr = [...months, ...Object.entries(monthGrouping)];

        // console.log(currentYearMonths);
      });
    });
};

// group by year
function groupByYear(data) {
  const dateArr = [];

  data?.forEach((i) => {
    let date = i?.doc?.seconds
      ? new Date(i?.doc?.seconds * 1000)?.toISOString()
      : new Date(i?.doc)?.toISOString();

    dateArr.push({ ...i, date });
  });

  return _.groupBy(dateArr, function (i) {
    return i.date?.substring(0, 4);
  });
}

// group into quaters
function groupQuarters(data) {
  return _a.chunk(data, 3);
}

// group by months
function groupMonths(data) {
  return _.groupBy(data, function (item) {
    if (item?.doc?.seconds) {
      return new Date(item?.doc?.seconds * 1000).toISOString().substring(5, 7);
    } else {
      return new Date(item?.doc).toISOString().substring(5, 7);
    }
  });
}

function groupMonthlyTotals(data) {
  console.log("MONTHLY CONTS:", data);
}

function getTotalAmount(data) {
  return _.reduce(
    data,
    function (sum, n) {
      return sum + parseInt(n?.amount);
    },
    0
  );
}

const cms = {
  viewData,
  groupByYear,
  groupQuarters,
  groupMonths,
  groupMonthlyTotals,
};

export default cms;
