import Move from "../move";
import Solution from "../solution";
import flipSubroutes from "./flipSubroutes";
import moveCity from "./moveCity";
import moveCityToBest from "./moveCityToBest";
import swapTwo from "./swapTwo";
import twoOpt from "./twoOptSwap";
import { randomInt } from "./utils";

const MOVES = [moveCity, swapTwo, moveCityToBest, twoOpt];

const randomMove = () => MOVES[randomInt(MOVES.length)];

const randomMover: Move = {
  apply: (solution: Solution) => {
    return randomMove().apply(solution);
  },
};

export default randomMover;
