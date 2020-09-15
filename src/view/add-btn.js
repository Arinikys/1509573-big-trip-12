import AbstractView from './abstract.js';
import {MenuItem} from "../const.js";

const createAddBtnTemplate = () => {
  return (
    `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>`
  );
};

export default class AddBtn extends AbstractView {
  constructor() {
    super();
    this._addBtnClickHandler = this._addBtnClickHandler.bind(this);
  }

  getTemplate() {
    return createAddBtnTemplate();
  }

  _addBtnClickHandler(evt) {
    evt.preventDefault();
    this._callback.addBtnClick(MenuItem.ADD_NEW_TASK);
  }

  setAddBtnClickHandler(callback) {
    this._callback.addBtnClick = callback;
    this.getElement().addEventListener(`click`, this._addBtnClickHandler);
  }
}
