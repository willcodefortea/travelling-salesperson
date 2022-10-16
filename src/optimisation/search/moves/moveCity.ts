import Move from "../move";
import { randomInt } from "./utils";

const moveCity: Move = {
  apply(solution) {
    const a = randomInt(solution.cities.length);
    const b = randomInt(solution.cities.length); // may pick the same index!

    return solution.moveSubRoute(a, b, 1);
  },
};

export default moveCity;
