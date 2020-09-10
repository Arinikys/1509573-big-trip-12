import DayView from '../view/day.js';
import SortView from '../view/sort.js';
import StartView from '../view/start.js';
import LoadingView from '../view/loading.js';
import EventsListContainerView from '../view/events-list.js';
import EventPresenter from './event.js';
import EventNewPresenter from './event-new.js';
import {filter} from '../utils/filter.js';
import {createDateArr, crateDateEvensList} from '../utils/event.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {UpdateType, UserAction, FilterType} from '../const.js';


export default class Trip {
  constructor(tripContainer, eventsModel, filterModel, api, destination, offers) {
    this._tripContainer = tripContainer;
    this._eventsModel = eventsModel;
    this._filterModel = filterModel;
    this._eventPresenter = {};
    this._dayList = [];
    this._isLoading = true;
    this._api = api;
    this._destination = destination;
    this._offers = offers;

    this._sortComponent = new SortView();
    this._startComponent = new StartView();
    this._loadingComponent = new LoadingView();
    this._handleModeChange = this._handleModeChange.bind(this);

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._eventNewPresenter = new EventNewPresenter(this._tripContainer, this._handleViewAction, this._destination, this._offers);
  }

  init() {
    this._renderTripBoard(this._getEvents());
  }

  createEvent() {
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._eventNewPresenter.init(this._destination, this._offers);
  }

  _getEvents() {
    const filterType = this._filterModel.getFilter();
    const events = this._eventsModel.getEvents();
    const filtredEvents = filter[filterType](events);
    return filtredEvents;
  }

  _renderStart() {
    render(this._tripContainer, this._startComponent, RenderPosition.BEFOREEND);
  }

  _renderSort() {
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
    let dateArr = createDateArr(this._getEvents());
    dateArr.forEach((day, count) => {
      const dayElem = new DayView(new Date(day), ++count);
      this._dayList.push(dayElem);
      render(this._tripContainer, dayElem, RenderPosition.BEFOREEND);

      const eventsListContainer = new EventsListContainerView();
      render(dayElem, eventsListContainer, RenderPosition.BEFOREEND);

      const dateEvensList = crateDateEvensList(this._getEvents(), new Date(day));
      this._renderEventsList(eventsListContainer, dateEvensList);
    });
  }

  _renderEventsList(eventsListContainer, dateEvensList) {
    for (let event of dateEvensList) {
      this._renderEvent(eventsListContainer, event);
    }
  }

  _renderEvent(eventListElement, event) {
    const eventPresenter = new EventPresenter(eventListElement, this._handleViewAction, this._handleModeChange);
    eventPresenter.init(event, this._destination, this._offers);
    this._eventPresenter[event.id] = eventPresenter;
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
        this._eventsModel.updateEvent(updateType, update);
        this._api.updateEvents(update).then((response) => {
          this._eventsModel.updateEvent(updateType, response);
        });
        break;
      case UserAction.ADD_EVENT:
        this._api.addEvent(update).then((response) => {
          this._eventsModel.addEvent(updateType, response);
        });
        break;
      case UserAction.DELETE_EVENT:
        this._api.deleteEvent(update).then(() => {
          this._eventsModel.deleteEvent(updateType, update);
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
        this._renderTripBoard();
        break;
    }
  }

  _clearTrip() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.destroy());
    this._eventPresenter = {};
    for (let day of this._dayList) {
      remove(day);
      day.removeElement();
    }
    this._dayList = [];
    remove(this._sortComponent);
    remove(this._startComponent);
    remove(this._loadingComponent);
    this._eventNewPresenter.destroy();
  }
}
