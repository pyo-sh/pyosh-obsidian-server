import { CLIPBOARD_CONFIG, CLIPBOARD_SELECTORS } from "@constant/clipboard";

interface ClipboardIconElements {
  copyIcon: HTMLElement;
  checkIcon: HTMLElement;
  copyText: HTMLElement;
}

/**
 * Get the icon elements inside the button
 */
function getClipboardIconElements(
  button: HTMLButtonElement,
): ClipboardIconElements {
  const copyIcon = button.querySelector(
    CLIPBOARD_SELECTORS.COPY_ICON,
  ) as HTMLElement | null;
  const checkIcon = button.querySelector(
    CLIPBOARD_SELECTORS.CHECK_ICON,
  ) as HTMLElement | null;
  const copyText = button.querySelector(
    CLIPBOARD_SELECTORS.COPY_TEXT,
  ) as HTMLElement | null;

  if (!copyIcon || !checkIcon || !copyText) {
    throw new Error("Copy content element not found");
  }

  return { copyIcon, checkIcon, copyText };
}

/**
 * Changes the UI to "Copied" state
 */
function showCopiedState(
  elements: ClipboardIconElements,
  button: HTMLButtonElement,
): void {
  elements.copyIcon.style.display = "none";
  elements.checkIcon.style.display = "block";
  elements.copyText.textContent = CLIPBOARD_CONFIG.SUCCESS_TEXT;
  button.classList.add(CLIPBOARD_CONFIG.CLASS_NAME);
}

/**
 * Restores the UI to its default state
 */
function resetCopiedState(
  elements: ClipboardIconElements,
  button: HTMLButtonElement,
): void {
  elements.copyIcon.style.display = "block";
  elements.checkIcon.style.display = "none";
  elements.copyText.textContent = CLIPBOARD_CONFIG.DEFAULT_TEXT;
  button.classList.remove(CLIPBOARD_CONFIG.CLASS_NAME);
}

/**
 * Copy text to clipboard and display UI feedback
 */
export async function copyToClipboard(
  text: string,
  button: HTMLButtonElement,
): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);

    const elements = getClipboardIconElements(button);
    showCopiedState(elements, button);

    setTimeout(() => {
      resetCopiedState(elements, button);
    }, CLIPBOARD_CONFIG.FEEDBACK_DURATION_MS);
  } catch (error) {
    console.error("복사 실패:", error);
    alert(CLIPBOARD_CONFIG.ERROR_MESSAGE);
  }
}
