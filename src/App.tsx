import React from "react";
import "./App.css";
import { Router, Route, Switch } from "react-router";
import { routerHistory, routes } from "./route";

const App: React.FC = () => {
  return (
    <div className="App">
      <Router history={routerHistory}>
        <Switch>
          {routes.map(([path, component], index) => (
            <Route {...{ path, component }} key={index} />
          ))}
        </Switch>
      </Router>
    </div>
  );
};

export default App;
