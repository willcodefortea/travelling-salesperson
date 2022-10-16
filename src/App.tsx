import React, { useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import City from "./optimisation/entities/city";
import { ATT_48_CITIES, BEST_TOUR } from "./optimisation/resources/att48";
import minimumSpanningTree from "./optimisation/search/construction/minimumSpanningTree";
import RandomConstruction from "./optimisation/search/construction/random";
import moveCity from "./optimisation/search/moves/moveCity";
import randomMover from "./optimisation/search/moves/randomMover";
import swapTwo from "./optimisation/search/moves/swapTwo";
import Runner from "./optimisation/search/runner";
import Solution from "./optimisation/search/solution";
import {
  fixedIteration,
  fixedTime,
} from "./optimisation/search/stoppingCriterion";

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

  const getKey = (city: City) => `city-${city.x}-${city.y}`;

  const nodes = solution.trip.cities.map((city, idx) => ({
    data: { id: getKey(city), label: idx.toString() },
    position: { x: city.x / 5, y: (city.y * -1) / 5 },
  }));

  const edges = solution.trip.cities.map((_, idx) => ({
    data: {
      source: getKey(solution.trip.cities[idx]),
      target: getKey(
        solution.trip.cities[(idx + 1) % solution.trip.cities.length]
      ),
    },
  }));

  const elements = [...nodes, ...edges];

  const layout = {
    name: "preset",
    padding: 50,
  };

  const bulkMoveHandler = async () => {
    const runner = new Runner();
    const initialSolution = solution === BEST_SOLUTION ? undefined : solution;
    setOptimizerState("WORKING");

    return new Promise<Solution>((resolve) => {
      const newSolution = runner.run(
        ATT_48_CITIES,
        RandomConstruction,
        fixedIteration(1000),
        moveCity,
        initialSolution
      );
      setSolution(newSolution);
      setOptimizerState("IDLE");
    });
  };

  const singleMoveHandler = async () => {
    const runner = new Runner();
    const initialSolution = solution === BEST_SOLUTION ? undefined : solution;
    setOptimizerState("WORKING");

    return new Promise<Solution>((resolve) => {
      const newSolution = runner.run(
        ATT_48_CITIES,
        RandomConstruction,
        fixedIteration(1),
        moveCity,
        initialSolution
      );
      setSolution(newSolution);
      setOptimizerState("IDLE");
    });
  };

  return (
    <div>
      <CytoscapeComponent
        autolock={true}
        elements={elements}
        layout={layout}
        minZoom={0.1}
        maxZoom={3}
        style={{ width: "100%", height: "600px" }}
      />
      <div className="controls">
        {config.singleMoveEnabled && (
          <>
            <button
              disabled={optimizerState === "WORKING"}
              onClick={bulkMoveHandler}
            >
              1000 Moves
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
            onClick={() => {
              const runner = new Runner();
              const newSolution = runner.run(
                ATT_48_CITIES,
                RandomConstruction,
                fixedIteration(1),
                RandomConstruction
              );
              setSolution(newSolution);
            }}
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
