import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Faq } from "@/components/Faq";
import { ToolWorkspace } from "@/components/ToolWorkspace";
import { getTool } from "@/lib/config";
import { LANDINGS, getLanding } from "@/lib/landings";

export function generateStaticParams() {
  return LANDINGS.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const landing = getLanding(slug);
  if (!landing) return {};
  return {
    title: landing.title,
    description: landing.description,
    keywords: [...landing.keywords],
    alternates: { canonical: `/${landing.slug}` },
  };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const landing = getLanding(slug);
  if (!landing) notFound();
  const tool = getTool(landing.toolId);

  return (
    <>
      <div className="mx-auto max-w-3xl px-4 pt-10">
        <p className="text-sm leading-7 text-muted">{landing.intro}</p>
      </div>
      <ToolWorkspace toolId={landing.toolId} headline={landing.headline} />
      <Faq items={tool.faqs} />
    </>
  );
}
