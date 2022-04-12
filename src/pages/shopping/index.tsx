import React from "react";

const Shopping = () => {
  return (
    <div>
      这是shopping
      <svg width="100" height="100">
        <defs>
          <radialGradient id="grey_blue" cx="50%" cy="50%" r="100%"
            fx="50%" fy="50%">
            <stop offset="0%" stopColor='rgba(255,255,255, 0.3)' />
            <stop offset="50%" stopColor='rgba(133,0,200,0.2)' />
            <stop offset="100%" stopColor='rgba(255,255,255, 0.3)' />
          </radialGradient>
        </defs>
        <path
          d="M50, 50 m-50, 0 a25,25 0 1,0 100,0 a25,25 0 1,0 -100,0 Z"
          stroke='rgba(133,0,200,0.1)'
          fill="url(#grey_blue)"
        ></path>
      </svg>
    </div>
  )
};

export default Shopping;
