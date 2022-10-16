export type StoppingCriterion = () => boolean;

export const fixedIteration = (numIterations: number) => {
  let iterationCount = 0;

  return () => numIterations === iterationCount++;
};

export const fixedTime = (timeLimit: number, clock = () => new Date()) => {
  const endTime = clock();
  endTime.setSeconds(endTime.getSeconds() + timeLimit);

  return () => clock() >= endTime;
};
