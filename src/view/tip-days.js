import AbstractView from './abstract.js';

const createTipDaysTemplate = () => {
  return (
    `<ul class="trip-days"></ul>`
  );
};

export default class TipDays extends AbstractView {
  getTemplate() {
    return createTipDaysTemplate();
  }
}
