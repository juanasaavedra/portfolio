interface GuideCardProps {
  title: string;
  description: string;
  subject: string;
  price: string;
}

export function GuideCard({ title, description, subject, price }: GuideCardProps) {
  return (
    <article className="flex flex-col justify-between rounded-[32px] border border-white/10 bg-black/40 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
      <header className="space-y-2">
        <span className="inline-flex rounded-full border border-brand-accent/60 bg-brand-support/20 px-3 py-1 text-xs uppercase tracking-[0.24em] text-brand-support">
          {subject}
        </span>
        <h3 className="font-display text-2xl italic text-brand-text">{title}</h3>
      </header>
      <p className="mt-3 text-sm text-brand-text/80">{description}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-brand-support">{price}</span>
        <button className="rounded-full border border-brand-support/60 bg-brand-accent px-5 py-2 text-sm font-semibold text-brand-base transition hover:bg-brand-support" type="button">
          Comprar ahora
        </button>
      </div>
    </article>
  );
}
