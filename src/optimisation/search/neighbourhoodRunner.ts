import City from "../entities/city";
import { ATT_48_CITIES } from "../resources/att48";
import { shuffle } from "../utils";
import RandomConstruction from "./construction/random";
import Move from "./move";
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

type NeighbourHoodConfig = RunnerConfig & {
  staleMoveLimit: number;
};

class NeighbourhoodRunner {
  run(
    cities: City[] = ATT_48_CITIES,
    config: NeighbourHoodConfig,
    initialSolution?: Solution,
    callback: (solution: Solution) => void = () => {}
  ) {
    const emptySolution = Solution.default(cities);
    let bestOverallSolution =
      initialSolution || config.construction.apply(emptySolution);

    let movesSinceBest = 0;
    let currentBestSolution = bestOverallSolution;

    while (!config.stoppingCriterion.shouldStop()) {
      const candidateSolution = config.move.apply(currentBestSolution);

      if (candidateSolution.cost() < currentBestSolution.cost()) {
        movesSinceBest = 0;
        currentBestSolution = candidateSolution;

        if (currentBestSolution.cost() < bestOverallSolution.cost()) {
          bestOverallSolution = currentBestSolution;
        }

        callback(currentBestSolution);
      }

      if (movesSinceBest++ >= config.staleMoveLimit) {
        currentBestSolution = this.destroySolutionSegment(currentBestSolution);
      }
    }

    return bestOverallSolution;
  }

  destroySolutionSegment(solution: Solution): Solution {
    // destroys up to half of the current solution
    const currentPath = solution.getPath();
    const a = randomInt(Math.round(currentPath.length / 2));
    const b = a + randomInt(Math.round(currentPath.length / 2));
    return solution.withNewPath([
      ...currentPath.slice(0, a),
      ...shuffle(currentPath.slice(a, b)),
      ...currentPath.slice(b),
    ]);
  }
}

export default NeighbourhoodRunner;
