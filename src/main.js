import MenuControlsView from './view/site-menu.js';
import AddBtnView from './view/add-btn.js';
import TripInfoView from './view/trip-info.js';
import EventsModel from './model/events.js';
import FilterModel from './model/filter.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import {render, RenderPosition} from './utils/render.js';
import {UpdateType, MenuItem} from './const.js';
import Api from './api.js';

const AUTHORIZATION = `Basic fghjdfghdfgh`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlElement = tripMainElement.querySelector(`.trip-main__trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);
const siteMenuComponent = new MenuControlsView();
const addBtnComponent = new AddBtnView();

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

    const handleEventNewFormClose = () => {
      siteMenuComponent.setMenuItem(MenuItem.EVENTS);
      addBtnComponent.getElement().disabled = false;
    };

    const handleSiteMenuClick = (menuItem) => {
      switch (menuItem) {
        case MenuItem.ADD_NEW_TASK:
          tripPresenter.destroy();
          tripPresenter.init();
          tripPresenter.createEvent(handleEventNewFormClose);
          addBtnComponent.getElement().disabled = true;
          break;
        case MenuItem.EVENTS:
          tripPresenter.destroy();
          tripPresenter.init();
          addBtnComponent.getElement().disabled = false;
          break;
        case MenuItem.STATISTICS:
          tripPresenter.destroy();
          addBtnComponent.getElement().disabled = false;
          break;
      }
    };

    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
    addBtnComponent.setAddBtnClickHandler(handleSiteMenuClick);

    render(tripMainElement, new TripInfoView(), RenderPosition.AFTERBEGIN);
    render(tripControlElement, siteMenuComponent, RenderPosition.BEFOREEND);
    render(tripMainElement, addBtnComponent, RenderPosition.BEFOREEND);
  })
  .catch(() => {
    eventsModel.setEvents(UpdateType.INIT, []);
    render(tripMainElement, new TripInfoView(), RenderPosition.AFTERBEGIN);
  });
