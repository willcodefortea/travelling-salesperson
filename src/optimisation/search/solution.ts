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
}

export default Solution;
