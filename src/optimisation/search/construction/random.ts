import Trip from "../../entities/trip";
import Move from "../move";
import Solution from "../solution";

/**
 * Fisher-Yates Shuffle.
 */
const shuffle = (arr: Array<any>) => {
  const shuffledArray = [...arr];
  let currentIndex = arr.length;
  let randomIndex = 0;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [shuffledArray[currentIndex], shuffledArray[randomIndex]] = [
      shuffledArray[randomIndex],
      shuffledArray[currentIndex],
    ];
  }

  return shuffledArray;
};

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
