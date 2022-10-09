import City from "../entities/city";
import { ATT_48_CITIES } from "../resources/att48";
import RandomConstruction from "./construction/random";
import Solution from "./solution";

class Runner {
  run(cities: City[] = ATT_48_CITIES) {
    const emptySolution = Solution.default(cities);
    const initialSolution = RandomConstruction.apply(emptySolution);
    return initialSolution;
  }
}

export default Runner;
