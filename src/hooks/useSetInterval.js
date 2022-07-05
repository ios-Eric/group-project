import { useRef, useEffect, useState } from 'react';

const useSetInterval = ({ callback, delay = 10000 }) => {
  const timer = useRef(null);
  const saveCallback = useRef(callback);
  const [stopInter, setStopInter] = useState(false);

  useEffect(() => {
    saveCallback.current = callback;
  }, [callback]);

  const clearIntervalRef = () => {
    clearInterval(timer.current);
    timer.current = null;
  };

  useEffect(() => {
    function getNewCallback() {
      saveCallback.current();
    }
    if (delay !== null && delay !== 0 && !stopInter) {
      if (timer.current) clearIntervalRef();
      timer.current = setInterval(getNewCallback, delay);
      return clearIntervalRef;
    }
  }, [delay, stopInter]);

  const stopInterval = () => {
    clearIntervalRef();
    setStopInter(true);
  };

  const startInterval = () => {
    setStopInter(false);
  };

  return {
    clearIntervalRef,
    startInterval,
    stopInterval,
  };
};

export default useSetInterval;
