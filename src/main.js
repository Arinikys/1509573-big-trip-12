import MenuControlsView from "./view/site-menu.js";
import TripInfoView from "./view/trip-info.js";
import FiltersView from "./view/filter.js";
import SortView from "./view/sort.js";
import DayView from "./view/day.js";
import EditEventView from "./view/edit-event-form.js";
import {generateEvent} from "./mock/event.js";
import {render, RenderPosition} from "./utils.js";

const EVENTS_COUNT = 20;

const events = new Array(EVENTS_COUNT).fill().map(generateEvent);

events.sort((a, b) => {
  const dateA = new Date(a.startDate);
  const dateB = new Date(b.startDate);
  return dateA - dateB;
});

const tripMainElement = document.querySelector(`.trip-main`);
render(tripMainElement, new TripInfoView().getElement(), RenderPosition.AFTERBEGIN);

const tripControlElement = tripMainElement.querySelector(`.trip-main__trip-controls`);
render(tripControlElement, new FiltersView().getElement(), RenderPosition.BEFOREEND);

const tripControlMenuTitleElement = tripMainElement.querySelector(`.trip-main__trip-controls-menu-title`);
render(tripControlMenuTitleElement, new MenuControlsView().getElement(), RenderPosition.AFTEREND);

const tripEventsElement = document.querySelector(`.trip-events`);
render(tripEventsElement, new SortView().getElement(), RenderPosition.BEFOREEND);
render(tripEventsElement, new EditEventView(events[0]).getElement(), RenderPosition.BEFOREEND);
render(tripEventsElement, new DayView(events).getElement(), RenderPosition.BEFOREEND);
