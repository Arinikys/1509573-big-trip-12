import AbstractView from './abstract.js';
import {SortType} from "../const.js";

const sort = [
  {
    label: `day`,
    name: `Day`,
    hasIcon: false,
    isInput: false,
  },
  {
    label: SortType.EVENT,
    name: `Event`,
    hasIcon: false,
    isInput: true,
  },
  {
    label: SortType.TIME,
    name: `Time`,
    hasIcon: true,
    isInput: true,
  },
  {
    label: SortType.PRICE,
    name: `Price`,
    hasIcon: true,
    isInput: true,
  },
  {
    label: `offers`,
    name: `Offers`,
    hasIcon: false,
    isInput: false,
  }
];

const createSortTemplate = (currentSortType) => {
  const icon = (hasIcon) => {
    return hasIcon ? `<svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
      <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
    </svg>` : ``;
  };

  const createSort = () => {
    let sortItems = ``;
    for (let item of sort) {
      if (!item.isInput) {
        sortItems += `<span class="trip-sort__item  trip-sort__item--${item.label}">${item.name}</span>`;
      } else {
        sortItems += `<div class="trip-sort__item  trip-sort__item--time">
          <input
            id="sort-${item.label}"
            class="trip-sort__input visually-hidden"
            type="radio"
            name="trip-sort"
            value="${item.label}"
            ${currentSortType === item.label ? `checked` : ``}
          >
          <label class="trip-sort__btn" data-sort-type="${item.label}" for="sort-${item.label}">
            ${item.name}
            ${icon(item.hasIcon)}
          </label>
        </div>`;
      }
    }
    return sortItems;
  };
  const sortTemplate = createSort();

  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
        ${sortTemplate}
      </form>`
  );
};

export default class Sort extends AbstractView {
  constructor(currentSortType) {
    super();

    this._currentSortType = currentSortType;

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate(this._currentSortType);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== `LABEL`) {
      return;
    }
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }
}
