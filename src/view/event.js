import AbstractView from './abstract.js';
import {decorateName, getPrep, prettifyNumber} from '../utils/event.js';
import {prettifyTime} from '../utils/common.js';

const MAX_VIS_OPTION_COUNT = 3;

const createEventTemplate = (curEvent) => {
  const {name, destinationCity, startDate, endDate, duration, price, options} = curEvent;

  const prep = getPrep(name);
  const decoratedEventName = decorateName(name);

  const createOptionTemplate = () => {
    let optionList = ``;
    if (options.length > 0) {
      for (const option of options.slice(0, MAX_VIS_OPTION_COUNT)) {
        optionList += `<li class="event__offer">
          <span class="event__offer-title">${option.title}</span>
          &plus; &euro; &nbsp;<span class="event__offer-price">${option.price}</span>
          </li>`;
      }
    }
    return optionList;
  };

  const optionTemplate = createOptionTemplate(options);

  const newStartDate = new Date(startDate);
  const newEndDate = new Date(endDate);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${name}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${decoratedEventName} ${prep} ${destinationCity}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="">
              ${prettifyTime(newStartDate.getHours())}:${prettifyTime(newStartDate.getMinutes())}
             </time>
            &mdash;
            <time class="event__end-time" datetime="">
            ${prettifyTime(newEndDate.getHours())}:${prettifyTime(newEndDate.getMinutes())}
            </time>
          </p>
          <p class="event__duration">
              ${duration.day ? prettifyNumber(duration.day) + `D` : ``}
              ${duration.hour ? prettifyNumber(duration.hour) + `H` : ``}
              ${duration.minute ? prettifyNumber(duration.minute) + `M` : ``}
          </p>
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
