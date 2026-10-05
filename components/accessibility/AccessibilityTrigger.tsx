"use client";

type AccessibilityTriggerProps = {
  label: string;
  isOpen: boolean;
  panelId: string;
  onClick: () => void;
};

export function AccessibilityTrigger({
  label,
  isOpen,
  panelId,
  onClick,
}: AccessibilityTriggerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      aria-controls={panelId}
      className="
        fixed bottom-6 right-6 z-50
        flex h-12 w-12
        items-center justify-center
        rounded-full
        border border-border
        bg-background
        text-foreground
        shadow-lg
        transition
        hover:bg-muted
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-ring
        focus-visible:ring-offset-2
      "
    >
      <span
        aria-hidden="true"
        className="text-sm font-bold"
      >
        Aa
      </span>
    </button>
  );
}