import City from "../entities/city";
import { ATT_48_CITIES } from "../resources/att48";
import RandomConstruction from "./construction/random";
import Move from "./move";
import Solution from "./solution";
import { StoppingCriterion } from "./stoppingCriterion";

class Runner {
  run(
    cities: City[] = ATT_48_CITIES,
    construction = RandomConstruction,
    shouldStop: StoppingCriterion,
    move: Move,
    initialSolution?: Solution
  ) {
    const emptySolution = Solution.default(cities);
    let bestSolution = initialSolution || construction.apply(emptySolution);

    while (!shouldStop()) {
      const candidateSolution = move.apply(bestSolution);
      if (candidateSolution.cost() < bestSolution.cost()) {
        bestSolution = candidateSolution;
      }
    }

    return bestSolution;
  }
}

export default Runner;
