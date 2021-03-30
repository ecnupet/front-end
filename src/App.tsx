import React, { useEffect } from "react";
import "./App.css";
import { Router, Route, Switch } from "react-router";
import { routerHistory, routes } from "./routes";
import { routeGuard } from "./services/route-guard";
import { changeTitle } from "./utils/ui/title";

const App: React.FC = () => {
  useEffect(() => {
    changeTitle();
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
