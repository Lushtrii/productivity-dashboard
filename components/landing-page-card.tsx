import { LucideIcon } from "lucide-react";

interface LandingPageCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor: string;
}

export default function LandingPageCard({
  icon,
  title,
  description,
  iconColor,
}: LandingPageCardProps) {
  const Icon = icon;
  return (
    <div className="w-96 h-96 flex flex-col items-center border-4 rounded-3xl">
      <div className="mt-16">
        <Icon size={128} color={iconColor} />
      </div>
      <h2 className="mt-8 text-3xl font-semibold">{title}</h2>
      <p className="mt-4 text-xl">{description}</p>
    </div>
  );
}
