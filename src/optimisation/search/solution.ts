import City from "../entities/city";
import Trip from "../entities/trip";

class Solution {
  cities: City[];
  trip: Trip;

  constructor(cities: City[], trip: Trip) {
    this.cities = cities;
    this.trip = trip;
  }

  public static default(cities: City[]) {
    return new Solution(cities, new Trip(cities));
  }

  copy(): Solution {
    const trip = new Trip([...this.trip.cities]);
    return new Solution(this.cities, trip);
  }

  withNewPath(cities: City[]): Solution {
    const trip = new Trip(cities);
    return new Solution(this.cities, trip);
  }

  getPath(): City[] {
    return [...this.trip.cities];
  }

  cost() {
    return this.trip.objectiveFunction();
  }

  swap(a: number, b: number): Solution {
    const tripCities = [...this.trip.cities];
    [tripCities[b], tripCities[a]] = [tripCities[a], tripCities[b]];
    const trip = new Trip(tripCities);
    return new Solution(this.cities, trip);
  }

  twoOptSwap(a: number, b: number): Solution {
    const tripCities = [
      ...this.trip.cities.slice(0, a),
      ...this.trip.cities.slice(a, b).reverse(),
      ...this.trip.cities.slice(b),
    ];
    const trip = new Trip(tripCities);
    return new Solution(this.cities, trip);
  }

  moveSubRoute(fromIdx: number, toIdx: number, n: number): Solution {
    let newRoute = [...this.trip.cities];
    newRoute.splice(toIdx, 0, ...newRoute.splice(fromIdx, n));
    const trip = new Trip(newRoute);
    return new Solution(this.cities, trip);
  }
}

export default Solution;
