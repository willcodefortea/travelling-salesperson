import React, { useState } from "react";
import Graph from "./Graph";
import Trip from "./optimisation/entities/trip";
import { ATT_48_CITIES, BEST_TOUR } from "./optimisation/resources/att48";
import Solution from "./optimisation/search/solution";

import WebWorker from "./worker?worker";
import { buildMessageSender } from "./worker";
import RandomButton from "./randomButton";
import SingleMoveButton from "./singleMoveButton";
import StartSingleMoveButton from "./startSingleMoveButton";
import StartNeighbourhoodMoveButton from "./startNeighbourhoodSearchButton";

const worker = new WebWorker();
const sendWorkerMessage = buildMessageSender(worker);

export const BEST_SOLUTION = Solution.default(
  BEST_TOUR.map((idx) => ATT_48_CITIES[idx - 1])
);

interface TspConfig {
  randomEnabled: boolean;
  singleMoveEnabled: boolean;
  neighbourHoodEnabled: boolean;
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
    neighbourHoodEnabled: false,
  };
  return {
    ...defaultConfig,
    ...(window.TSP_CONFIG || {}),
  };
};

export type OptimizerState = "WORKING" | "IDLE";

const App = () => {
  const config = useConfig();
  const [optimizerState, setOptimizerState] = useState<OptimizerState>("IDLE");

  const [solution, setSolution] = useState(BEST_SOLUTION);

  worker.addEventListener(
    "message",
    (message) => {
      console.log(message.data);
      switch (message.data.type) {
        case "STOPPING": {
          setOptimizerState("IDLE");
        }
        case "SOLUTION": {
          const newSolution = new Solution(
            message.data.solution.cities,
            new Trip(message.data.solution.trip.cities)
          );
          setSolution(newSolution);
          return;
        }
      }
    },
    { once: true }
  );

  return (
    <div>
      <Graph solution={solution} />
      <div className="controls">
        {config.neighbourHoodEnabled && (
          <StartNeighbourhoodMoveButton
            state={optimizerState}
            sendWorkerMessage={sendWorkerMessage}
            solution={solution}
            setOptimizerState={setOptimizerState}
          />
        )}
        {config.singleMoveEnabled && (
          <>
            <StartSingleMoveButton
              state={optimizerState}
              sendWorkerMessage={sendWorkerMessage}
              solution={solution}
              setOptimizerState={setOptimizerState}
            />
            <SingleMoveButton
              state={optimizerState}
              sendWorkerMessage={sendWorkerMessage}
              solution={solution}
            />
          </>
        )}
        {config.randomEnabled && (
          <RandomButton
            state={optimizerState}
            sendWorkerMessage={sendWorkerMessage}
          />
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
