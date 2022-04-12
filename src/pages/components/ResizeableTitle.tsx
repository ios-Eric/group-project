import React from "react";
import { Resizable } from "react-resizable";

interface Iprops {
  onResize?: () => void,
  width?: number,
  onClick: (p?: any) => void,
}

const ResizeableTitle = ({ onResize, width = 100, onClick, ...restProps }: Iprops) => {
  let resizing = false;
  console.log(width, 111);
  if (!width) {
    return <th {...restProps} />
  }
  console.log(resizing, 111);
  return (
    <Resizable
      width={width || 100}
      height={100}
      onResize={onResize}
      onResizeStart={() => {
        resizing = true;
      }}
      onResizeStop={() => {
        resizing = true;
        setTimeout(() => {
          resizing = false;
        }, 100);
      }}
    >
      <th
        {...restProps}
        onClick={(...args) => {
          console.log(...args, 111);
          if (!resizing) {
            onClick(...args);
          }
        }}
      />
    </Resizable>
  );
};

export default ResizeableTitle;