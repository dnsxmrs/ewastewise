import Hero from "@/components/Hero";
import About from "@/components/About";
import EducationHub from "@/components/EducationHub";
import InteractiveTools from "@/components/InteractiveTools";
import Locator from "@/components/Locator";
import Community from "@/components/Community";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-[#080C10]">
      <Hero />
      <About />
      <EducationHub />
      <InteractiveTools />
      <Locator />
      <Community />
    </main>
  );
}
