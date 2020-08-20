import DayView from "../view/day.js";
import SortView from "../view/sort.js";
import StartView from "../view/start.js";
import EventPresenter from "./event.js";
import {updateItem} from "../utils/common.js";
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
    this._renderDay(this._events);
    this._renderEventList(this._events);
  }

  _renderStart() {
    render(this._tripContainer, this._startComponent, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    render(this._tripContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderDay(events) {
    render(this._tripContainer, new DayView(events), RenderPosition.BEFOREEND);
  }

  _renderEventList(events) {
    const DaysElement = document.querySelectorAll(`.trip-days__item`);
    for (let dayElement of DaysElement) {
      let date = new Date(dayElement.querySelector(`.day__date`).getAttribute(`datetime`));
      let dayEvents = events.filter((event) => event.startDate.getMonth() === date.getMonth() && event.startDate.getDate() === date.getDate());
      for (let event of dayEvents) {
        this._renderEvent(dayElement.querySelector(`.trip-events__list`), event);
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

  _clearTaskList() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.destroy());
    this._eventPresenter = {};
  }
}
