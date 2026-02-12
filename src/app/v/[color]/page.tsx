import { notFound } from "next/navigation";
import ColorThemeWrapper from "@/components/landing/ColorThemeWrapper";
import { colorThemes } from "@/components/landing/colorThemes";
import LandingContent from "@/components/landing/LandingContent";

export function generateStaticParams() {
  return Object.keys(colorThemes).map((color) => ({ color }));
}

export function generateMetadata({ params }: { params: { color: string } }) {
  const theme = colorThemes[params.color];
  if (!theme) return {};
  return {
    title: `MamaSign — ${theme.name} Theme`,
    description: `MamaSign landing page with ${theme.name} color theme.`,
  };
}

export default function ColorVariantPage({
  params,
}: {
  params: { color: string };
}) {
  const theme = colorThemes[params.color];
  if (!theme) notFound();

  return (
    <ColorThemeWrapper theme={theme}>
      <LandingContent />
    </ColorThemeWrapper>
  );
}
