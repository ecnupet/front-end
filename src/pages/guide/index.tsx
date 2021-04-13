import React from "react";
import { BackToHome } from "../../components/back-to-home";

export const GuidePage: React.FC = () => {
  return (
    <div>
      <iframe
        title="医院导览"
        src="/vtour/tour.html"
        style={{ width: "100%", height: "100vh" }}
      ></iframe>
      <BackToHome></BackToHome>
    </div>
  );
};
