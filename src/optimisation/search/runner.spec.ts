import { ATT_48_CITIES } from "../resources/att48";
import RandomConstruction from "./construction/random";
import Runner from "./runner";
import { fixedIteration } from "./stoppingCriterion";

test("runner actually works", () => {
  const runner = new Runner();
  runner.run(
    ATT_48_CITIES,
    RandomConstruction,
    fixedIteration(0),
    RandomConstruction
  );
});
