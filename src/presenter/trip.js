import DayView from "../view/day.js";
import SortView from "../view/sort.js";
import StartView from "../view/start.js";
import EventsListContainerView from "../view/events-list.js";
import EventPresenter from "./event.js";
import {updateItem} from "../utils/common.js";
import {createDateArr, crateDateEvensList} from '../utils/event.js';
import {render, RenderPosition} from "../utils/render.js";


export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;
    this._eventPresenter = {};

    this._sortComponent = new SortView();
    this._startComponent = new StartView();
    this._handleEventChange = this._handleEventChange.bind(this);
  }

  init(events) {
    this._events = events.slice();
    this._sourcedEvent = events.slice();

    if (this._events.length === 0) {
      this._renderStart(this._events);
      return;
    }

    this._renderSort();
    this._renderTrip(this._events);
  }

  _renderStart() {
    render(this._tripContainer, this._startComponent, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    render(this._tripContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderTrip(events) {
    const dateArr = createDateArr(events);
    let count = 0;
    for (let day of dateArr) {
      count++;
      const dayElem = new DayView(new Date(day), count);
      render(this._tripContainer, dayElem, RenderPosition.BEFOREEND);

      const eventsListContainer = new EventsListContainerView();
      render(dayElem, eventsListContainer, RenderPosition.BEFOREEND);

      const dateEvensList = crateDateEvensList(events, new Date(day));
      for (let event of dateEvensList) {
        this._renderEvent(eventsListContainer, event);
      }
    }
  }

  _renderEvent(eventListElement, event) {
    const eventPresenter = new EventPresenter(eventListElement, this._handleEventChange);
    eventPresenter.init(event);
    this._eventPresenter[event.id] = eventPresenter;
  }

  _handleEventChange(updatedEvent) {
    this._events = updateItem(this._events, updatedEvent);
    this._sourcedEvent = updateItem(this._sourcedEvent, updatedEvent);
    this._eventPresenter[updatedEvent.id].init(updatedEvent);
  }

  _clearEventList() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.destroy());
    this._eventPresenter = {};
  }
}
