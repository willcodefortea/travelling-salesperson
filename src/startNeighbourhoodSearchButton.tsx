import { BEST_SOLUTION, OptimizerState } from "./App";
import Solution from "./optimisation/search/solution";
import { buildMessageSender } from "./worker";

const StartNeighbourhoodMoveButton: React.FC<{
  state: OptimizerState;
  sendWorkerMessage: ReturnType<typeof buildMessageSender>;
  setOptimizerState: (s: OptimizerState) => void;
  solution: Solution;
}> = ({ state, sendWorkerMessage, solution, setOptimizerState }) => {
  const bulkMoveHandler = () => {
    if (state === "IDLE") {
      setOptimizerState("WORKING");
      sendWorkerMessage.setSolution({
        solution: undefined,
      });
      sendWorkerMessage.configure({
        construction: "random",
        move: "randomMover",
        numIterations: 1000,
        singleLoop: false,
        runner: "neighbourHood",
      });
      sendWorkerMessage.start();
    } else {
      setOptimizerState("IDLE");
      sendWorkerMessage.stop();
    }
  };

  return (
    <button onClick={bulkMoveHandler}>
      {state === "WORKING" ? "Stop" : "Start Neighbourhood"}
    </button>
  );
};

export default StartNeighbourhoodMoveButton;
