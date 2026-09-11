import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { POSTS, getPost } from "@/lib/landings";

export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }));
}

const BODIES: Record<string, string[]> = {
  "why-online-pdf-tools-upload-your-files": [
    "If a site can merge two PDFs, it either does the work in your browser or it does the work on a computer they own. Most of the big names pick the second option because it is easier to build and they already have servers.",
    "The cost is that your file — lease, passport scan, medical form — sits on a disk you do not control, even if they delete it later. Privacy policies are not the same as physics.",
    "PDFQuick uses pdf-lib and pdf.js in this tab. Merge, compress, split, JPG to PDF, and Word conversion happen on your machine. We never see the bytes.",
    "That also means we cannot recover a file you closed. Download it before you leave the page.",
  ],
  "merge-pdf-on-iphone-without-an-app": [
    "You do not need a $13 App Store PDF app to stick two files together.",
    "Open PDFQuick in Safari, tap Merge PDF, pick the files from Files or Photos, tap Merge, then Share the download. The work stays on the phone.",
    "If iOS warns about a large file, try Compress first. Two free tasks a day, same as desktop.",
  ],
  "compress-pdf-under-10mb": [
    "Email limits are still around 10–25 MB depending on the provider. A phone scan of a 20-page packet often lands at 40 MB.",
    "Drop the PDF on Compress, choose Medium first. If it is still over 10 MB, run High. High rasterizes pages to JPEG, so text is no longer selectable. For a one-time email that is usually fine.",
    "Nothing is uploaded. If the result is still huge, split the document and send it in two messages.",
  ],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.description };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  const body = BODIES[slug];
  if (!post || !body) notFound();

  return (
    <article className="mx-auto max-w-2xl px-4 py-16">
      <p className="text-xs text-muted">{post.date}</p>
      <h1 className="mt-2 font-serif text-4xl text-ink">{post.title}</h1>
      <div className="mt-8 space-y-4 text-sm leading-7 text-muted">
        {body.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <Link href="/merge-pdf" className="mt-10 inline-block text-sm font-medium text-accent">
        Try a tool
      </Link>
    </article>
  );
}
