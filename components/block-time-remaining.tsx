"use client";

import { useState, useEffect } from "react";

interface BlockTimeRemainingProps {
  sessionEndTimeStr: string;
  alwaysActive: boolean;
}

export default function BlockTimeRemaining({
  sessionEndTimeStr,
  alwaysActive,
}: BlockTimeRemainingProps) {
  const [currentTime, setCurrentTime] = useState(Temporal.Now.plainTimeISO());
  useEffect(() => {
    setInterval(() => {
      setCurrentTime(Temporal.Now.plainTimeISO());
    }, 1000);
  });

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
