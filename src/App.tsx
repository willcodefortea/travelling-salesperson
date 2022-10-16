import React, { useState } from "react";
import Graph from "./Graph";
import Trip from "./optimisation/entities/trip";
import { ATT_48_CITIES, BEST_TOUR } from "./optimisation/resources/att48";
import Solution from "./optimisation/search/solution";

import WebWorker from "./worker?worker";
import { buildMessageSender } from "./worker";

const worker = new WebWorker();
const sendWorkerMessage = buildMessageSender(worker);

const BEST_SOLUTION = Solution.default(
  BEST_TOUR.map((idx) => ATT_48_CITIES[idx - 1])
);

interface TspConfig {
  randomEnabled: boolean;
  singleMoveEnabled: boolean;
}

declare global {
  interface Window {
    TSP_CONFIG: TspConfig;
  }
}

const useConfig = (): TspConfig => {
  const defaultConfig: TspConfig = {
    randomEnabled: false,
    singleMoveEnabled: false,
  };
  return {
    ...defaultConfig,
    ...(window.TSP_CONFIG || {}),
  };
};

const App = () => {
  const config = useConfig();
  const [optimizerState, setOptimizerState] = useState<"WORKING" | "IDLE">(
    "IDLE"
  );
  const [solution, setSolution] = useState(BEST_SOLUTION);

  worker.addEventListener(
    "message",
    (message) => {
      switch (message.data.type) {
        case "STOPPING": {
          setOptimizerState("IDLE");
        }
        case "SOLUTION": {
          setSolution(
            new Solution(
              message.data.solution.cities,
              new Trip(message.data.solution.trip.cities)
            )
          );
          return;
        }
      }
    },
    { once: true }
  );

  const generateRandomSolution = () => {
    sendWorkerMessage.setSolution({ solution: undefined });
    sendWorkerMessage.configure({
      construction: "random",
      move: "random",
      numIterations: 1,
      singleLoop: true,
    });
    sendWorkerMessage.start();
  };

  const bulkMoveHandler = () => {
    if (optimizerState === "IDLE") {
      setOptimizerState("WORKING");
      sendWorkerMessage.setSolution({
        solution: solution === BEST_SOLUTION ? undefined : solution,
      });
      sendWorkerMessage.configure({
        construction: "random",
        move: "moveCity",
        numIterations: 1000,
        singleLoop: false,
      });
      sendWorkerMessage.start();
    } else {
      setOptimizerState("IDLE");
      sendWorkerMessage.stop();
    }
  };

  const singleMoveHandler = async () => {
    sendWorkerMessage.setSolution({
      solution: solution === BEST_SOLUTION ? undefined : solution,
    });
    sendWorkerMessage.configure({
      construction: "random",
      move: "moveCity",
      numIterations: 1,
      singleLoop: true,
    });
    sendWorkerMessage.start();
  };

  return (
    <div>
      <Graph solution={solution} />
      <div className="controls">
        {config.singleMoveEnabled && (
          <>
            <button onClick={bulkMoveHandler}>
              {optimizerState === "WORKING" ? "Stop" : "Start single"}
            </button>
            <button
              disabled={optimizerState === "WORKING"}
              onClick={singleMoveHandler}
            >
              Single Move
            </button>
          </>
        )}
        {config.randomEnabled && (
          <button
            disabled={optimizerState === "WORKING"}
            onClick={generateRandomSolution}
          >
            Randomise
          </button>
        )}
        <button
          onClick={() => {
            setSolution(BEST_SOLUTION);
          }}
        >
          Show Best
        </button>
        <div className="mt-1">
          <span>
            Trip Cost: {Math.round(solution.trip.distance).toLocaleString()}
          </span>
          <br />
          <span>
            Distance from best:{" "}
            {Math.round(
              solution.trip.distance - BEST_SOLUTION.trip.distance
            ).toLocaleString()}
          </span>
          <br />
        </div>
      </div>
    </div>
  );
};

export default App;
