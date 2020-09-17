import EventEditView from '../view/edit-event-form.js';
import {remove, render, RenderPosition} from '../utils/render.js';
import {UserAction, UpdateType} from '../const.js';
import AddBtnView from "../view/add-btn";

export default class EventNew {
  constructor(changeData, destination, offers, addBtnComponent) {
    this._sortContainer = null;
    this._changeData = changeData;
    this._destination = destination;
    this._offers = offers;
    this._addBtnComponent = addBtnComponent;

    this._eventEditComponent = null;
    this._destroyCallback = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
  }

  init(callback, sortContainer) {
    this._destroyCallback = callback;
    this._sortContainer = sortContainer;

    if (this._eventEditComponent !== null) {
      return;
    }

    if (this._destroyCallback !== null) {
      this._destroyCallback();
    }

    this._eventEditComponent = new EventEditView(this._destination, this._offers);
    this._eventEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._eventEditComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._eventEditComponent.setCloseClickHandler(this._handleCloseClick);

    render(this._sortContainer, this._eventEditComponent, RenderPosition.AFTERCONTAINER);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._eventEditComponent === null) {
      return;
    }

    remove(this._eventEditComponent);
    this._eventEditComponent = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._addBtnComponent.getElement().disabled = false;
  }

  setSaving() {
    this._eventEditComponent.updateData({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._eventEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this._eventEditComponent.shake(resetFormState);
  }


  _handleFormSubmit(event) {
    this._changeData(
        UserAction.ADD_EVENT,
        UpdateType.MINOR,
        event
    );
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }

  _handleCloseClick() {
    this.destroy();
  }
}
