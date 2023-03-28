import "./App.css";
import { MantineProvider } from "@mantine/core";
import { FilterContextProvider } from "./components/FilterContext";
import Map from "./components/Map";
import ControlPanel from "./components/ControlPanel";

function App() {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ primaryColor: "lime" }}
    >
      <FilterContextProvider>
        <div className="App">
          <ControlPanel />
          <Map />
        </div>
      </FilterContextProvider>
    </MantineProvider>
  );
}

export default App;
