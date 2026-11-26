import Image from "next/image";
import { SignLink, Wordmark } from "@/components/site/sign";

export const metadata = { title: "The Kitchen" };

const day = [
  ["05:00", "Vizhinjam harbour", "Joseph picks the catch off the boats and it drives up overnight in ice."],
  ["07:00", "Masala room", "Fourteen masalas roasted and ground. The kitchen smells like a wedding."],
  ["09:30", "Prep", "Coconuts scraped, shallots peeled, appam batter set to ferment."],
  ["11:40", "The board", "Chef Vikram chalks up the catch. Prices go on in pencil first."],
  ["12:00", "Lunch", "Thalis on the verandah. The last one usually goes at two."],
  ["19:00", "Service", "Tandoor at full heat, chattis on charcoal, the pass gets loud."],
  ["23:30", "Last orders", "The board gets wiped. Staff meal is whatever ran out last."],
];

const people = [
  { n: "Vikram Menon", r: "Head Chef & Co-Owner", from: "Thalassery", note: "Measures everything so it tastes like his grandmother didn't." },
  { n: "Fatima Sheikh", r: "Sous Chef · Curry Station", from: "Kozhikode", note: "Runs the clay pots. Nobody else is allowed to touch the moilee." },
  { n: "Ramesh Gowda", r: "Tandoor Master", from: "Mandya", note: "Twenty-two years on the tandoor. Can tell a seekh is done by sound." },
  { n: "Lakshmi Iyer", r: "Head of Pastry", from: "Chennai", note: "The filter coffee sundae was a staff-meal joke that got out of hand." },
  { n: "Tenzin Dorje", r: "Bar Director", from: "Darjeeling", note: "Ferments the kokum shrub himself. Ask him about toddy." },
  { n: "Ananya Rao", r: "General Manager", from: "Bengaluru", note: "Reads every guest note. Yes, every single one." },
];

const sources = [
  ["Seer, prawns, mussels", "Vizhinjam harbour, Kerala", "Daily, overnight"],
  ["Kaima & matta rice", "Thalassery Rice Mills", "Every fortnight"],
  ["Black pepper & kodampuli", "A family farm in Wayanad", "Each season"],
  ["Coconut & coconut oil", "Kerala Coconut Co-op", "Twice a week"],
  ["Paneer, ghee, butter", "Nandini Dairy", "Every morning"],
  ["Vegetables & greens", "Hosur Farm Collective", "Every morning"],
];

export default function StoryPage() {
  return (
    <>
      <header className="relative overflow-hidden bg-[#0b111e] text-[#faf8f4]">
        <Image
          src="/img/chef-plating.jpg"
          alt="Plating at the pass"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b111e] via-[#0b111e]/82 to-[#0b111e]/45" />

        <div className="relative mx-auto max-w-[1380px] px-4 py-16 sm:px-8 sm:py-24">
          <div className="max-w-2xl">
            <p className="wide text-[#e5bc6f]">The Kitchen</p>
            <h1 className="mt-4 text-[42px] font-extrabold leading-[1.03] tracking-[-0.04em] text-white sm:text-[64px]">
              Slow craft, fired fast.
            </h1>
            <p className="mt-5 text-[17px] leading-relaxed text-white/75">
              Twenty-two cooks, one tandoor, eleven clay chattis and a coconut-shell charcoal grill. Meet the people and growers behind every plate.
            </p>
          </div>
        </div>
      </header>

      {/* A day on 12th Main */}
      <section className="mx-auto max-w-[1380px] px-4 py-20 sm:px-8 sm:py-24">
        <p className="wide text-[#b84229]">Daily Rhythm</p>
        <h2 className="mt-3 text-[34px] font-extrabold tracking-[-0.035em] text-[#0b111e] sm:text-[48px]">
          A day on 12th Main
        </h2>

        <ol className="mt-10 divide-y divide-[#151311]/10 rounded-3xl border border-[#151311]/8 bg-white px-6 shadow-[0_20px_50px_-24px_rgba(11,17,30,0.1)] sm:px-10">
          {day.map(([t, h, b], i) => (
            <li
              key={t}
              className="grid grid-cols-1 gap-2 py-6 sm:grid-cols-[120px_220px_1fr] sm:items-center sm:gap-8"
            >
              <span
                className={
                  i === 3
                    ? "text-[28px] font-extrabold tracking-[-0.03em] text-[#b84229] tnum"
                    : "text-[28px] font-extrabold tracking-[-0.03em] text-[#0b111e] tnum"
                }
              >
                {t}
              </span>
              <span className="text-[18px] font-bold text-[#0b111e]">{h}</span>
              <p className="text-[15px] leading-relaxed text-[#5c564d]">{b}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* People */}
      <section className="hero-mesh-dark py-20 text-[#faf8f4] sm:py-24">
        <div className="mx-auto max-w-[1380px] px-4 sm:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="wide text-[#e5bc6f]">The Team</p>
              <h2 className="mt-3 text-[34px] font-extrabold tracking-[-0.035em] text-white sm:text-[48px]">
                The people behind the pass
              </h2>
            </div>
            <p className="max-w-sm text-[15px] text-white/65">
              Six of the forty-one people who make Demo Restaurant run, from the clay pots to the bar.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {people.map((p, i) => (
              <article
                key={p.n}
                className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm transition hover:border-[#e5bc6f]/35"
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className={`grid size-13 place-items-center rounded-2xl text-[18px] font-extrabold ${
                      ["bg-[#d9a03e] text-[#0b111e]", "bg-[#b84229] text-white", "bg-white text-[#0b111e]"][i % 3]
                    }`}
                  >
                    {p.n
                      .split(" ")
                      .map((x) => x[0])
                      .join("")}
                  </span>
                  <span className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-semibold text-white/65">
                    From {p.from}
                  </span>
                </div>
                <p className="mt-6 text-[22px] font-extrabold tracking-[-0.025em] text-white">{p.n}</p>
                <p className="mt-1 text-[13px] font-semibold text-[#e5bc6f]">{p.r}</p>
                <p className="mt-4 text-[14.5px] leading-relaxed text-white/75">{p.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Sources */}
      <section className="mx-auto grid max-w-[1380px] grid-cols-1 items-start gap-12 px-4 py-20 sm:px-8 sm:py-24 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="wide text-[#b84229]">Provenance</p>
          <h2 className="mt-3 text-[34px] font-extrabold tracking-[-0.035em] text-[#0b111e] sm:text-[46px]">
            Where it comes from
          </h2>
          <p className="mt-4 max-w-md text-[15.5px] leading-relaxed text-[#5c564d]">
            Sixty-two growers, fishers and mills within 400 km. We pay on time, and we name them — they&apos;re the reason the food tastes the way it does.
          </p>
          <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
            <Image src="/img/spread-top.jpg" alt="A table of dishes" fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
          </div>
        </div>

        <div className="menu-card p-6 sm:p-10 lg:col-span-7">
          <div className="text-center">
            <Wordmark className="text-[34px] text-[#0b111e]" />
            <p className="wide mt-2 text-[10.5px] text-[#787166]">Our Growers &amp; Partners</p>
          </div>
          <ul className="mt-6 divide-y divide-[#151311]/8">
            {sources.map(([what, who, when]) => (
              <li key={what} className="py-4.5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-[16.5px] font-bold text-[#0b111e]">{what}</span>
                  <span className="rounded-full bg-[#f6ebd4] px-2.5 py-0.5 text-[11px] font-bold text-[#8f560b]">
                    {when}
                  </span>
                </div>
                <p className="mt-1 text-[14px] text-[#5c564d]">{who}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <SignLink href="/menu" tone="red">Order online</SignLink>
            <SignLink href="/visit" tone="cream">Visit &amp; contact</SignLink>
          </div>
        </div>
      </section>
    </>
  );
}
