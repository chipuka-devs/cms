export const validateDate = (leastDate, mostDate) => {
  const dateA = new Date(mostDate);
  const dateB = new Date(leastDate);
  if (dateA > dateB) {
    return true;
  } else if (dateA.getDate() === dateB.getDate()) {
    return true;
  } else {
    return false;
  }
};

export const calculateDifferenceInMonths = (minDate, maxDate) => {
  const d2 = new Date(maxDate);
  const d1 = new Date(minDate);

  var months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 1 : months;
};

export const existsInArray = (array, itemContainted, objectKey) => {
  let itemExists = array.some((arr) => arr[objectKey] === itemContainted);

  return itemExists;
};
