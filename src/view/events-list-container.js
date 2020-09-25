import AbstractView from './abstract.js';

const createEventsListContainerTemplate = () => {
  return (
    `<ul class="trip-events__list"></ul>`
  );
};

export default class EventsListContainer extends AbstractView {
  getTemplate() {
    return createEventsListContainerTemplate();
  }
}
