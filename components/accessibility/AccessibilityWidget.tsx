"use client";

import { useState } from "react";

import { AccessibilityTrigger } from "./AccessibilityTrigger";

type AccessibilityWidgetContent = {
  trigger: {
    open: string;
    close: string;
  };
};

type AccessibilityWidgetProps = {
  content: AccessibilityWidgetContent;
};

const ACCESSIBILITY_PANEL_ID = "accessibility-panel";

export function AccessibilityWidget({
  content,
}: AccessibilityWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  const triggerLabel = isOpen
    ? content.trigger.close
    : content.trigger.open;

  return (
    <AccessibilityTrigger
      label={triggerLabel}
      isOpen={isOpen}
      panelId={ACCESSIBILITY_PANEL_ID}
      onClick={() => {
        setIsOpen((current) => !current);
      }}
    />
  );
}