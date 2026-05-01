"use client";
import { GalleryItem } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";

export default function LightboxSection({ item, onClose }: { item: GalleryItem | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.9)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Button variant="ghost" size="icon" onClick={onClose} className="absolute -top-12 right-0 text-white hover:bg-white/10 hover:text-white">
              <X size={18} />
            </Button>
            <div className="relative w-full max-h-[75vh]" style={{ aspectRatio: "16/10" }}>
              <Image src={item.src} alt={item.alt} fill className="object-contain rounded-lg" />
            </div>
            <p className="text-center text-white/70 text-[14px] mt-4">{item.caption}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
