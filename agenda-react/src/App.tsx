import { getEventsEndpoint } from "./backend";

function App() {
  getEventsEndpoint().then((events) => {
    for (const event of events) {
      console.log(event);
    }
  });
  return (
    <>
      <h1>Olá</h1>
    </>
  );
}

export default App;
