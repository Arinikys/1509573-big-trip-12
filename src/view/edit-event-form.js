import {OPTIONS, TRIP_EVENT, DESTINATION_CITY} from '../const.js';
import {getEndTime} from '../utils/event.js';
import {prettifyTime} from "../utils/common.js";
import AbstractView from "./abstract.js";

const BLANK_EVENT = {
  event: {
    name: `Flight`,
    type: `transfer`
  },
  destinationCity: `California`,
  startDate: new Date(),
  duration: {
    hour: 0,
    minute: 0
  },
  price: 0,
  isFav: true,
  options: []
};

const createEditEventTemplate = (curEvent = {}) => {
  const {event, destinationCity, startDate, duration, price, isFav, options} = curEvent;

  const prep = event.type === `activity`
    ? `in`
    : `to`;

  const getAvailableOption = ()=> {
    const availableOptionName = new Set();

    for (let option of options) {
      availableOptionName.add(option.name);
    }
    return availableOptionName;
  };

  const createOptionTemplate = () => {
    let optionList = ``;
    const availableOptionList = getAvailableOption();
    for (let option of OPTIONS) {
      if (event.type === option.eventType) {
        let optionNameLC = option.name.toLowerCase();
        optionList += `<div class="event__offer-selector">
          <input
            class="event__offer-checkbox  visually-hidden"
            id="event-offer-${optionNameLC}-1"
            type="checkbox"
            name="event-offer-${optionNameLC}"
            ${availableOptionList.has(option.name) ? `checked` : ``}
          >
          <label class="event__offer-label" for="event-offer-${optionNameLC}-1">
            <span class="event__offer-title">${option.name}</span>
            &plus; &euro;&nbsp;<span class="event__offer-price">${option.price}</span>
          </label>
          </div>`;
      }
    }
    return optionList;
  };

  const optionTemplate = createOptionTemplate();

  const createTripEventTemplate = (type) => {
    let tripEventList = ``;
    for (let tripEvent of TRIP_EVENT) {
      if (tripEvent.type === type) {
        let tripEventNameLC = tripEvent.name.toLowerCase();
        tripEventList += `<div class="event__type-item">
                <input id="event-type-${tripEventNameLC}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${tripEventNameLC}">
                <label class="event__type-label  event__type-label--${tripEventNameLC}" for="event-type-${tripEventNameLC}-1">${tripEvent.name}</label>
              </div>`;
      }
    }
    return tripEventList;
  };

  const transferEventTemplate = createTripEventTemplate(`transfer`);
  const activityEventTemplate = createTripEventTemplate(`activity`);

  const createDestinationCityTemplate = () => {
    let destinationCityList = ``;
    for (let city of DESTINATION_CITY) {
      destinationCityList += `<option value="${city}"></option>`;
    }
    return destinationCityList;
  };

  const destinationCityTemplate = createDestinationCityTemplate();

  const endDate = getEndTime(startDate, duration);

  const prettifyDate = (date) => {
    return prettifyTime(date.getDate()) + `/` + prettifyTime(date.getMonth()) + `/` + String(date.getFullYear()).slice(-2) + ` ` + prettifyTime(date.getHours()) + `:` + prettifyTime(date.getMinutes());
  };


  return (`<form class="event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${event.name.toLowerCase()}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>
                ${transferEventTemplate}
            </fieldset>
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
                ${activityEventTemplate}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${event.name} ${prep}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationCity}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${destinationCityTemplate}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${prettifyDate(startDate)}">
          —
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${prettifyDate(endDate)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            €
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>

        <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFav ? `checked` : ``}>
        <label class="event__favorite-btn" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
          </svg>
        </label>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
          ${optionTemplate}
          </div>
        </section>
      </section>
    </form>`);
};

export default class EditEvent extends AbstractView {
  constructor(event = BLANK_EVENT) {
    super();
    this._event = event;
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
  }

  getTemplate() {
    return createEditEventTemplate(this._event);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit();
  }

  _eventClickHandler(evt) {
    evt.preventDefault();
    this._callback.eventClick();
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }
}

