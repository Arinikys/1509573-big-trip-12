import {getRandomInteger} from '../utils/common.js';
import {OPTIONS, TRIP_EVENT, DESTINATION_CITY} from '../const.js';

const MIN_PRICE = 10;
const MAX_PRICE = 200;
const DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Cras aliquet varius magna, non porta ligula feugiat eget.
                      Fusce tristique felis at fermentum pharetra.
                      Aliquam id orci ut lectus varius viverra.
                      Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.
                      Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.
                      Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.
                      Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.
                      Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;
const DAY_GAP = 15;
const MAX_HOURS = 24;
const MAX_MINUTES = 59;
const MIN_OPTION = 0;
const MAX_OPTION = 4;
const MIN_PHOTO_COUNT = 1;
const MAX_PHOTO_COUNT = 10;
const MAX_DESCR_SENTENCE_COUNT = 4;

const generateOptions = (eventType) => {
  const optionCount = getRandomInteger(MIN_OPTION, MAX_OPTION);
  const optionSet = new Set();
  do {
    const curOptionNum = getRandomInteger(0, OPTIONS.length - 1);
    if (OPTIONS[curOptionNum].eventType === eventType) {
      optionSet.add(curOptionNum);
    }
  } while (optionSet.size < optionCount);
  const optionsList = [];
  for (let item of optionSet) {
    optionsList.push(OPTIONS[item]);
  }
  return optionsList;
};

const generateEventType = () => {
  const randomIndex = getRandomInteger(0, TRIP_EVENT.length - 1);

  return TRIP_EVENT[randomIndex];
};

const destinationDescription = () => {
  const sentences = DESCRIPTION.split(`.`);
  let text = ``;
  for (let i = 0; i < getRandomInteger(0, MAX_DESCR_SENTENCE_COUNT); i++) {
    text += sentences[getRandomInteger(0, sentences.length - 1)] + `. `;
  }
  return text;
};

const generateDestinationCity = () => {
  const randomIndex = getRandomInteger(0, DESTINATION_CITY.length - 1);

  return DESTINATION_CITY[randomIndex];
};

const generateDuration = () => {
  return {
    hour: getRandomInteger(0, MAX_HOURS),
    minute: getRandomInteger(0, MAX_MINUTES)
  };
};

const generateStartDate = () => {
  const min = new Date();
  const max = new Date();
  max.setDate(min.getDate() + Math.round(DAY_GAP / 2));
  min.setDate(min.getDate() - Math.round(DAY_GAP / 2));
  return new Date(+min + Math.random() * (max - min));
};

const generatePhotos = () => {
  let photos = [];
  for (let i = 0; i < getRandomInteger(MIN_PHOTO_COUNT, MAX_PHOTO_COUNT); i++) {
    photos.push(`http://picsum.photos/248/152?r=${Math.random()}`);
  }
  return photos;
};

const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

export const generateEvent = () => {
  return {
    event: generateEventType(),
    destinationCity: generateDestinationCity(),
    startDate: generateStartDate(),
    duration: generateDuration(),
    price: getRandomInteger(MIN_PRICE, MAX_PRICE),
    options: generateOptions(`transfer`),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    destination: {
      descr: destinationDescription(),
      photo: generatePhotos()
    },
    id: generateId()
  };
};
