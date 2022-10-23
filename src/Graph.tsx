import React from "react";
import CytoscapeComponent from "react-cytoscapejs";
import City from "./optimisation/entities/city";
import Solution from "./optimisation/search/solution";

const Graph: React.FC<{ solution: Solution }> = ({ solution }) => {
  const getKey = (city: City) => `city-${city.id}`;

  const nodes = solution.trip.cities.map((city, idx) => ({
    data: { id: getKey(city), label: city.id.toString() },
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
  return (
    <CytoscapeComponent
      autolock={true}
      elements={elements}
      layout={layout}
      minZoom={0.1}
      maxZoom={3}
      style={{ width: "100%", height: "600px" }}
    />
  );
};

export default Graph;
