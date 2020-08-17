import DayView from "../view/day.js";
import SortView from "../view/sort.js";
import EditEventView from "../view/edit-event-form.js";
import EventView from "../view/event.js";
import {render, RenderPosition, replace} from "../utils/render.js";


export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;

    this._dayComponent = new DayView();
    this._sortComponent = new SortView();
    this._eventComponent = new EventView();
    this._editEventComponent = new EditEventView();
  }

  init(events) {
    this._events = events.slice();
    this._sortEvent(this._events);
    this._renderDay();
    this._renderEventList();
  }

  _sortEvent() {
    render(this._tripContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderDay() {
    render(this._tripContainer, this._dayComponent(this._events), RenderPosition.BEFOREEND);
  }

  _renderEventList() {
    const DaysElement = document.querySelectorAll(`.trip-days__item`);
    for (let dayElement of DaysElement) {
      let date = new Date(dayElement.querySelector(`.day__date`).getAttribute(`datetime`));
      let dayEvents = this._events.filter((event) => event.startDate.getMonth() === date.getMonth() && event.startDate.getDate() === date.getDate());
      for (let event of dayEvents) {
        this._renderEvent(dayElement.querySelector(`.trip-events__list`), event);
      }
    }
  }

  _renderEvent(eventListElement, event) {
    const eventComponent = this._editEventComponent(event);
    const eventEditComponent = this._eventComponent(event);
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
