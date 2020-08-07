import {getRandomInteger} from '../utils.js';
import {OPTIONS} from '../const.js';

const TRIP_EVENT = [
  {
    name: `Taxi`,
    type: `moving`
  },
  {
    name: `Bus`,
    type: `moving`
  },
  {
    name: `Train`,
    type: `moving`
  },
  {
    name: `Ship`,
    type: `moving`
  },
  {
    name: `Transport`,
    type: `moving`
  },
  {
    name: `Drive`,
    type: `moving`
  },
  {
    name: `Flight`,
    type: `moving`
  },
  {
    name: `Check-in`,
    type: `arrival`
  },
  {
    name: `Sightseeing`,
    type: `arrival`
  },
  {
    name: `Restaurant`,
    type: `arrival`
  }
];
const DESTINATION_CITY = [`Vienna`, `Brussels`, `London`, `Budapest`, `Berlin`, `Amsterdam`, `Athens`, `Copenhagen`, `Madrid`, `Rome`, `Valletta`, `Tallinn`, `Paris`, `Stockholm`];
const MIN_PRICE = 10;
const MAX_PRICE = 200;
const DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;
const DAY_GAP = 30;

const generateOptions = (eventType) => {
  const optionCount = getRandomInteger(0, 4);
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
  for (let i = 0; i < getRandomInteger(0, 4); i++) {
    text += sentences[getRandomInteger(0, sentences.length - 1)] + `. `;
  }
  return text;
};

const generateDestinationCity = () => {
  const randomIndex = getRandomInteger(0, DESTINATION_CITY.length - 1);

  return DESTINATION_CITY[randomIndex];
};

const generateDuration = () => {
  const duration = {
    hour: getRandomInteger(0, 24),
    minute: getRandomInteger(0, 59)
  };
  return duration;
};

const generateStartTime = (gap) => {
  const min = new Date();
  const max = new Date();
  max.setDate(min.getDate() + Math.round(gap / 2));
  min.setDate(min.getDate() - Math.round(gap / 2));
  return new Date(+min + Math.random() * (max - min));
};
export const generateEvent = () => {
  return {
    event: generateEventType(),
    destinationCity: generateDestinationCity(),
    startTime: generateStartTime(15),
    duration: generateDuration(),
    price: getRandomInteger(MIN_PRICE, MAX_PRICE),
    options: generateOptions(`moving`),
    destination: {
      descr: destinationDescription(),
      photo: `http://picsum.photos/248/152?r=${Math.random()}`
    }
  };
};
