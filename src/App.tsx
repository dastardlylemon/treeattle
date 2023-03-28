import "./App.css";
import { MantineProvider } from "@mantine/core";
import Map from "./components/Map";
import ControlPanel from "./components/ControlPanel";

function App() {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ primaryColor: "lime" }}
    >
      <div className="App">
        <ControlPanel />
        <Map />
      </div>
    </MantineProvider>
  );
}

export default App;
