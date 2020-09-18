import AbstractView from './abstract.js';
import {MenuItem} from "../const.js";

const createMenuControlsTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a
        class="trip-tabs__btn trip-tabs__btn--active"
        data-value="${MenuItem.EVENTS}"
      >
        Table
      </a>
      <a
        class="trip-tabs__btn"
        data-value="${MenuItem.STATISTICS}"
      >
        Stats
      </a>
    </nav>`
  );
};

export default class MenuControls extends AbstractView {
  constructor() {
    super();
    this._menuClickHandler = this._menuClickHandler.bind(this);
    this._removeActiveClass = this._removeActiveClass.bind(this);
  }

  getTemplate() {
    return createMenuControlsTemplate();
  }

  _removeActiveClass() {
    const tabs = this.getElement().querySelectorAll(`.trip-tabs__btn`);
    for (const tab of tabs) {
      if (tab.classList.contains(`trip-tabs__btn--active`)) {
        tab.classList.remove(`trip-tabs__btn--active`);
      }
    }
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    const selectedTab = evt.target;
    if (!selectedTab.classList.contains(`trip-tabs__btn--active`)) {
      this._removeActiveClass();
      selectedTab.classList.add(`trip-tabs__btn--active`);
      this._callback.menuClick(evt.target.dataset.value);
    }
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const item = this.getElement().querySelector(`[data-value=${menuItem}]`);
    if (item !== null) {
      this._removeActiveClass();
      item.classList.add(`trip-tabs__btn--active`);
    }
  }
}
