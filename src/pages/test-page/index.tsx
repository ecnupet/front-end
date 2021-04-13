import React from "react";
import { ASPForm } from "../../components/forms/asp-form";
import { GinForm } from "../../components/forms/gin-form";
export const TestPage: React.FC = () => {
  return (
    <div>
      <ASPForm></ASPForm>
      <GinForm></GinForm>
    </div>
  );
};
