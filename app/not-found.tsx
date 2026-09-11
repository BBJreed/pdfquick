import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="font-serif text-5xl text-ink">Missing page</h1>
      <p className="mt-3 text-muted">That URL is not a tool.</p>
      <Link href="/" className="mt-6 inline-block text-sm font-medium text-accent">
        Back to PDFQuick
      </Link>
    </div>
  );
}
