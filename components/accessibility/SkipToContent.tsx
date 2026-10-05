type SkipToContentProps = {
  label: string;
};

export function SkipToContent({
  label,
}: SkipToContentProps) {
  return (
    <a
      href="#main-content"
      className="
        fixed left-4 top-4 z-[100]
        -translate-y-24
        rounded-md
        bg-background
        px-4 py-3
        font-medium
        text-foreground
        shadow-md
        focus:translate-y-0
        focus:outline-none
        focus:ring-2
        focus:ring-ring
        focus:ring-offset-2
      "
    >
      {label}
    </a>
  );
}