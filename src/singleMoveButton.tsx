import { BEST_SOLUTION, OptimizerState } from "./App";
import Solution from "./optimisation/search/solution";
import { buildMessageSender } from "./worker";

const SingleMoveButton: React.FC<{
  state: OptimizerState;
  sendWorkerMessage: ReturnType<typeof buildMessageSender>;
  solution: Solution;
}> = ({ state, sendWorkerMessage, solution }) => {
  const singleMoveHandler = () => {
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
    <button disabled={state === "WORKING"} onClick={singleMoveHandler}>
      Single Move
    </button>
  );
};

export default SingleMoveButton;
