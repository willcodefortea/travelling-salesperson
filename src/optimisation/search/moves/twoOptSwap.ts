import Move from "../move";

const twoOptSwap = <T>(arr: T[], a: number, b: number): T[] => {
  return [...arr.slice(0, a), ...arr.slice(a, b).reverse(), ...arr.slice(b)];
};

const twoOpt: Move = {
  apply(solution) {
    const currentPath = solution.getPath();
    for (let a = 0; a < solution.cities.length - 1; a++) {
      for (let b = a + 1; b < solution.cities.length; b++) {
        const swappedPath = twoOptSwap(currentPath, a, b);
        const candidateSolution = solution.withNewPath(swappedPath);
        if (candidateSolution.cost() < solution.cost()) {
          return candidateSolution;
        }
      }
    }

    // no better solution was found
    return solution;
  },
};

export default twoOpt;
