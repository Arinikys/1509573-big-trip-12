import {createMenuControlsTemplate} from "./view/site-menu.js";
import {createTripInfoTemplate} from "./view/trip-info.js";
import {createFiltersTemplate} from "./view/filter.js";
import {createSortTemplate} from "./view/sort.js";
import {createDayTemplate} from "./view/day.js";
import {createEditEventTemplate} from "./view/edit-event-form.js";
import {generateEvent} from "./mock/event.js";

const EVENTS_COUNT = 20;

const events = new Array(EVENTS_COUNT).fill().map(generateEvent);

events.sort((a, b) => {
  const dateA = new Date(a.startDate);
  const dateB = new Date(b.startDate);
  return dateA - dateB;
});


const renderView = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const tripMainElement = document.querySelector(`.trip-main`);
renderView(tripMainElement, createTripInfoTemplate(), `afterbegin`);

const tripControlElement = tripMainElement.querySelector(`.trip-main__trip-controls`);
const tripControlMenuTitleElement = tripMainElement.querySelector(`.trip-main__trip-controls-menu-title`);
renderView(tripControlMenuTitleElement, createMenuControlsTemplate(), `afterend`);
renderView(tripControlElement, createFiltersTemplate(), `beforeend`);

const tripEventsElement = document.querySelector(`.trip-events`);
renderView(tripEventsElement, createSortTemplate(), `beforeend`);
renderView(tripEventsElement, createEditEventTemplate(events[0]), `beforeend`);

renderView(tripEventsElement, createDayTemplate(events), `beforeend`);
