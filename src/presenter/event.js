import EditEventView from "../view/edit-event-form.js";
import EventView from "../view/event.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";


export default class Event {
  constructor(eventsListContainer, changeData) {
    this._eventsListContainer = eventsListContainer;
    this._changeData = changeData;

    this._eventComponent = null;
    this._eventEditComponent = null;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(event) {
    this._event = event;

    this._eventComponent = new EventView(event);
    this._eventEditComponent = new EditEventView(event);

    this._eventComponent.setEventClickHandler(this._handleEditClick);
    this._eventEditComponent.setFormSubmitHandler(this._handleFormSubmit);

    render(this._eventsListContainer, this._eventComponent, RenderPosition.BEFOREEND);
  }

  rerender() {
    const prevEventComponent = this._eventComponent;
    const prevEventEditComponent = this._eventEditComponent;

    if (this._eventsListContainer.getElement().contains(prevEventComponent.getElement())) {
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._eventsListContainer.getElement().contains(prevEventEditComponent.getElement())) {
      replace(this._eventEditComponent, prevEventEditComponent);
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._eventEditComponent);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._replaceFormToEvent();
    }
  }

  _replaceEventToForm() {
    replace(this._eventEditComponent, this._eventComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _replaceFormToEvent() {
    replace(this._eventComponent, this._eventEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleEditClick() {
    this._replaceEventToForm();
  }

  _handleFormSubmit() {
    this._replaceFormToEvent();
  }
}
