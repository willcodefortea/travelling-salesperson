import Move from "../move";
import { randomInt } from "./utils";

const swapTwo: Move = {
  apply(solution) {
    const a = randomInt(solution.cities.length);
    const b = randomInt(solution.cities.length); // may pick the same index!

    return solution.swap(a, b);
  },
};

export default swapTwo;
