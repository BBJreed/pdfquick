export function Faq({
  items,
}: {
  items: readonly { q: string; a: string }[];
}) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <h2 className="font-serif text-3xl text-ink">Questions</h2>
      <dl className="mt-8 space-y-6">
        {items.map((item) => (
          <div key={item.q} className="border-b border-line pb-6">
            <dt className="font-medium text-ink">{item.q}</dt>
            <dd className="mt-2 text-sm leading-6 text-muted">{item.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
