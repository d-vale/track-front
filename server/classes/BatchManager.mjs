localStorage.setItem(this.NAME, JSON.stringify([]));

const addPoint = (geoJsonPoint) => {
  const points = JSON.parse(localStorage.getItem(this.NAME));
  points.push(geoJsonPoint);
  localStorage.setItem(this.NAME, JSON.stringify(points));
};

const getAllPoints = () => {
  return JSON.parse(localStorage.getItem(this.NAME));
};

const reset = () => {
  localStorage.setItem(this.NAME, JSON.stringify([]));
};
