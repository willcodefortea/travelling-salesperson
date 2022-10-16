import { fixedIteration } from "./stoppingCriterion";

test("Fixed iterations will stop after N calls", () => {
  const singleCall = fixedIteration(1);
  expect(singleCall()).toBe(false);
  expect(singleCall()).toBe(true);
});

test("Fixed iterations will stop after N calls", () => {
  const singleCall = fixedIteration(2);
  expect(singleCall()).toBe(false);
  expect(singleCall()).toBe(false);
  expect(singleCall()).toBe(true);
});
