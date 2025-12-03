import { altitudeService } from "../services/altitudeService.mjs";
import { haversine } from "../services/haversineFormula.mjs";
export default class GeoTracker {
  trackingInterval = null;
  SAMPLING_RATE = 1000;
  BatchManager;
  lastPoint = null;
  dtot = 0;

  constructor(batchManager) {
    this.BatchManager = batchManager;
  }

  start() {
    this.watch();
  }

  async watch() {
    const wgsCoordinates = await this.getCoords();

    const geoJsonPoint = await this.createGeoJsonPoint(wgsCoordinates);
    console.log(geoJsonPoint);

    this.BatchManager.addPoint(geoJsonPoint);

    this.trackingInterval = setTimeout(() => this.watch(), this.SAMPLING_RATE);
  }

  stop() {
    clearTimeout(this.trackingInterval);
  }

  async getCoords() {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve([pos.coords.longitude, pos.coords.latitude]);
        },
        (err) => {
          console.warn(`ERROR(${err.code}): ${err.message}`);
          reject();
        },
        options
      );
    });
  }

  async createGeoJsonPoint(wgsCoordinates) {
    const elevationData = await altitudeService.getAltitude(wgsCoordinates);

    const geoJsonPoint = {
      geometry: {
        type: "Point",
        coordinates: wgsCoordinates,
      },
      timestamp: Date.now(),
      altitude: elevationData.height,
    };

    return geoJsonPoint;
  }
}
