"use client";

import {
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";


import {
  TextScaleControl,
  type TextScaleControlContent,
} from "@/components/accessibility/controls/TextScaleControl";

type AccessibilityPanelProps = {
  id: string;
  title: string;
  closeLabel: string;
  textSectionTitle: string;
  textScaleContent: TextScaleControlContent;
};

export function AccessibilityPanel({
  id,
  title,
  closeLabel,
  textSectionTitle,
  textScaleContent,
}: AccessibilityPanelProps) {
  return (
    <DrawerContent
      id={id}
      className="
        [--drawer-inset:8px]
        [--drawer-height:75dvh]
        rounded-xl
        border
        after:hidden

        sm:[--drawer-inset:24px]
        sm:[--drawer-height:auto]
        sm:[--drawer-content-width:24rem]
      "
    >
      <DrawerHeader className="flex-row items-center justify-between gap-4">
        <DrawerTitle>
          {title}
        </DrawerTitle>

        <DrawerClose
          render={
            <button
              type="button"
              aria-label={closeLabel}
              className="
                flex h-11 w-11
                shrink-0
                items-center justify-center
                rounded-md
                border border-border
                text-lg
                hover:bg-muted
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-ring
                focus-visible:ring-offset-2
              "
            >
              <span aria-hidden="true">
                ×
              </span>
            </button>
          }
        />
      </DrawerHeader>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <section
          aria-labelledby={`${id}-text-reading-title`}
          className="space-y-3"
        >
          <h3
            id={`${id}-text-reading-title`}
            className="
        px-1
        text-xs
        font-semibold
        uppercase
        tracking-[0.14em]
        text-muted-foreground
      "
          >
            {textSectionTitle}
          </h3>

          <TextScaleControl
            content={textScaleContent}
          />
        </section>
      </div>
    </DrawerContent>
  );
}