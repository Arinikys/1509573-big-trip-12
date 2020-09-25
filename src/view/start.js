import AbstractView from './abstract.js';

const createStartTemplate = () => {
  return (
    `<p class="trip-events__msg">Click New Event to create your first point</p>`
  );
};

export default class Start extends AbstractView {
  getTemplate() {
    return createStartTemplate();
  }
}
