import React, { useEffect } from "react";
import "./App.css";
import { Router, Route, Switch } from "react-router";
import { routerHistory, routes } from "./route";
import { routeGuard } from "./services/route-guard";

const App: React.FC = () => {
  useEffect(() => {
    routeGuard.on();
    return routeGuard.off;
  });
  return (
    <div className="App">
      <Router history={routerHistory}>
        <Switch>
          {routes.map(([path, component], index) => (
            <Route {...{ path, component }} exact key={index} />
          ))}
        </Switch>
      </Router>
    </div>
  );
};

export default App;
