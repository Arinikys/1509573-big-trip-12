import DayView from '../view/day.js';
import SortView from '../view/sort.js';
import StartView from '../view/start.js';
import LoadingView from '../view/loading.js';
import EventsListContainerView from '../view/events-list.js';
import EventPresenter, {State as EventPresenterViewState} from './event.js';
import EventNewPresenter from './event-new.js';
import {filter} from '../utils/filter.js';
import {sortByDate} from '../utils/event.js';
import {createDateArr, crateDateEvensList, sortByTime, sortByPrice} from '../utils/event.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {UpdateType, UserAction, FilterType, SortType} from '../const.js';


export default class Trip {
  constructor(tripContainer, eventsModel, filterModel, api, destination, offers, addBtnComponent) {
    this._tripContainer = tripContainer;
    this._eventsModel = eventsModel;
    this._filterModel = filterModel;
    this._addBtnComponent = addBtnComponent;
    this._eventPresenter = {};
    this._dayList = [];
    this._dayItem = null;
    this._isLoading = true;
    this._api = api;
    this._destination = destination;
    this._offers = offers;
    this._currentSortType = SortType.EVENT;

    this._sortComponent = null;

    this._startComponent = new StartView();
    this._loadingComponent = new LoadingView();
    this._handleModeChange = this._handleModeChange.bind(this);

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._eventNewPresenter = new EventNewPresenter(this._handleViewAction, this._destination, this._offers, this._addBtnComponent);
  }

  init() {
    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderTripBoard(this._getEvents());
  }

  createEvent(callback) {
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._eventNewPresenter.init(callback, this._sortComponent);
  }

  _getEvents() {
    const filterType = this._filterModel.getFilter();
    const events = sortByDate(this._eventsModel.getEvents());
    const filtredEvents = filter[filterType](events);
    switch (this._currentSortType) {
      case SortType.PRICE:
        return filtredEvents.sort(sortByPrice);
        break;
      case SortType.TIME:
        return filtredEvents.sort(sortByTime);
        break;
    }

    return filtredEvents;
  }

  _renderStart() {
    render(this._tripContainer, this._startComponent, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._tripContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderLoading() {
    render(this._tripContainer, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _renderTripBoard() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }
    if (this._getEvents().length === 0) {
      this._renderStart();
      return;
    }
    this._renderSort();
    this._renderDayList();
  }

  _renderDayList() {
    const dateArr = createDateArr(this._getEvents());
    if (this._currentSortType === SortType.EVENT) {
      dateArr.forEach((day, count) => {
        const dayElem = new DayView(new Date(day), ++count);
        this._dayList.push(dayElem);
        render(this._tripContainer, dayElem, RenderPosition.BEFOREEND);
        const eventsListContainer = new EventsListContainerView();
        render(dayElem, eventsListContainer, RenderPosition.BEFOREEND);
        const dateEvensList = crateDateEvensList(this._getEvents(), new Date(day));
        this._renderEventsList(eventsListContainer, dateEvensList);
      });
    } else {
      this._dayItem = new DayView();
      render(this._tripContainer, this._dayItem, RenderPosition.BEFOREEND);
      const eventsListContainer = new EventsListContainerView();
      render(this._dayItem, eventsListContainer, RenderPosition.BEFOREEND);
      this._renderEventsList(eventsListContainer, this._getEvents());
    }
  }

  _renderEventsList(eventsListContainer, dateEvensList) {
    for (const event of dateEvensList) {
      this._renderEvent(eventsListContainer, event);
    }
  }

  _renderEvent(eventListElement, event) {
    const eventPresenter = new EventPresenter(eventListElement, this._handleViewAction, this._handleModeChange);
    eventPresenter.init(event, this._destination, this._offers);
    this._eventPresenter[event.id] = eventPresenter;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearTrip();
    this._renderTripBoard();
  }

  _handleModeChange() {
    this._eventNewPresenter.destroy();
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this._eventPresenter[update.id].setViewState(EventPresenterViewState.SAVING);
        this._api.updateEvents(update)
          .then((response) => {
            this._eventsModel.updateEvent(updateType, response);
          })
          .catch(() => {
            this._eventPresenter[update.id].setViewState(EventPresenterViewState.ABORTING);
          });
        break;
      case UserAction.ADD_EVENT:
        this._eventNewPresenter.setSaving();
        this._api.addEvent(update)
          .then((response) => {
            this._eventsModel.addEvent(updateType, response);
          })
          .catch(() => {
            this._eventNewPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_EVENT:
        this._eventPresenter[update.id].setViewState(EventPresenterViewState.DELETING);
        this._api.deleteEvent(update)
          .then(() => {
            this._eventsModel.deleteEvent(updateType, update);
          })
          .catch(() => {
            this._eventPresenter[update.id].setViewState(EventPresenterViewState.ABORTING);
          });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._eventPresenter[data.id].init(data, this._destination, this._offers);
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTripBoard();
        break;
      case UpdateType.MAJOR:
        this._clearTrip({resetSortType: true});
        this._renderTripBoard();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        break;
    }
  }

  destroy() {
    this._clearTrip();

    this._eventsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _clearTrip({resetSortType = false} = {}) {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.destroy());
    this._eventPresenter = {};
    for (const day of this._dayList) {
      remove(day);
      day.removeElement();
    }
    this._dayList = [];
    if (this._dayItem) {
      remove(this._dayItem);
    }
    remove(this._sortComponent);
    remove(this._startComponent);
    remove(this._loadingComponent);
    this._eventNewPresenter.destroy();
    if (resetSortType) {
      this._currentSortType = SortType.EVENT;
    }
  }
}
