import BatchManager from "./BatchManager.mjs";
import GeoTracker from "./GeoTracker.mjs";

export default class TrackingManager {
  GeoTracker;
  BatchManager;

  constructor() {
    this.BatchManager = new BatchManager();
    this.GeoTracker = new GeoTracker(this.BatchManager);
  }

  startTracking() {
    const geoJsonPoint = this.GeoTracker.start();
    this.BatchManager.addPoint(geoJsonPoint);
  }

  
}
