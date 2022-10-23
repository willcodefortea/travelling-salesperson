import City from "./city";

type DistanceOperator = (a: City, b: City) => number;
const euclideanDistance: DistanceOperator = (a: City, b: City) =>
  Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

let distanceMatrix: number[][] = [];
const buildDistanceMatrix = (
  cities: City[],
  distanceOperator: DistanceOperator
) => {
  const matrix = cities.map(() => [...Array(cities.length)]);
  cities.forEach((city) =>
    cities.forEach((otherCity) => {
      matrix[city.id][otherCity.id] = distanceOperator(city, otherCity);
    })
  );

  return matrix;
};

class Trip {
  cities: City[];
  distance: number;

  constructor(cities: City[]) {
    this.cities = cities;

    if (cities.length < 2) {
      throw new Error("Trips must be at least 2 cities long");
    }

    this.distance = this.calculateDistance();
  }

  calculateDistance(
    distanceOperator: DistanceOperator = euclideanDistance
  ): number {
    if (distanceMatrix.length === 0) {
      distanceMatrix = buildDistanceMatrix(this.cities, distanceOperator);
    }

    const lastStopDistance =
      distanceMatrix[this.cities[0].id][this.cities[this.cities.length - 1].id];
    return this.cities.slice(0, -1).reduce((acc, city, idx) => {
      return distanceMatrix[city.id][this.cities[idx + 1].id] + acc;
    }, lastStopDistance);
  }

  objectiveFunction() {
    return this.distance;
  }
}

export default Trip;
