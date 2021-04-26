import { Input } from "antd";
import React, { useState } from "react";
import { getPasswordNumberArray } from "../../utils/common";

export interface IPasswordInputProp {
  value?: number[];
  onChange?: (password: number[]) => void;
}

export const PasswordInput: React.FC<IPasswordInputProp> = ({ onChange }) => {
  const [password, setPassword] = useState("");
  return (
    <Input
      value={password}
      type="password"
      onChange={async (e) => {
        const userInputPassword = e.target.value;
        const newPassword = await getPasswordNumberArray(userInputPassword);
        setPassword(userInputPassword);
        onChange?.(newPassword);
      }}
    ></Input>
  );
};
