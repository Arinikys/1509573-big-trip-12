import MenuControlsView from "./view/site-menu.js";
import TripInfoView from "./view/trip-info.js";
import FiltersView from "./view/filter.js";
import {generateEvent} from "./mock/event.js";
import TripPresenter from "./presenter/trip.js";
import {render, RenderPosition} from "./utils/render.js";

const EVENTS_COUNT = 20;

const events = new Array(EVENTS_COUNT).fill().map(generateEvent);

events.sort((a, b) => {
  const dateA = new Date(a.startDate);
  const dateB = new Date(b.startDate);
  return dateA - dateB;
});

const tripMainElement = document.querySelector(`.trip-main`);
render(tripMainElement, new TripInfoView(), RenderPosition.AFTERBEGIN);

const tripControlElement = tripMainElement.querySelector(`.trip-main__trip-controls`);
render(tripControlElement, new MenuControlsView(), RenderPosition.BEFOREEND);
render(tripControlElement, new FiltersView(), RenderPosition.BEFOREEND);

const tripEventsElement = document.querySelector(`.trip-events`);
const tripPresenter = new TripPresenter(tripEventsElement);

tripPresenter.init(events);
