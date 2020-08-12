import {prettifyTime} from '../utils.js';
import {createEventTemplate} from "./event.js";

const MONTHS_NAMES = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`];

export const createDayTemplate = (events) => {

  const createDateArr = () => {
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

  const generateEventsList = (date) => {
    let eventList = ``;
    for (let event of events) {
      let eventDate = event.startDate;
      if (eventDate.getMonth() === date.getMonth() && eventDate.getDate() === date.getDate()) {
        eventList += createEventTemplate(event);
      }
    }

    return eventList;
  };

  const generateDaysTemplate = () => {
    const days = createDateArr();
    let daysList = ``;
    let dayCounter = 1;
    for (let day of days) {
      let curDate = new Date(day);
      let month = MONTHS_NAMES[curDate.getMonth()];
      let date = prettifyTime(curDate.getDate());
      let eventsTemplate = generateEventsList(curDate);
      daysList += `<li class="trip-days__item  day">
          <div class="day__info">
            <span class="day__counter">${dayCounter}</span>
                <time class="day__date" datetime="2019-${month}-${date}">${month + ` ` + date}</time>
          </div>
          <ul class="trip-events__list">
          ${eventsTemplate}
          </ul>
        </li>`;
      dayCounter++;
    }
    return daysList;
  };

  const daysTemplate = generateDaysTemplate();

  return (
    `<ul class="trip-days">
        ${daysTemplate}
    </ul>`
  );
};
