import { Button } from "antd";
import React from "react";

interface CounterProps {
  addCount(): void;
  name: string;
  count: number;
}

export const Counter: React.FC<CounterProps> = ({ name, addCount, count }) => (
  <>
    <div>
      {name}: {count}
    </div>
    <Button onClick={addCount}>Add {name}</Button>
  </>
);
