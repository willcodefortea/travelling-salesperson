import City from "../entities/city";
import Trip from "../entities/trip";
import { ATT_48_CITIES } from "../resources/att48";
import { shuffle } from "../utils";
import RandomConstruction from "./construction/random";
import Move from "./move";
import twoOpt from "./moves/twoOptSwap";
import { randomInt } from "./moves/utils";
import Solution from "./solution";
import { StoppingCriterion } from "./stoppingCriterion";

class Timer {
  numIterations = 0;
  totalTime = 0;
  startTime: number;

  constructor() {
    this.startTime = new Date().getTime();
  }

  store() {
    this.numIterations++;
    this.totalTime += new Date().getTime() - this.startTime;
  }

  print() {
    console.log(
      `Total time taken ${(this.totalTime / this.numIterations).toFixed(2)}ms`
    );
  }
}

type RunnerConfig = {
  construction: Move;
  stoppingCriterion: StoppingCriterion;
  move: Move;
};

class Runner {
  run(
    cities: City[] = ATT_48_CITIES,
    config: RunnerConfig,
    initialSolution?: Solution,
    callback: (solution: Solution) => void = () => {}
  ) {
    const emptySolution = Solution.default(cities);
    let bestSolution =
      initialSolution || config.construction.apply(emptySolution);

    const timer = new Timer();

    while (!config.stoppingCriterion.shouldStop()) {
      const candidateSolution = config.move.apply(bestSolution);

      if (candidateSolution.cost() < bestSolution.cost()) {
        bestSolution = candidateSolution;
        callback(bestSolution);
      }
      timer.store();
    }

    timer.print();

    return bestSolution;
  }
}

export default Runner;
