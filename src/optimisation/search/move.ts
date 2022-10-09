import Solution from "./solution";

interface Move {
  /**
   * Mutate the solution, moving to a new state.
   */
  apply: (solution: Solution) => Solution;
}

export default Move;
