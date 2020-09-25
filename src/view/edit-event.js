import {TRIP_EVENT} from '../const.js';
import {generateDescription, generatePhotos, getPrep, decorateName} from '../utils/event.js';
import {prettifyTime} from '../utils/common.js';
import SmartView from './smart.js';
import flatpickr from "flatpickr";

import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const BLANK_EVENT = {
  startDate: new Date(),
  endDate: new Date(),
  price: 100,
  isFavorite: true,
  options: [],
  destination: {
    descr: null,
    photo: null
  },
  name: `flight`,
  destinationCity: ``,
};

const createEditEventTemplate = (curEvent = {}, destinationPoints, offers) => {
  const {dataStartDate, dataEndDate, dataPrice, isFavorite, dataOptions, dataDestination, dataEventName, dataDestinationCity, isDisabled, isSaving, isDeleting} = curEvent;

  const prep = getPrep(dataEventName);
  const decoratedDataEventName = decorateName(dataEventName);

  const getAvailableOption = ()=> {
    const availableOptionName = new Set();
    for (const option of dataOptions) {
      availableOptionName.add(option.title);
    }
    return availableOptionName;
  };

  const createDescrPhotoTemplate = (photoList) => {
    let descrPhotoList = ``;
    for (const photo of photoList) {
      descrPhotoList += `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`;
    }
    return descrPhotoList;
  };

  const createDescriptionTemplate = () => {
    if (!dataDestination.descr && !dataDestination.photo) {
      return ``;
    }
    return `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      ${dataDestination.descr ? `<p class="event__destination-description">${dataDestination.descr}</p>` : ``}
      <div class="event__photos-container">
        <div class="event__photos-tape">
         ${createDescrPhotoTemplate(dataDestination.photo)}
        </div>
      </div>
    </section>`;
  };
  const descriptionTemplate = createDescriptionTemplate();

  const createOptionTemplate = () => {
    let optionList = ``;
    const availableOptionList = getAvailableOption();
    const curOption = offers.filter((offer) => offer.type === dataEventName.toLowerCase());
    curOption[0].offers.forEach((option) => {
      const optionAttr = option.title.toLowerCase().replace(/ /g, `-`);
      optionList += `<div class="event__offer-selector">
        <input
          class="event__offer-checkbox  visually-hidden"
          id="${optionAttr}"
          type="checkbox"
          name="${optionAttr}"
          data-title="${option.title}"
          data-price="${option.price}"
          ${availableOptionList.has(option.title) ? `checked` : ``}
          ${isDisabled ? `disabled` : ``}
        >
        <label class="event__offer-label" for="${optionAttr}">
          <span class="event__offer-title">${option.title}</span>
          &plus; &euro;&nbsp;<span class="event__offer-price">${option.price}</span>
        </label>
        </div>`;
    });
    return optionList ? `<section class="event__details">
              <section class="event__section  event__section--offers">
                <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                <div class="event__available-offers">
                ${optionList}
                </div>
              </section>
            </section>` : ``;
  };

  const optionTemplate = createOptionTemplate();

  const createTripEventTemplate = (type) => {
    let tripEventList = ``;
    for (const tripEvent of TRIP_EVENT) {
      if (tripEvent.type === type) {
        const tripEventNameLC = tripEvent.name.toLowerCase();
        tripEventList += `<div class="event__type-item">
                <input id="event-type-${tripEventNameLC}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${tripEventNameLC}" ${isDisabled ? `disabled` : ``}>
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
    for (const city of destinationPoints) {
      destinationCityList += `<option value="${city.name}"></option>`;
    }
    return destinationCityList;
  };

  const destinationCityTemplate = createDestinationCityTemplate();

  const prettifyDate = (date) => {
    const newDate = new Date(date);
    return prettifyTime(newDate.getDate()) + `/` + prettifyTime(newDate.getMonth()) + `/` + String(newDate.getFullYear()).slice(-2) + ` ` + prettifyTime(newDate.getHours()) + `:` + prettifyTime(newDate.getMinutes());
  };


  return (`<form class="event  event--edit" action="#" method="post" ${isDisabled ? `disabled` : ``}>
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${dataEventName}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? `disabled` : ``}>

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
            ${decoratedDataEventName} ${prep}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${dataDestinationCity}" list="destination-list-1" ${isDisabled ? `disabled` : ``}>
          <datalist id="destination-list-1">
            ${destinationCityTemplate}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${prettifyDate(dataStartDate)}" ${isDisabled ? `disabled` : ``}>
          —
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${prettifyDate(dataEndDate)}" ${isDisabled ? `disabled` : ``}>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            €
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${dataPrice}" ${isDisabled ? `disabled` : ``}>
        </div>

        <button class="event__save-btn  btn  btn--blue" ${isDisabled ? `disabled` : ``}> ${isSaving ? `saving...` : `save`}</button>
        <button class="event__reset-btn" type="reset" ${isDisabled ? `disabled` : ``}>${isDeleting ? `deleting...` : `delete`}</button>

        <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``} ${isDisabled ? `disabled` : ``}>
        <label class="event__favorite-btn" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
          </svg>
        </label>

        <button class="event__rollup-btn" type="button" ${isDisabled ? `disabled` : ``}>
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      ${optionTemplate}
      ${descriptionTemplate}
    </form>`);
};

export default class EditEvent extends SmartView {
  constructor(destinationPoints, offers, event = BLANK_EVENT) {
    super();
    this._destinationPoints = destinationPoints;
    this._offers = offers;
    this._data = EditEvent.parseEventToData(event);
    this._datepicker = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);

    this._eventNameClickHandler = this._eventNameClickHandler.bind(this);
    this._eventCityClickHandler = this._eventCityClickHandler.bind(this);
    this._eventPriceClickHandler = this._eventPriceClickHandler.bind(this);
    this._eventOffersClickHandler = this._eventOffersClickHandler.bind(this);
    this._eventStartDateClickHandler = this._eventStartDateClickHandler.bind(this);
    this._eventEndDateClickHandler = this._eventEndDateClickHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._formCloseClickHandler = this._formCloseClickHandler.bind(this);
    this._setInnerHandlers();
    this._setDatepicker();
  }

  getTemplate() {
    return createEditEventTemplate(this._data, this._destinationPoints, this._offers);
  }


  removeElement() {
    super.removeElement();
    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this.setCloseClickHandler(this._callback.formCloseClick);
    this._setDatepicker();
  }

  _eventStartDateClickHandler([userDate]) {
    this.updateData({
      dataStartDate: userDate
    });
  }

  _eventEndDateClickHandler([userDate]) {
    this.updateData({
      dataEndDate: userDate
    });
  }


  _setDatepicker() {
    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }

    this._datepicker = flatpickr(
        this.getElement().querySelector(`#event-start-time-1`),
        {
          enableTime: true,
          dateFormat: `d/m/y H:i`,
          defaultDate: this._data.dataStartDate,
          onChange: this._eventStartDateClickHandler
        }
    );

    this._datepicker = flatpickr(
        this.getElement().querySelector(`#event-end-time-1`),
        {
          enableTime: true,
          dateFormat: `d/m/y H:i`,
          defaultDate: this._data.dataEndDate,
          onChange: this._eventEndDateClickHandler
        }
    );
  }

  _setInnerHandlers() {
    const eventTypeRadio = this.getElement().querySelectorAll(`input[name="event-type"]`);
    for (const radio of eventTypeRadio) {
      radio.addEventListener(`change`, this._eventNameClickHandler);
    }
    this.getElement()
      .querySelector(`#event-destination-1`)
      .addEventListener(`change`, this._eventCityClickHandler);
    this.getElement()
      .querySelector(`.event__input--price`)
      .addEventListener(`change`, this._eventPriceClickHandler);

    const offersInputs = this.getElement().querySelectorAll(`.event__available-offers input`);
    for (const input of offersInputs) {
      input.addEventListener(`change`, this._eventOffersClickHandler);
    }
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  _eventCityClickHandler(evt) {
    evt.preventDefault();
    this.updateData({
      dataDestinationCity: evt.target.value,
      dataDestination: {
        descr: generateDescription(evt.target.value, this._destinationPoints),
        photo: generatePhotos(evt.target.value, this._destinationPoints)
      }
    });
  }

  _eventPriceClickHandler(evt) {
    evt.preventDefault();
    this.updateData({
      dataPrice: parseInt(evt.target.value, 10)
    });
  }

  _eventOffersClickHandler() {
    const offersInputs = this.getElement().querySelectorAll(`.event__available-offers input`);
    const checkedOffers = Array.from(offersInputs).filter((input) => input.checked);
    const offersList = [];
    for (const offer of checkedOffers) {
      offersList.push({title: offer.dataset.title, price: parseInt(offer.dataset.price, 10)});
    }
    this.updateData({
      dataOptions: offersList
    });
  }

  _eventNameClickHandler(evt) {
    evt.preventDefault();
    let dataEventName = evt.target.value;
    dataEventName = dataEventName.toLowerCase();
    this.updateData({
      dataEventName
    });
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, this._favoriteClickHandler);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(EditEvent.parseDataToEvent(this._data));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(EditEvent.parseDataToEvent(this._data));
  }

  _formCloseClickHandler(evt) {
    evt.preventDefault();
    this._callback.formCloseClick();
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._formDeleteClickHandler);
  }

  setCloseClickHandler(callback) {
    this._callback.formCloseClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._formCloseClickHandler);
  }

  reset(event) {
    this.updateData(EditEvent.parseEventToData(event));
  }

  static parseEventToData(curEvent) {
    return Object.assign({}, curEvent, {
      dataEventName: curEvent.name,
      dataPrice: curEvent.price,
      dataStartDate: curEvent.startDate,
      dataOptions: curEvent.options,
      dataEndDate: curEvent.endDate,
      dataDestinationCity: curEvent.destinationCity,
      dataDestination: {
        descr: curEvent.destination.descr,
        photo: curEvent.destination.photo
      },
      isDisabled: false,
      isSaving: false,
      isDeleting: false
    });
  }

  static parseDataToEvent(data) {
    data = Object.assign({}, data);
    data.name = data.dataEventName;
    data.destinationCity = data.dataDestinationCity;
    data.startDate = data.dataStartDate;
    data.endDate = data.dataEndDate;
    data.price = data.dataPrice;
    data.options = data.dataOptions;
    data.destination.descr = data.dataDestination.descr;
    data.destination.photo = data.dataDestination.photo;

    delete data.dataEventName;
    delete data.dataDestinationCity;
    delete data.dataStartDate;
    delete data.dataEndDate;
    delete data.dataPrice;
    delete data.dataDestination;
    delete data.dataOptions;
    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }
}

