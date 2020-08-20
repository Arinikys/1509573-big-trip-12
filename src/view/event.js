import AbstractView from "./abstract.js";
import {getEndTime} from '../utils/event.js';
import {prettifyTime} from "../utils/common.js";

const EVENT_TYPE_NAME = `arrival`;
const MAX_VIS_OPTION_COUNT = 3;

const createEventTemplate = (curEvent) => {
  const {event, destinationCity, startDate, duration, price, options} = curEvent;

  const prep = event.type === EVENT_TYPE_NAME
    ? `in`
    : `to`;

  const createOptionTemplate = () => {
    let optionList = ``;
    if (options.length > 0) {
      for (let option of options.slice(0, MAX_VIS_OPTION_COUNT)) {
        optionList += `<li class="event__offer">
          <span class="event__offer-title">${option.name}</span>
          &plus; &euro; &nbsp;<span class="event__offer-price">${option.price}</span>
          </li>`;
      }
    }
    return optionList;
  };

  const optionTemplate = createOptionTemplate(options);

  const endDate = getEndTime(startDate, duration);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${event.name.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${event.name} ${prep} ${destinationCity}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="">
              ${prettifyTime(startDate.getHours())}:${prettifyTime(startDate.getMinutes())}
             </time>
            &mdash;
            <time class="event__end-time" datetime="">
            ${prettifyTime(endDate.getHours())}:${prettifyTime(endDate.getMinutes())}
            </time>
          </p>
          <p class="event__duration">${duration.hour}H ${duration.minute}M</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${optionTemplate}
        </ul>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class Event extends AbstractView {
  constructor(event) {
    super();
    this._event = event;
    this._eventClickHandler = this._eventClickHandler.bind(this);
  }

  getTemplate() {
    return createEventTemplate(this._event);
  }
  _eventClickHandler(evt) {
    evt.preventDefault();
    this._callback.eventClick();
  }
  
  setEventClickHandler(callback) {
    this._callback.eventClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._eventClickHandler);
  }
}
