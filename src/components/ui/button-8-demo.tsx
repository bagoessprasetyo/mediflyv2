// This is a demo of a preview
import React, { useState } from "react";
import { AnimatedTalkButton } from "@/components/ui/button-8";

const DemoOne = () => {
  return (
    <div className="flex w-full h-screen justify-center items-center bg-gray-50">
      <div className="w-80">
        <AnimatedTalkButton>
          Talk with Aira
        </AnimatedTalkButton>
      </div>
    </div>
  );
};

export default DemoOne;