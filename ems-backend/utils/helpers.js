// utils/helpers.js

// 🗓️ Returns number of working days in a month, excluding weekends and holidays
exports.getWorkingDaysInMonth = (year, month, holidays = []) => {
  const totalDays = new Date(year, month, 0).getDate();
  let workingDays = 0;

  for (let day = 1; day <= totalDays; day++) {
    const date = new Date(year, month - 1, day);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isHoliday = holidays.some(h => new Date(h).toDateString() === date.toDateString());

    if (!isWeekend && !isHoliday) {
      workingDays++;
    }
  }

  return workingDays;
};

// 🎉 Returns an array of public holiday dates for the given month/year
exports.getPublicHolidays = async (month, year) => {
  // You can later fetch this from DB or config
  const staticHolidays = [
    `${year}-01-26`, // Republic Day
    `${year}-08-15`, // Independence Day
    `${year}-10-02`, // Gandhi Jayanti
  ];

  return staticHolidays.filter(date => new Date(date).getMonth() + 1 === parseInt(month));
};