import { fixedIteration } from "./stoppingCriterion";

test("Fixed iterations will stop after N calls", () => {
  const singleCall = fixedIteration(1);
  expect(singleCall.shouldStop()).toBe(false);
  expect(singleCall.shouldStop()).toBe(true);
});

test("Fixed iterations will stop after N calls", () => {
  const singleCall = fixedIteration(2);
  expect(singleCall.shouldStop()).toBe(false);
  expect(singleCall.shouldStop()).toBe(false);
  expect(singleCall.shouldStop()).toBe(true);
});
