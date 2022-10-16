import Move from "../move";
import Solution from "../solution";
import moveCity from "./moveCity";
import swapTwo from "./swapTwo";
import { randomInt } from "./utils";

const MOVES = [moveCity, swapTwo];

const randomMove = () => MOVES[randomInt(MOVES.length)];

const randomMover: Move = {
  apply: (solution: Solution) => {
    return randomMove().apply(solution);
  },
};

export default randomMover;
