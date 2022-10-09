import LocalSearch from "./localSearch";
import Move from "./move";
import Solution from "./solution";

class Optimize {
  move: Move;
  search: LocalSearch;

  constructor(move: Move, search: LocalSearch) {
    this.move = move;
    this.search = search;
  }

  run(solution: Solution, shouldStop: () => boolean) {
    let current = solution.copy();

    while (!shouldStop()) {
      const candidate = this.move.apply(current);
      current = this.search.accept(candidate);
    }

    return current;
  }
}

export default Optimize;
