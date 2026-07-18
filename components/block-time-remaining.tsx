"use client";

import { useState, useEffect, useRef } from "react";

// From https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval(callback: () => unknown, delay: number) {
  const savedCallback = useRef(callback);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

interface BlockTimeRemainingProps {
  currentTimeStr: string;
  sessionEndTimeStr: string;
  alwaysActive: boolean;
}

export default function BlockTimeRemaining({
  currentTimeStr,
  sessionEndTimeStr,
  alwaysActive,
}: BlockTimeRemainingProps) {
  const [currentTime, setCurrentTime] = useState(
    Temporal.PlainTime.from(currentTimeStr),
  );
  useInterval(() => {
    setCurrentTime(currentTime.add({ seconds: 1 }));
  }, 1000);

  if (alwaysActive) {
    return <div>Always Active</div>;
  } else {
    const sessionEndTime = Temporal.PlainTime.from(sessionEndTimeStr);
    const timeRemaining = currentTime.until(sessionEndTime);
    return (
      <div>
        {`${timeRemaining.hours.toString().padStart(2, "0")}:${timeRemaining.minutes.toString().padStart(2, "0")}:${timeRemaining.seconds.toString().padStart(2, "0")} remaining`}
      </div>
    );
  }
}
