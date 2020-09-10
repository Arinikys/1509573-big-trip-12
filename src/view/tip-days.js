import AbstractView from './abstract.js';

const createTipDaysTemplate = () => {
  return (
    `<ul class="trip-days"></ul>`
  );
};

export default class tipDays extends AbstractView {
  getTemplate() {
    return createTipDaysTemplate();
  }
}
