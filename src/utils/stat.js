import moment from "moment";
import {TRIP_EVENT} from '../const.js';

export const eventToLabels = {
  [`taxi`]: `TAXI`,
  [`bus`]: `BUS`,
  [`train`]: `TRAIN`,
  [`ship`]: `SHIP`,
  [`transport`]: `TRANS`,
  [`drive`]: `DRIVE`,
  [`flight`]: `FLIGHT`,
  [`check-in`]: `STAY`,
  [`sightseeing`]: `LOOK`,
  [`restaurant`]: `EAT`
};

export const makeItemsUniq = (items) => [...new Set(items)];

export const getEventsName = (events) => events.map((event) => event.name);

export const priceSumByLabel = (events, label) => {
  const eventsByLabel = events.filter((event) => event.name === label);
  let priceSum = 0;
  for (let event of eventsByLabel) {
    priceSum += event.price;
  }
  return priceSum;
};

export const getEventsNameByType = (labels, type) => {
  const labelsByType = [];
  for (let label of labels) {
    const tripEvent = TRIP_EVENT.filter((event) => event.name.toLowerCase() === label);
    if (tripEvent[0].type === type) {
      labelsByType.push(label);
    }
  }

  return labelsByType;
};

const countEventsByLabel = (events, label) => {
  return events.filter((event) => event.name === label).length;
};

export const getEventsCount = (events, labels) => {
  const count = [];
  for (let label of labels) {
    count.push(countEventsByLabel(events, label));
  }
  return count;
};


export const countTimeByLabel = (events, labels) => {
  let eventByLabel;
  let dateSumArr = [];
  for (let label of labels) {
    eventByLabel = events.filter((event) => event.name === label);
    let dateSum = 0;
    for (let event of eventByLabel) {
      dateSum += moment(event.endDate).diff(moment(event.startDate));
    }
    let durationSum = moment.duration(new Date(dateSum));
    dateSumArr.push(Math.round(durationSum._milliseconds / 3600000));
  }
  return dateSumArr;
};
