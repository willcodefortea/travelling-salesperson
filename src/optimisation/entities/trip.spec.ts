import City from "./city";
import Trip from "./trip";

test("a trip with two nodes set a valid distance", () => {
  const nodeA = new City(5, 10);
  const nodeB = new City(8, 14);
  const trip = new Trip([nodeA, nodeB]);
  expect(trip.distance).toBe(5);
});
