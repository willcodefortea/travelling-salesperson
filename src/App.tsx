import React, { useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import City from "./optimisation/entities/city";
import { ATT_48_CITIES, BEST_TOUR } from "./optimisation/resources/att48";
import Runner from "./optimisation/search/runner";
import Solution from "./optimisation/search/solution";

const BEST_SOLUTION = Solution.default(
  BEST_TOUR.map((idx) => ATT_48_CITIES[idx - 1])
);

const App = () => {
  const [solution, setSolution] = useState(BEST_SOLUTION);

  const getKey = (city: City) => `city-${city.x}-${city.y}`;

  const nodes = solution.trip.cities.map((city, idx) => ({
    data: { id: getKey(city), label: idx.toString() },
    position: { x: city.x / 5, y: (city.y * -1) / 5 },
  }));

  const edges = solution.trip.cities.slice(0, -1).map((_, idx) => ({
    data: {
      source: getKey(solution.trip.cities[idx]),
      target: getKey(solution.trip.cities[idx + 1]),
    },
  }));

  const elements = [...nodes, ...edges];

  const layout = {
    name: "preset",
    padding: 50,
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
        <button
          onClick={() => {
            const runner = new Runner();
            const solution = runner.run();
            setSolution(solution);
          }}
        >
          Randomise
        </button>
        <button
          onClick={() => {
            setSolution(BEST_SOLUTION);
          }}
        >
          Show Best
        </button>
        <div className="mt-1">
          <span>Trip Cost: {solution.trip.distance.toFixed(0)}</span>
        </div>
      </div>
    </div>
  );
};

export default App;
