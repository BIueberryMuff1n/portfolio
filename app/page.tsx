import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ProofMetrics from "@/components/ProofMetrics";
import About from "@/components/About";
import Experience from "@/components/Experience";
import TerminalBlock from "@/components/TerminalBlock";
import Demos from "@/components/Demos";
import CaseStudies from "@/components/CaseStudies";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <ProofMetrics />
        <About />
        <Experience />
        <TerminalBlock />
        <Demos />
        <CaseStudies />
        <Skills />
        <Contact />
      </main>
    </>
  );
}
