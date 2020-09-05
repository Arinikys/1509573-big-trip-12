import {TRIP_EVENT} from "../const";

export const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

export const getEndTime = (startTime, duration)=> {
  const endTime = new Date(startTime);
  endTime.setMinutes(endTime.getMinutes() + duration.minute);
  endTime.setHours(endTime.getHours() + duration.hour);
  return endTime;
};

export const getDuration = (startTime, endTime)=> {
  startTime = Date.parse(startTime);
  endTime = Date.parse(endTime);
  const diff = endTime - startTime;
  const hour = Math.round(diff / (1000 * 60 * 60));
  const minute = Math.abs(Math.round((diff - hour * 1000 * 60 * 60) / (1000 * 60)));
  return {hour, minute};
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
  return events.filter((event) => new Date(event.startDate).getMonth() === date.getMonth() && new Date(event.startDate).getDate() === date.getDate());
};

export const generateDescription = (cityName, destinations) => {
  const point = destinations.filter((destination) => destination.name === cityName);
  return point[0].description;
};

export const generatePhotos = (cityName, destinations) => {
  const point = destinations.filter((destination) => destination.name === cityName);
  return point[0].pictures;
};

export const getPrep = (eventName) => {
  const tripEvent = TRIP_EVENT.filter((item) => item.name.toLowerCase() === eventName.toLowerCase());
  return tripEvent[0].type === `activity`
    ? `in`
    : `to`;
};
