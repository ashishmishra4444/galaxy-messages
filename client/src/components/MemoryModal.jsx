import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LoaderCircle, PenLine, Send, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createMessage } from "../utils/api";

const relationshipOptions = [
  "Branch mate",
  "Lab partner",
  "Project teammate",
  "Late-night coder",
  "Hostel wingmate",
  "Hostel roommate",
  "Event squad",
  "Campus wanderer",
  "Junior",
  "Other",
];

const initialForm = {
  name: "",
  relationship: "",
  relationshipOther: "",
  message: "",
};

function MemoryModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isRelationshipOpen, setIsRelationshipOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFormData(initialForm);
      setIsSubmitting(false);
      setStatus({ type: "", message: "" });
      setIsRelationshipOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (status.type !== "success") {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setStatus({ type: "", message: "" });
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [status]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
      ...(name === "relationship" && value !== "Other"
        ? { relationshipOther: "" }
        : {}),
    }));
  };

  const handleRelationshipSelect = (value) => {
    setFormData((current) => ({
      ...current,
      relationship: value,
      relationshipOther: value === "Other" ? current.relationshipOther : "",
    }));
    setIsRelationshipOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await createMessage(formData);
      setStatus({
        type: "success",
        message: response.message || "Memory Captured!",
      });
      setFormData(initialForm);
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.message || "Something went wrong while saving your memory.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={onClose}
            aria-label="Close modal"
          />

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/12 bg-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.58)] backdrop-blur-2xl"
          >
            <div className="absolute inset-0 bg-[linear-gradient(150deg,rgba(255,255,255,0.22),transparent_22%,transparent_72%,rgba(251,191,36,0.12))]" />
            <div className="grid relative sm:grid-cols-[0.86fr_1.14fr]">
              <div className="relative min-h-56 overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.28),_transparent_30%),linear-gradient(180deg,_rgba(18,18,18,0.85),_rgba(10,10,10,0.96))] p-6 sm:min-h-full sm:border-r sm:border-b-0 sm:p-8">
                <div className="grain-overlay absolute inset-0 opacity-35" />
                <div className="relative flex h-full flex-col justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-amber-100/70">
                      Digital Postcard
                    </p>
                    <h2 className="mt-4 font-display text-3xl text-stone-50 sm:text-4xl">
                      Leave your piece of the night.
                    </h2>
                  </div>
                  <p className="mt-6 max-w-xs text-sm leading-7 text-stone-300/85">
                    A joke, a roast, a thank you, or a memory from campus. Make
                    it feel like us.
                  </p>
                </div>
              </div>

              <div className="relative p-5 sm:p-8">
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/6 text-stone-200 transition hover:bg-white/12"
                  aria-label="Close modal"
                >
                  <X className="h-4 w-4" />
                </button>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-5 pt-10 sm:pt-4"
                >
                  <label className="block space-y-2">
                    <span className="text-xs uppercase tracking-[0.28em] text-stone-300/75">
                      Who are you?
                    </span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name (optional)"
                      maxLength={60}
                      className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-stone-100 outline-none transition placeholder:text-stone-500 focus:border-amber-200/45 focus:ring-2 focus:ring-amber-200/20"
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="text-xs uppercase tracking-[0.28em] text-stone-300/75">
                      How do I know you from VSSUT?
                    </span>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setIsRelationshipOpen((current) => !current)
                        }
                        className={`flex w-full items-center justify-between rounded-2xl border bg-black/25 px-4 py-3 text-left text-sm outline-none transition focus:border-amber-200/45 focus:ring-2 focus:ring-amber-200/20 ${
                          isRelationshipOpen
                            ? "border-amber-200/45 ring-2 ring-amber-200/20"
                            : "border-white/10"
                        } ${formData.relationship ? "text-stone-100" : "text-stone-500"}`}
                        aria-expanded={isRelationshipOpen}
                        aria-haspopup="listbox"
                      >
                        <span>
                          {formData.relationship || "Choose your connection"}
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 text-stone-300 transition ${
                            isRelationshipOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <input
                        type="hidden"
                        name="relationship"
                        value={formData.relationship}
                        required
                      />

                      {isRelationshipOpen ? (
                        <div
                          className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-white/10 bg-[#14110f] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
                          role="listbox"
                        >
                          {relationshipOptions.map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => handleRelationshipSelect(option)}
                              className={`w-full rounded-xl px-4 py-3 text-left text-sm transition ${
                                formData.relationship === option
                                  ? "bg-[#3a342d] text-amber-100"
                                  : "text-stone-200 hover:bg-[#24201c]"
                              }`}
                              role="option"
                              aria-selected={formData.relationship === option}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </label>

                  {formData.relationship === "Other" ? (
                    <label className="block space-y-2">
                      <span className="text-xs uppercase tracking-[0.28em] text-stone-300/75">
                        Please specify your connection
                      </span>
                      <input
                        type="text"
                        name="relationshipOther"
                        value={formData.relationshipOther}
                        onChange={handleChange}
                        required
                        maxLength={120}
                        className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-stone-100 outline-none transition placeholder:text-stone-500 focus:border-amber-200/45 focus:ring-2 focus:ring-amber-200/20"
                      />
                    </label>
                  ) : null}

                  <label className="block space-y-2">
                    <span className="text-xs uppercase tracking-[0.28em] text-stone-300/75">
                      Your Message / Memory
                    </span>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Write something funny, congratulatory, sentimental, advisory, chaotic, or unforgettable..."
                      required
                      rows={6}
                      maxLength={1200}
                      className="w-full resize-none rounded-[1.5rem] border border-white/10 bg-black/25 px-4 py-3 text-sm leading-7 text-stone-100 outline-none transition placeholder:text-stone-500 focus:border-amber-200/45 focus:ring-2 focus:ring-amber-200/20"
                    />
                  </label>

                  {status.message ? (
                    <div
                      className={`rounded-2xl border px-4 py-3 text-sm ${
                        status.type === "success"
                          ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-100"
                          : "border-rose-300/25 bg-rose-300/10 text-rose-100"
                      }`}
                    >
                      {status.message}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-amber-200/25 bg-gradient-to-r from-amber-200 via-amber-300 to-orange-300 px-5 py-3 text-sm font-semibold text-stone-950 shadow-[0_0_30px_rgba(251,191,36,0.22)] transition hover:shadow-[0_0_45px_rgba(251,191,36,0.3)] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        Capturing...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Save Memory
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default MemoryModal;
