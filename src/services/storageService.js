import { getAltitude } from "../utils/getAltitude.js";

export const storageService = {
  init: (id, started_at) => {
    if (!localStorage.getItem(id)) {
      localStorage.setItem(
        id,
        JSON.stringify({ id: id, started_at: started_at, laps:[], trace: [] })
      );
    }
  },

  finish: (id, stopped_at) => {
    if (localStorage.getItem(id)) {
      let activity = JSON.parse(localStorage.getItem(id));
      activity = { ...activity, stopped_at: stopped_at };
      localStorage.setItem(id, JSON.stringify(activity));
    }
  },

  addPoint: async (point, id) => {
    let data = { height: null };

    if (navigator.onLine) {
      const result = await getAltitude(point);
      data.height = result.height;
    }

    const activity = JSON.parse(localStorage.getItem(id));

    const geoJSON = {
      geometry: {
        type: "Point",
        coordinates: point, // [longitude, latitude]
      },
      timestamp: Date.now(),
      altitude: data.height, // altitude en mètres
    };

    activity.trace.push(geoJSON);
    localStorage.setItem(id, JSON.stringify(activity));

    return data.height;
  },

  addLap: (id, lap) => {
    if (localStorage.getItem(id)) {
      let activity = JSON.parse(localStorage.getItem(id));
      activity.laps.push(lap)
      localStorage.setItem(id, JSON.stringify(activity));
    }
  },
};
