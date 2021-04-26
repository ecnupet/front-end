import React, { useEffect } from "react";
import { BackToHome } from "../../components/back-to-home";

const handler = (e: MessageEvent) => {
  console.log("recieve message from iframe", e.data);
};

export const GuidePage: React.FC = () => {
  useEffect(() => {
    window.addEventListener("message", handler);
    return () => {
      window.removeEventListener("message", handler);
    };
  }, []);
  return (
    <div>
      <iframe
        title="医院导览"
        src="/vtour/walkthrough.html"
        style={{ width: "100%", height: "100vh" }}
      ></iframe>
      <BackToHome></BackToHome>
    </div>
  );
};
