import React from "react";
import { Button } from "antd";
import { AboutService } from "./service";
import classes from "./style.module.css";
import { globalStore } from "../../store";
import { observer } from "mobx-react";
import { handleAddGlobalCount } from "../home/service";
import { createService } from "../../utils/services/factory";
import { Counter } from "../../components/counter";

@observer
export class AboutPage extends React.Component {
  service = createService(AboutService);

  render() {
    return (
      <>
        <div className={classes.title}>About</div>
        <Button onClick={this.service.handleJump}>To Home</Button>
        <Counter
          name="Global Count"
          addCount={handleAddGlobalCount}
          count={globalStore.counter.count}
        ></Counter>
        <Counter
          name="Self Count"
          addCount={this.service.handleAddSelfCount}
          count={this.service.selfCount}
        ></Counter>
      </>
    );
  }
}
