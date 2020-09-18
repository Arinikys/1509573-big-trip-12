import MenuControlsView from './view/site-menu.js';
import StatisticsView from "./view/stat.js";
import AddBtnView from './view/add-btn.js';
import EventsModel from './model/events.js';
import FilterModel from './model/filter.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import {render, RenderPosition, remove} from './utils/render.js';
import {UpdateType, MenuItem} from './const.js';
import Api from './api/index.js';
import Store from "./api/store.js";
import Provider from "./api/provider.js";

const AUTHORIZATION = `Basic fghjdfzdfgzdfgghdfgh`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;
const STORE_PREFIX = `taskmanager-localstorage`;
const STORE_VER = `v12`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const tripMainElement = document.querySelector(`.trip-main`);
const bodyContainerElement = document.querySelector(`.page-main__container`);
const tripControlElement = tripMainElement.querySelector(`.trip-main__trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);
const siteMenuComponent = new MenuControlsView();
const addBtnComponent = new AddBtnView();

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const eventsModel = new EventsModel();
const filterModel = new FilterModel();

let statisticsComponent = null;

Promise.all([apiWithProvider.getDestinations(), apiWithProvider.getOffers(), apiWithProvider.getEvents()])
  .then(([destination, offers, events]) => {

    const tripPresenter = new TripPresenter(tripEventsElement, eventsModel, filterModel, apiWithProvider, destination, offers, addBtnComponent);
    const filterPresenter = new FilterPresenter(tripControlElement, filterModel, eventsModel);

    eventsModel.setEvents(UpdateType.INIT, events);

    tripPresenter.init();
    filterPresenter.init();

    const handleEventNewFormClose = () => {
      siteMenuComponent.setMenuItem(MenuItem.EVENTS);
    };

    const handleSiteMenuClick = (menuItem) => {
      switch (menuItem) {
        case MenuItem.ADD_NEW_TASK:
          remove(statisticsComponent);
          tripPresenter.destroy();
          tripPresenter.init();
          tripPresenter.createEvent(handleEventNewFormClose);
          addBtnComponent.getElement().disabled = true;
          break;
        case MenuItem.EVENTS:
          remove(statisticsComponent);
          tripPresenter.destroy();
          tripPresenter.init();
          break;
        case MenuItem.STATISTICS:
          tripPresenter.destroy();
          statisticsComponent = new StatisticsView(eventsModel.getEvents());
          render(bodyContainerElement, statisticsComponent, RenderPosition.BEFOREEND);
          statisticsComponent.restoreHandlers();
          break;
      }
    };

    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
    addBtnComponent.setAddBtnClickHandler(handleSiteMenuClick);

    render(tripControlElement, siteMenuComponent, RenderPosition.BEFOREEND);
    render(tripMainElement, addBtnComponent, RenderPosition.BEFOREEND);
  })
  .catch(() => {
    eventsModel.setEvents(UpdateType.INIT, []);
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {
      console.log(`ServiceWorker available`); // eslint-disable-line
    }).catch(() => {
    console.error(`ServiceWorker isn't available`); // eslint-disable-line
    });
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
