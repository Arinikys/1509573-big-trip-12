import MenuControlsView from './view/site-menu.js';
import TripInfoView from './view/trip-info.js';
import EventsModel from './model/events.js';
import FilterModel from './model/filter.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import {render, RenderPosition} from './utils/render.js';
import {UpdateType} from './const.js';
import Api from './api.js';

const AUTHORIZATION = `Basic fghjdfghdfgh`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlElement = tripMainElement.querySelector(`.trip-main__trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);

const api = new Api(END_POINT, AUTHORIZATION);

const eventsModel = new EventsModel();
const filterModel = new FilterModel();

Promise.all([api.getDestinations(), api.getOffers(), api.getEvents()])
  .then(([destination, offers, events]) => {

    const tripPresenter = new TripPresenter(tripEventsElement, eventsModel, filterModel, api, destination, offers);
    const filterPresenter = new FilterPresenter(tripControlElement, filterModel, eventsModel);

    eventsModel.setEvents(UpdateType.INIT, events);

    tripPresenter.init();
    filterPresenter.init();

    render(tripMainElement, new TripInfoView(), RenderPosition.AFTERBEGIN);
    render(tripControlElement, new MenuControlsView(), RenderPosition.BEFOREEND);

    document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      tripPresenter.createEvent();
    });
  })
  .catch(() => {
    eventsModel.setEvents(UpdateType.INIT, []);
    render(tripMainElement, new TripInfoView(), RenderPosition.AFTERBEGIN);
    render(tripControlElement, new MenuControlsView(), RenderPosition.BEFOREEND);
  });
