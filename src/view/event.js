export const createEventTemplate = (curEvent) => {
  const {event, destinationCity, startTime, duration, price, options} = curEvent;

  const prep = event.type === 'arrival'
    ? `in`
    : `to`;

  const createOptionTemplate = (options) => {
    let optionList = ``;
    if (options.length > 0) {
      for (let option of options.slice(0, 3)) {
        optionList += `<li class="event__offer">
          <span class="event__offer-title">${option.name}</span>
          &plus; &euro; &nbsp;<span class="event__offer-price">${option.price}</span>
          </li>`;
      }
    }
    return optionList;
  };

  const optionTemplate = createOptionTemplate(options);

  return (
    `<li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">1</span>
          <time class="day__date" datetime="2019-03-18">MAR 18</time>
        </div>

        <ul class="trip-events__list">
          <li class="trip-events__item">
            <div class="event">
              <div class="event__type">
                <img class="event__type-icon" width="42" height="42" src="img/icons/${event.name.toLowerCase()}.png" alt="Event type icon">
              </div>
              <h3 class="event__title">${event.name} ${prep} ${destinationCity}</h3>

              <div class="event__schedule">
                <p class="event__time">
                  <time class="event__start-time" datetime="2019-03-18T10:30">${startTime}</time>
                  &mdash;
                  <time class="event__end-time" datetime="2019-03-18T11:00">11:00</time>
                </p>
                <p class="event__duration">${duration.hour}H ${duration.minute}M</p>
              </div>

              <p class="event__price">
                &euro;&nbsp;<span class="event__price-value">${price}</span>
              </p>

              <h4 class="visually-hidden">Offers:</h4>
              <ul class="event__selected-offers">
                ${optionTemplate}
              </ul>
              <button class="event__rollup-btn" type="button">
                <span class="visually-hidden">Open event</span>
              </button>
            </div>
          </li>
        </ul>
      </li>`
  );
};
