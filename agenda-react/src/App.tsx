import { Button } from "@material-ui/core";
import { getEventsEndpoint } from "./backend";

function App() {
  // getEventsEndpoint().then((events) => {
  //   for (const event of events) {
  //     console.log(event);
  //   }
  // });

  //teste de botão com Material UI
  return (
    <Button color="primary" variant="contained">
      Hello World!
    </Button>
  );
}

export default App;
