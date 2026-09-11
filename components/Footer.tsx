import Link from "next/link";
import { SITE, TOOLS } from "@/lib/config";

export function Footer() {
  return (
    <footer className="border-t border-line bg-card">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <p className="font-semibold text-ink">{SITE.name}</p>
          <p className="mt-2 max-w-xs text-sm leading-6 text-muted">
            PDF tools that run in your browser. We never see your files.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">Tools</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {TOOLS.map((tool) => (
              <li key={tool.id}>
                <Link href={tool.href} className="hover:text-ink">
                  {tool.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">Product</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>
              <Link href="/pricing" className="hover:text-ink">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/alternatives" className="hover:text-ink">
                vs Smallpdf
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-ink">
                Guides
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-ink">
                Privacy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} {SITE.name}. Files stay on your device.
      </div>
    </footer>
  );
}
