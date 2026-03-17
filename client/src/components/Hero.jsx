import { motion } from "framer-motion";
import { Camera, Sparkles } from "lucide-react";

const copy = [
  "Before Galaxy 2026 turns into a memory, I wanted to keep a part of VSSUT that photos alone can never hold. If we shared lectures, labs, projects, hostel nights, campus walks, fests, deadlines, or simple everyday moments, leave me something to remember you by.",
  "Write a message, a memory, a roast, a confession, an inside joke, or a few honest words you never said out loud.",
  "When the night ends and everyone moves on, I want to return to these voices and remember what this chapter felt like."
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 24, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

function Hero({ onOpenModal }) {
  return (
    <main className="relative isolate min-h-screen overflow-hidden lg:h-screen">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.2),transparent_35%),radial-gradient(circle_at_top_right,rgba(251,146,60,0.16),transparent_30%),linear-gradient(145deg,#030303_15%,#0d0a09_42%,#140f0d_68%,#040404_100%)]" />
      <motion.div
        className="absolute -left-24 top-[-10%] h-72 w-72 rounded-full bg-amber-300/18 blur-3xl md:h-96 md:w-96"
        animate={{ x: [0, 40, -10, 0], y: [0, 35, 10, 0], scale: [1, 1.1, 0.96, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-8%] right-[-5%] h-80 w-80 rounded-full bg-orange-200/12 blur-3xl md:h-120 md:w-120"
        animate={{ x: [0, -30, 20, 0], y: [0, -30, 10, 0], scale: [1, 0.94, 1.08, 1] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="grain-overlay absolute inset-0 opacity-30" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-5 py-10 sm:px-8 sm:py-12 lg:h-screen lg:px-12 lg:py-8">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-3xl lg:max-w-2xl"
          >
            <motion.div
              variants={item}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200/15 bg-white/5 px-4 py-2 text-[10px] tracking-[0.35em] text-amber-100/80 uppercase backdrop-blur-md sm:text-[11px]"
            >
              <Sparkles className="h-3.5 w-3.5" />
              VSSUT Farewell Scrapbook
            </motion.div>

            <motion.h1
              variants={item}
              className="font-display max-w-2xl text-5xl leading-none text-stone-50 sm:text-6xl md:text-7xl lg:text-[6.1rem]"
            >
              Galaxy 2026
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-5 max-w-2xl text-sm font-light tracking-[0.24em] text-amber-100/60 uppercase sm:text-base lg:text-[0.95rem]"
            >
              Messages. Memories. Roasts. The moments I never want to lose.
            </motion.p>

            <motion.div
              variants={container}
              className="mt-6 space-y-3 text-sm leading-7 text-stone-300/88 sm:text-base sm:leading-8 md:max-w-2xl lg:mt-7 lg:space-y-4 lg:text-[1.02rem] lg:leading-8"
            >
              {copy.map((paragraph) => (
                <motion.p key={paragraph} variants={item}>
                  {paragraph}
                </motion.p>
              ))}
            </motion.div>

            <motion.div variants={item} className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center lg:mt-9">
              <button
                type="button"
                onClick={onOpenModal}
                className="group inline-flex items-center justify-center gap-3 rounded-full border border-amber-200/30 bg-gradient-to-r from-amber-200 via-amber-300 to-orange-300 px-6 py-3 text-sm font-semibold text-stone-950 shadow-[0_0_35px_rgba(251,191,36,0.32)] transition duration-300 hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(251,191,36,0.4)]"
              >
                <Camera className="h-4 w-4 transition duration-300 group-hover:rotate-6" />
                Leave a Memory
              </button>
              <div className="flex items-center gap-3 text-sm text-stone-400">
                <span className="h-px w-12 bg-linear-to-r from-amber-300/0 via-amber-300/60 to-amber-300/0" />
                Crafted for one unforgettable goodbye
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.45 }}
            className="relative mx-auto w-full max-w-md lg:max-w-[34rem]"
          >
            <div className="absolute inset-0 rounded-4xl bg-linear-to-br from-amber-200/12 via-transparent to-orange-100/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-white/6 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-5 lg:p-5">
              <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(255,255,255,0.13),transparent_28%,transparent_70%,rgba(251,191,36,0.08))]" />
              <div className="relative aspect-[4/4.8] overflow-hidden rounded-[1.6rem] border border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(251,191,36,0.18),transparent_26%),radial-gradient(circle_at_80%_10%,rgba(255,237,213,0.14),transparent_25%),linear-gradient(180deg,rgba(24,24,27,0.92),rgba(10,10,10,0.98))] p-4 sm:p-5">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-22 blur-[1px]" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.16),rgba(10,10,10,0.76))]" />
                <div className="relative flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.35em] text-amber-100/60">
                        Memory Frame
                      </p>
                      <p className="mt-2 font-display text-2xl text-stone-50 sm:text-3xl">
                        VSSUT, in one quiet glow
                      </p>
                    </div>
                    <div className="rounded-full border border-amber-200/20 bg-black/20 px-3 py-1 text-[10px] tracking-[0.3em] text-amber-100/70 uppercase">
                      2026
                    </div>
                  </div>

                  <div className="space-y-3 rounded-3xl border border-white/10 bg-black/25 p-4 backdrop-blur-md sm:p-5">
                    <p className="text-sm leading-6 text-stone-200/85 sm:leading-7">
                      "Some places become beautiful because of the people attached to them. For me, VSSUT will always sound like your laughter, your chaos, and the years we grew through together."
                    </p>
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-stone-400 sm:text-xs sm:tracking-[0.3em]">
                      <span>Golden Hour Note</span>
                      <span>Farewell 2026</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

export default Hero;
