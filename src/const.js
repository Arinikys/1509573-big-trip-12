export const TRIP_EVENT = [
  {
    name: `Taxi`,
    type: `transfer`
  },
  {
    name: `Bus`,
    type: `transfer`
  },
  {
    name: `Train`,
    type: `transfer`
  },
  {
    name: `Ship`,
    type: `transfer`
  },
  {
    name: `Transport`,
    type: `transfer`
  },
  {
    name: `Drive`,
    type: `transfer`
  },
  {
    name: `Flight`,
    type: `transfer`
  },
  {
    name: `Check-in`,
    type: `activity`
  },
  {
    name: `Sightseeing`,
    type: `activity`
  },
  {
    name: `Restaurant`,
    type: `activity`
  }
];

export const UserAction = {
  UPDATE_EVENT: `UPDATE_EVENT`,
  ADD_EVENT: `ADD_EVENT`,
  DELETE_EVENT: `DELETE_EVENT`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  INIT: `INIT`
};

export const FilterType = {
  EVERYTHING: `Everything`,
  FUTURE: `Future`,
  PAST: `Past`,
};

export const MenuItem = {
  ADD_NEW_TASK: `ADD_NEW_TASK`,
  EVENTS: `EVENTS`,
  STATISTICS: `STATISTICS`
};
