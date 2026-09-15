"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "./icons";

/**
 * The enlarged view of a tapped inline photo — the image itself blown
 * up large on a near-black backdrop, same full-bleed feel as
 * DiamondStage's own full-screen stone (no bordered frame or card
 * boxing it in). `image` is the same {src, alt} shape DiamondStory's
 * stage images already use; pass null to keep the component mounted
 * but closed.
 */
export default function ImageLightbox({ image, onClose }) {
  return (
    <AnimatePresence>
      {image ? (
        <motion.div
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={image.alt}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[70] bg-black"
        >
          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-full w-full"
          >
            <Image src={image.src} alt={image.alt} fill sizes="100vw" className="object-contain" priority />
          </motion.div>

          <button
            onClick={onClose}
            aria-label="Close image"
            className="fixed right-4 top-[calc(1rem+env(safe-area-inset-top))] flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur transition-colors hover:border-white/30"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
