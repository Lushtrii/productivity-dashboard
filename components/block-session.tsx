import { ActiveBlockSessionSummary, TimeRange } from "@/lib/definitions";
import BlockTimeRemaining from "@/components/block-time-remaining";

interface BlockSessionProps {
  block: ActiveBlockSessionSummary;
}

function calculateEndTime(
  activeTimes: TimeRange[],
  activeDays: boolean[],
): Temporal.PlainTime {
  if (activeTimes === null || activeTimes.length <= 0) {
    throw Error("activeTimes must be contain at least one range");
  }

  const now = Temporal.Now.plainDateTimeISO();

  let activeMorningEndTime = Temporal.PlainTime.from("23:59:59");
  let activeRangeEndTime = null;

  for (const at of activeTimes) {
    if (
      now.toPlainTime().since(at.startTime).sign >= 0 &&
      now.toPlainTime().until(at.endTime).sign >= 0
    ) {
      activeRangeEndTime = at.endTime;
    } else if (at.startTime.equals(Temporal.PlainTime.from("00:00:00"))) {
      activeMorningEndTime = at.endTime;
    }
  }

  if (activeRangeEndTime === null) {
    throw Error("No given time range contains the current time");
  }

  // Extends the duration to the next day if the active time range is made up of two days and the next day is active
  // e.g. (22:00-23:59), (00:00-06:00) should be an 8 hour active duration
  if (
    activeRangeEndTime.equals(Temporal.PlainTime.from("23:59:59")) &&
    activeDays[now.add({ days: 1 }).dayOfWeek]
  ) {
    return activeMorningEndTime;
  } else {
    return activeRangeEndTime;
  }
}

export default function BlockSession({ block }: BlockSessionProps) {
  return (
    <div className="border rounded-md p-2">
      <span>{block.title}</span>
      {block.activeTimes.length === 1 &&
      block.activeTimes[0].startTime.toString() === "00:00:00" &&
      block.activeTimes[0].endTime.toString() === "23:59:59" ? (
        <BlockTimeRemaining sessionEndTimeStr="" alwaysActive={true} />
      ) : (
        <BlockTimeRemaining
          sessionEndTimeStr={calculateEndTime(
            block.activeTimes,
            block.activeDays,
          ).toJSON()}
          alwaysActive={false}
        />
      )}
    </div>
  );
}
