import Navigation from "@/components/Navigation";

export default function DemosLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
}
