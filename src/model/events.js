import Observer from '../utils/observer.js';
import {getDuration} from '../utils/event';

export default class Events extends Observer {
  constructor() {
    super();
    this._events = [];
  }

  setEvents(updateType, events) {
    this._events = events.slice();
    this._notify(updateType);
  }

  getEvents() {
    return this._events;
  }

  updateEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting task`);
    }

    this._events = [
      ...this._events.slice(0, index),
      update,
      ...this._events.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addEvent(updateType, update) {
    this._events = [
      update,
      ...this._events
    ];

    this._notify(updateType, update);
  }

  deleteEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting task`);
    }

    this._events = [
      ...this._events.slice(0, index),
      ...this._events.slice(index + 1)
    ];

    this._notify(updateType);
  }

  static adaptToClient(event) {
    const adaptedEvent = Object.assign(
        {},
        event,
        {
          name: event.type,
          price: event.base_price,
          startDate: event.date_from,
          endDate: event.date_to,
          duration: getDuration(event.date_from, event.date_to),
          destinationCity: event.destination.name,
          destination: {
            descr: event.destination.description,
            photo: event.destination.pictures,
          },
          options: event.offers,
          isFavorite: event.is_favorite ? event.is_favorite : false
        }
    );

    delete adaptedEvent.date_to;
    delete adaptedEvent.date_from;
    delete adaptedEvent.is_favorite;
    delete adaptedEvent.base_price;
    delete adaptedEvent.destination.name;
    delete adaptedEvent.offers;
    delete adaptedEvent.type;

    return adaptedEvent;
  }

  static adaptToServer(event) {
    const adaptedEvent = Object.assign(
        {},
        event,
        {
          [`date_to`]: event.endDate,
          [`date_from`]: event.startDate,
          [`is_favorite`]: event.isFavorite,
          [`base_price`]: event.price,
          destination: {
            name: event.destinationCity,
            description: event.destination.descr,
            pictures: event.destination.photo
          },
          offers: event.options,
          type: event.name
        }
    );

    delete adaptedEvent.isFavorite;
    delete adaptedEvent.duration;
    delete adaptedEvent.startDate;
    delete adaptedEvent.endDate;
    delete adaptedEvent.isFavorite;
    delete adaptedEvent.price;
    delete adaptedEvent.destinationCity;
    delete adaptedEvent.destination.descr;
    delete adaptedEvent.destination.photo;
    delete adaptedEvent.options;
    delete adaptedEvent.name;

    return adaptedEvent;
  }
}
