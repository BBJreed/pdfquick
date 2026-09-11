import type { Metadata } from "next";
import Link from "next/link";
import { POSTS } from "@/lib/landings";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "How to merge, compress, and convert PDFs without uploading them.",
};

export default function BlogIndex() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-serif text-5xl text-ink">Guides</h1>
      <ul className="mt-10 space-y-6">
        {POSTS.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} className="group block">
              <p className="text-xs text-muted">{post.date}</p>
              <h2 className="mt-1 text-xl font-semibold text-ink group-hover:text-accent">
                {post.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">{post.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
