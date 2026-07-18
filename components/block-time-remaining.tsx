"use client";

import { useState, useEffect } from "react";

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
  useEffect(() => {
    setInterval(() => {
      setCurrentTime(currentTime.add({ seconds: 1 }));
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
