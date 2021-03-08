import React from "react";
import "./App.css";
import { Router, Route } from "react-router";
import { routerHistory, routes } from "./route";

const App: React.FC = () => {
  return (
    <div className="App">
      <Router history={routerHistory}>
        {routes.map(([path, component], index) => (
          <Route {...{ path, component }} key={index} />
        ))}
      </Router>
    </div>
  );
};

export default App;
