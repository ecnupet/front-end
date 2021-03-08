import React from "react";
import { Button } from "antd";
import { handleAddGlobalCount, handleJump, HomeService } from "./service";
import classes from "./style.module.css";
import { useService } from "../../utils/hooks/service-hook";
import { globalStore } from "../../store";
import { observer } from "mobx-react";
import { Counter } from "../../components/counter";

export const HomePage: React.FC = observer(() => {
  const service = useService(HomeService);
  return (
    <>
      <div className={classes.title}>Home</div>
      <Button onClick={handleJump}>To Home</Button>
      <Counter
        name="Global Count"
        addCount={handleAddGlobalCount}
        count={globalStore.counter.count}
      ></Counter>
      <Counter
        name="Self Count"
        addCount={service.handleAddSelfCount}
        count={service.selfCount}
      ></Counter>
    </>
  );
});
