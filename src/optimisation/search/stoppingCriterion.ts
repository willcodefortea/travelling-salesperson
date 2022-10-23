export type StoppingCriterion = {
  shouldStop: () => boolean;
  percentageProgress: () => number;
};

export const fixedIteration = (numIterations: number): StoppingCriterion => {
  let iterationCount = 0;
  return {
    shouldStop: () => numIterations === iterationCount++,
    percentageProgress: () => iterationCount / numIterations,
  };
};

export const fixedTime = (
  timeLimit: number,
  clock = () => new Date()
): StoppingCriterion => {
  const endTime = clock();
  endTime.setSeconds(endTime.getSeconds() + timeLimit);
  const startTime = clock().getTime();

  return {
    shouldStop: () => clock() >= endTime,
    percentageProgress: () =>
      (clock().getTime() - startTime) / (endTime.getTime() - startTime),
  };
};
