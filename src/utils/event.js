export const getEndTime = (startTime, duration)=> {
  const endTime = new Date(startTime);
  endTime.setMinutes(endTime.getMinutes() + duration.minute);
  endTime.setHours(endTime.getHours() + duration.hour);
  return endTime;
};


export const createDateArr = (events) => {
  const dateArr = [];
  for (let event of events) {
    let newDate = new Date(event.startDate);
    newDate = newDate.setHours(23, 59, 59, 999);
    if (!dateArr.includes(newDate)) {
      dateArr.push(newDate);
    }
  }
  return dateArr;
};

export const crateDateEvensList = (events, date) => {
  return events.filter((event) => event.startDate.getMonth() === date.getMonth() && event.startDate.getDate() === date.getDate());
};
