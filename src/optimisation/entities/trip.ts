import City from "./city";

type DistanceOperator = (a: City, b: City) => number;
const euclideanDistance: DistanceOperator = (a: City, b: City) =>
  Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

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
    return this.cities.slice(0, -1).reduce((acc, city, idx) => {
      const nextCity = this.cities[idx + 1];
      const distance = distanceOperator(city, nextCity);
      return acc + distance;
    }, 0);
  }

  objectiveFunction() {
    return this.distance;
  }
}

export default Trip;
