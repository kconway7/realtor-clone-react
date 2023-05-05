import React from "react";
import spinner from "../../src/assets/spinner.svg";

export default function () {
  return (
    <div className="bg-black bg-opacity-40 flex items-center justify-center fixed left-0 right-0 bottom-0 top-0 z-50">
      <div>
        <img src={spinner} alt="Loading..." className="h-24" />
      </div>
    </div>
  );
}
