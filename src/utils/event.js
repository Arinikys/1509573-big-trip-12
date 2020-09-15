import {TRIP_EVENT} from '../const';
import moment from "moment";

export const getEndTime = (startTime, duration)=> {
  const endTime = new Date(startTime);
  endTime.setMinutes(endTime.getMinutes() + duration.minute);
  endTime.setHours(endTime.getHours() + duration.hour);
  return endTime;
};

export const getDuration = (startTime, endTime)=> {
  const eventDuration = moment.duration(moment(endTime).diff(moment(startTime)));
  const hour = eventDuration._data.hours;
  const minute = eventDuration._data.minutes;
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
  return point[0] ? point[0].description : null;
};

export const generatePhotos = (cityName, destinations) => {
  const point = destinations.filter((destination) => destination.name === cityName);
  return point[0] ? point[0].pictures : null;
};

export const getPrep = (eventName) => {
  const tripEvent = TRIP_EVENT.filter((item) => item.name.toLowerCase() === eventName.toLowerCase());
  return tripEvent[0].type === `activity`
    ? `in`
    : `to`;
};


export const decorateName = (name) => {
  return name.charAt(0).toUpperCase() + name.substr(1).toLowerCase();
};

export const sortByPrice = (eventA, eventB) => {
  //console.log(`sortByPrice`);
};

export const sortByTime = (eventA, eventB) => {
  //console.log(`sortByTime`);
};
