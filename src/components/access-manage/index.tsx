import { Button } from "antd";
import React from "react";
import { useService } from "../../utils/hooks";
import { AccessManageService } from "./service";

export const AccessManage: React.FC = () => {
  const service = useService(AccessManageService);
  return (
    <Button onClick={service.handleLogout} type="link" danger>
      退出登录
    </Button>
  );
};
