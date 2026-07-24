import BlockSession from "@/components/block-session";
import { ActiveBlockSessionSummary } from "@/lib/definitions";

interface BlockSessionListProps {
  currentDateTime: Temporal.PlainDateTime;
  blocks: ActiveBlockSessionSummary[];
}

export default function BlockSessionList({
  currentDateTime,
  blocks,
}: BlockSessionListProps) {
  return (
    <section className="w-full h-full p-2 flex flex-col gap-4 border-3 rounded-2xl">
      <h1 className="text-2xl">Active Block Sessions</h1>
      <div className="flex flex-col gap-2">
        {blocks.map((block) => {
          return (
            <BlockSession
              currentDateTime={currentDateTime}
              block={block}
              key={block.id}
            />
          );
        })}
      </div>
    </section>
  );
}
