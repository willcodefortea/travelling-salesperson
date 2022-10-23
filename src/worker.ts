import Trip from "./optimisation/entities/trip";
import { ATT_48_CITIES } from "./optimisation/resources/att48";
import RandomConstruction from "./optimisation/search/construction/random";
import moveCity from "./optimisation/search/moves/moveCity";
import moveCityToBest from "./optimisation/search/moves/moveCityToBest";
import randomMover from "./optimisation/search/moves/randomMover";
import NeighbourhoodRunner from "./optimisation/search/neighbourhoodRunner";
import Runner from "./optimisation/search/runner";
import Solution from "./optimisation/search/solution";
import {
  fixedIteration,
  fixedTime,
} from "./optimisation/search/stoppingCriterion";

const CONSTRUCTION = {
  random: RandomConstruction,
};

const RUNNERS = {
  hillClimbing: Runner,
  neighbourHood: NeighbourhoodRunner,
};

const MOVES = {
  random: RandomConstruction,
  randomMover,
  moveCity,
  moveCityToBest,
};

type WORKER_STATE = "RUNNING" | "IDLE";

interface SetSolutionMessage {
  type: "SET_SOLUTION";
  solution?: Solution;
}

interface StartMessage {
  type: "START";
}

interface StopMessage {
  type: "STOP";
}

interface ConfigureMessage {
  type: "CONFIGURE";
  singleLoop: boolean;
  move?: keyof typeof MOVES;
  construction?: keyof typeof CONSTRUCTION;
  numIterations?: number;
  timeout?: number;
  debug?: boolean;
  runner?: keyof typeof RUNNERS;
}

type Message =
  | SetSolutionMessage
  | StartMessage
  | StopMessage
  | ConfigureMessage;

const LOOP_TIMEOUT = 1000 / 60; // max run 60 times per second
let solution: Solution | undefined;
let worker_state: WORKER_STATE = "IDLE";
let timeout: NodeJS.Timeout | undefined = undefined;

const delayLoop = () => {
  timeout = setTimeout(loop, LOOP_TIMEOUT);
};

const startWorker = () => {
  delayLoop();
  worker_state = "RUNNING";
};

const clearLoop = () => {
  if (!timeout) return;
  clearTimeout(timeout);
  timeout = undefined;
};
const stopWorker = () => {
  clearLoop();
  worker_state = "IDLE";
};

let config = {
  cities: ATT_48_CITIES,
  singleLoop: false,
  construction: CONSTRUCTION.random,
  stoppingCriterion: () => fixedTime(LOOP_TIMEOUT * 0.9),
  mover: MOVES.randomMover,
  debug: false,
  runner: Runner,
};

let noChangeCount = 0;
const NO_CHANGE_LIMIT = 10;

const loop = () => {
  if (worker_state === "IDLE") return;

  // TODO: broadcast the final solution?
  const finalSolution = new config.runner().run(
    config.cities,
    {
      construction: config.construction,
      stoppingCriterion: config.stoppingCriterion(),
      move: config.mover,
    },
    solution,
    (newSolution) => {
      solution = newSolution;
      postMessage({ type: "SOLUTION", solution: newSolution });
      noChangeCount = 0;
    }
  );

  if (config.singleLoop || noChangeCount++ > NO_CHANGE_LIMIT) {
    postMessage({ type: "STOPPING", solution: finalSolution });
    stopWorker();
    return;
  }

  delayLoop();
};

const onmessage = (e: MessageEvent<Message>) => {
  if (config.debug) console.log(`received message ${e.data.type}`);

  switch (e.data.type) {
    case "SET_SOLUTION": {
      if (e.data.solution) {
        solution = new Solution(
          e.data.solution.cities,
          new Trip(e.data.solution.trip.cities)
        );
      } else {
        solution = undefined;
      }
      return;
    }
    case "START": {
      startWorker();
      return;
    }
    case "STOP": {
      stopWorker();
      return;
    }
    case "CONFIGURE": {
      const {
        data: {
          construction,
          move,
          numIterations,
          timeout,
          singleLoop,
          debug,
          runner,
        },
      } = e;
      if (construction) config.construction = CONSTRUCTION[construction];
      if (move) config.mover = MOVES[move];
      if (numIterations)
        config.stoppingCriterion = () => fixedIteration(numIterations);
      if (timeout) config.stoppingCriterion = () => fixedTime(timeout);
      if (singleLoop !== undefined) config.singleLoop = singleLoop;
      if (debug !== undefined) config.debug = debug;
      if (runner !== undefined) config.runner = RUNNERS[runner];
      return;
    }
    default: {
      console.error(e);
    }
  }
};

export const buildMessageSender = (worker: Worker) => ({
  setSolution(message: Omit<SetSolutionMessage, "type">) {
    this.postMessage({ type: "SET_SOLUTION", ...message });
  },
  start() {
    this.postMessage({ type: "START" });
  },
  stop() {
    this.postMessage({ type: "STOP" });
  },
  configure(message: Omit<ConfigureMessage, "type">) {
    this.postMessage({ type: "CONFIGURE", ...message });
  },
  postMessage(message: Message) {
    worker.postMessage(message);
  },
});

addEventListener("message", onmessage);
