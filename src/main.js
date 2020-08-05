import {createMenuControlsTemplate} from "./view/site-menu.js";
import {createTripInfoTemplate} from "./view/trip-info.js";
import {createFiltersTemplate} from "./view/filter.js";
import {createSortTemplate} from "./view/sort.js";
import {createEventTemplate} from "./view/event.js";
import {createEditEventTemplate} from "./view/edit-event-form.js";

const EVENTS_COUNT = 3;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const tripMainElement = document.querySelector(`.trip-main`);
render(tripMainElement, createTripInfoTemplate(), `afterbegin`);

const tripControlElement = tripMainElement.querySelector(`.trip-main__trip-controls`);
const tripControlMenuTitleElement = tripMainElement.querySelector(`.trip-main__trip-controls-menu-title`);
render(tripControlMenuTitleElement, createMenuControlsTemplate(), `afterend`);
render(tripControlElement, createFiltersTemplate(), `beforeend`);

const tripEventsElement = document.querySelector(`.trip-events`);
render(tripEventsElement, createSortTemplate(), `beforeend`);
render(tripEventsElement, createEditEventTemplate(), `beforeend`);

for (let i = 0; i < EVENTS_COUNT; i++) {
  render(tripEventsElement, createEventTemplate(), `beforeend`);
}
