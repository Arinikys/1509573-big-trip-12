import DayView from "../view/day.js";
import SortView from "../view/sort.js";
import EditEventView from "../view/edit-event-form.js";
import EventView from "../view/event.js";
import {render, RenderPosition, replace} from "../utils/render.js";


export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;

    this._sortComponent = new SortView();
  }

  init(events) {
    this._events = events.slice();
    this._sortEvent(this._events);
    this._renderDay(this._events);
    this._renderEventList(this._events);
  }

  _sortEvent() {
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
    const eventComponent = new EventView(event);
    const eventEditComponent = new EditEventView(event);
    render(eventListElement, eventComponent, RenderPosition.BEFOREEND);

    const replaceEventToForm = () => {
      replace(eventEditComponent, eventComponent);
    };

    const replaceFormToEvent = () => {
      replace(eventComponent, eventEditComponent);
    };

    eventComponent.setEventClickHandler(() => {
      replaceEventToForm();
    });

    eventEditComponent.setCancelClickHandler(() => {
      replaceFormToEvent();
    });

    eventEditComponent.setFormSubmitHandler(() => {
      replaceFormToEvent();
    });
  }
}
