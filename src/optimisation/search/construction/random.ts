import Trip from "../../entities/trip";
import { shuffle } from "../../utils";
import Move from "../move";
import Solution from "../solution";

/**
 * Radom construction.
 *
 * Generates a purely random solution.
 */
const RandomConstruction: Move = {
  apply: (solution: Solution) => {
    const randomTrip = new Trip(shuffle(solution.cities));
    return new Solution(solution.cities, randomTrip);
  },
};

export default RandomConstruction;
