import { OptimizerState } from "./App";
import { buildMessageSender } from "./worker";

const RandomButton: React.FC<{
  state: OptimizerState;
  sendWorkerMessage: ReturnType<typeof buildMessageSender>;
}> = ({ state, sendWorkerMessage }) => {
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

  return (
    <button disabled={state === "WORKING"} onClick={generateRandomSolution}>
      Randomise / Reset
    </button>
  );
};

export default RandomButton;
