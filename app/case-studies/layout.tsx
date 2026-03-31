import Navigation from "@/components/Navigation";

export const metadata = {
  title: "Case Studies — Anthony Carl",
  description:
    "Deep-dive architecture breakdowns of Atlas, Media Operations, and Agency Transformation — AI systems built by Anthony Carl.",
};

export default function CaseStudiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <main>{children}</main>
    </>
  );
}
