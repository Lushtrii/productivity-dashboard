import SignIn from "@/components/sign-in";
import LandingPageCard from "@/components/landing-page-card";
import { CheckCheck, ListChecks, ShieldBan } from "lucide-react";

export default async function Home() {
  return (
    <main className="dark:bg-black h-screen">
      <section className="h-4/10 flex flex-col items-center justify-center mt-20">
        <h1 className="text-5xl">
          Everything you need to <span className="text-cyan-400">execute</span>
        </h1>
        <SignIn />
      </section>
      <section className="flex flex-wrap justify-center items-center gap-64">
        <LandingPageCard
          icon={CheckCheck}
          title="Habit Tracker"
          description="Measure what matters"
          iconColor="oklch(79.2% 0.209 151.711)"
        />
        <LandingPageCard
          icon={ListChecks}
          title="Todo List"
          description="Remember the important stuff"
          iconColor="oklch(78.9% 0.154 211.53)"
        />
        <LandingPageCard
          icon={ShieldBan}
          title="App/Site Blocker"
          description="Eliminate distractions"
          iconColor="oklch(70.4% 0.191 22.216)"
        />
      </section>
    </main>
  );
}
