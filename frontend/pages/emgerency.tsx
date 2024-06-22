import React from "react";
import dynamic from "next/dynamic";
const ChatBox = dynamic(() => import('../components/ChatBox'), {
  ssr: false,
});
const Emergency = () => {

  return (
    <div className="h-full w-full">
      <ChatBox />
    </div>
  );
};

export default Emergency;
