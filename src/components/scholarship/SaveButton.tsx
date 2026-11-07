"use client";

import { useTracker } from "@/hooks/use-tracker";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function SaveButton({
  scholarshipId,
  scholarshipName,
}: {
  scholarshipId: string;
  scholarshipName: string;
}) {
  const mounted = useIsMounted();
  const { isSaved, add, remove } = useTracker();
  const saved = mounted ? isSaved(scholarshipId) : false;

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (saved) {
      remove(scholarshipId);
      toast.info(`Removed "${scholarshipName}" from tracker.`);
    } else {
      add(scholarshipId, "saved");
      toast.success(`Saved "${scholarshipName}" to your tracker.`);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      className={`size-11 shrink-0 rounded-lg border-border transition-colors ${
        saved
          ? "border-accent/40 bg-accent/15 text-foreground hover:bg-accent/25"
          : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
      aria-label={
        saved
          ? `Remove ${scholarshipName} from tracker`
          : `Save ${scholarshipName} to tracker`
      }
    >
      {saved ? (
        <BookmarkCheck className="size-5 text-accent" />
      ) : (
        <Bookmark className="size-5" />
      )}
    </Button>
  );
}
