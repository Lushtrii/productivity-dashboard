import BlockSession from "@/components/block-session";
import { ActiveBlockSessionSummary } from "@/lib/definitions";

interface BlockSessionListProps {
  blocks: ActiveBlockSessionSummary[];
}

export default function BlockSessionList({ blocks }: BlockSessionListProps) {
  return (
    <section className="p-2 flex flex-col gap-4 border-3 rounded-2xl">
      <h1 className="text-2xl">Active Block Sessions</h1>
      <div className="flex flex-col gap-2">
        {blocks.map((block) => {
          return <BlockSession block={block} key={block.id} />;
        })}
      </div>
    </section>
  );
}
