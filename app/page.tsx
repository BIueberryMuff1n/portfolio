import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import TerminalBlock from "@/components/TerminalBlock";
import CaseStudies from "@/components/CaseStudies";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <About />
        <Experience />
        <TerminalBlock />
        <CaseStudies />
        <Skills />
        <Contact />
      </main>
    </>
  );
}
