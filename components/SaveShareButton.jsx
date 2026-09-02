"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "./icons";
import { buildShareCard } from "@/lib/shareCard";
import { vibrate } from "@/lib/feedback";

const STATUS_LABEL = {
  shared: "Shared",
  saved: "Saved to your device",
  copied: "Link copied",
};

/**
 * The closing "take it with you" moment at the end of the details
 * sheet — generates a shareable certificate image (name, specs, trust
 * mark, GIA/Tracr IDs) and hands it to the OS share sheet so a
 * customer can text or AirDrop it to themselves, with graceful
 * fallbacks down to a direct download or a copied link.
 */
export default function SaveShareButton({ diamond, giaRecord, tracrRecord }) {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(null);

  async function handleClick() {
    if (busy) return;
    setBusy(true);
    // Fire the tap confirmation immediately — the Vibration API only works
    // within a short window of real user activation, which async work
    // below (canvas generation, awaiting the OS share sheet) would outlast.
    vibrate(14);
    try {
      const url = window.location.href;
      const blob = await buildShareCard({ diamond, giaRecord, tracrRecord, url });
      const file =
        blob && typeof File !== "undefined"
          ? new File([blob], `${diamond.name.replace(/\s+/g, "-").toLowerCase()}.png`, {
              type: "image/png",
            })
          : null;
      const shareText = `${diamond.name} — verified natural diamond`;

      if (file && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: diamond.name, text: shareText });
        setStatus("shared");
      } else if (navigator.share) {
        await navigator.share({ title: diamond.name, text: shareText, url });
        setStatus("shared");
      } else if (file) {
        const objectUrl = URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = objectUrl;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(objectUrl);
        setStatus("saved");
      } else {
        await navigator.clipboard.writeText(url);
        setStatus("copied");
      }
    } catch (e) {
      // AbortError from a cancelled native share sheet is expected — no-op.
      if (e?.name !== "AbortError") {
        try {
          await navigator.clipboard.writeText(window.location.href);
          setStatus("copied");
        } catch {
          /* clipboard unavailable — give up quietly */
        }
      }
    } finally {
      setBusy(false);
      setTimeout(() => setStatus(null), 2200);
    }
  }

  return (
    <div className="mt-8 border-t border-[var(--hairline)] pt-5">
      <button
        onClick={handleClick}
        disabled={busy}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--brass)] px-5 py-3.5 text-sm font-medium text-[var(--brass-ink)] transition-transform active:scale-[0.98] disabled:opacity-60"
      >
        <Icon name="share" className="h-4 w-4" />
        {busy ? "Preparing…" : "Save This Diamond"}
      </button>
      <AnimatePresence>
        {status ? (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="mt-2.5 text-center text-xs text-[var(--ink-faint)]"
          >
            {STATUS_LABEL[status]}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
