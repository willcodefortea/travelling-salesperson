import Solution from "./solution";

interface LocalSearch {
  best: Solution;

  accept: (solution: Solution) => Solution;

  /**
   * 0 if the same, -1 if candidate is smaller, 1 if candidate is higher.
   */
  compare: (current: Solution, candidate: Solution) => -1 | 0 | 1;
}

export default LocalSearch;
