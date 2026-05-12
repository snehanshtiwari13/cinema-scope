"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";

interface TrailerModalProps {
  videoKey: string | null;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export function TrailerModal({ videoKey, isOpen, onClose, title }: TrailerModalProps) {
  if (!videoKey) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl border-border bg-background/95 p-0 backdrop-blur-xl">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <iframe
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`}
            title={title || "Trailer"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
