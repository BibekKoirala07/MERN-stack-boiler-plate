import { Route, Routes } from "react-router-dom";
import "./App.css";
import AuthRouteGroup from "./routes/AuthRoutesGroup";
import RouteNotFound from "./routes/RouteNotFound";

function App() {
  return (
    <div>
      <Routes>
        {AuthRouteGroup()}

        <Route path="*" element={<RouteNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
