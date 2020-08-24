import {getRandomInteger} from "./common";

export const getEndTime = (startTime, duration)=> {
  const endTime = new Date(startTime);
  endTime.setMinutes(endTime.getMinutes() + duration.minute);
  endTime.setHours(endTime.getHours() + duration.hour);
  return endTime;
};


export const createDateArr = (events) => {
  const dateArr = [];
  for (let event of events) {
    let newDate = new Date(event.startDate);
    newDate = newDate.setHours(23, 59, 59, 999);
    if (!dateArr.includes(newDate)) {
      dateArr.push(newDate);
    }
  }
  return dateArr;
};

export const crateDateEvensList = (events, date) => {
  return events.filter((event) => event.startDate.getMonth() === date.getMonth() && event.startDate.getDate() === date.getDate());
};

const DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Cras aliquet varius magna, non porta ligula feugiat eget.
                      Fusce tristique felis at fermentum pharetra.
                      Aliquam id orci ut lectus varius viverra.
                      Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.
                      Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.
                      Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.
                      Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.
                      Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;
const MAX_DESCR_SENTENCE_COUNT = 4;
const MIN_PHOTO_COUNT = 1;
const MAX_PHOTO_COUNT = 10;

export const generateDescription = () => {
  const sentences = DESCRIPTION.split(`.`);
  let text = ``;
  for (let i = 0; i < getRandomInteger(0, MAX_DESCR_SENTENCE_COUNT); i++) {
    text += sentences[getRandomInteger(0, sentences.length - 1)] + `. `;
  }
  return text;
};

export const generatePhotos = () => {
  let photos = [];
  for (let i = 0; i < getRandomInteger(MIN_PHOTO_COUNT, MAX_PHOTO_COUNT); i++) {
    photos.push(`http://picsum.photos/248/152?r=${Math.random()}`);
  }
  return photos;
};
