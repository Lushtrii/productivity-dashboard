import HabitSummary from "@/components/habit-summary";

export default function HabitTracker() {
  const sampleTitles = [
    "Sleep for 8 hours",
    "Get 10,000 steps",
    "Code for 2 hours",
    "No soda",
  ];
  const sampleIds = [
    "019f6184-a2c1-7b3c-94d0-55c1f22c378e",
    "019f6184-a2c1-7f39-815c-b89c09c4a7d8",
    "019f6184-a2c1-733b-973f-e02ddd0dcafa",
    "019f6184-a2c1-7dc7-9ac0-0f05a75747b5",
  ];
  return (
    <div className="w-1/2 p-2 flex flex-col gap-4 border-3 rounded-2xl">
      {sampleTitles.map((title, i) => (
        <HabitSummary title={title} key={sampleIds[i]} />
      ))}
    </div>
  );
}
