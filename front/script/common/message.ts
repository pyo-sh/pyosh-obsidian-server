import { MESSAGE_CONFIG, MESSAGES } from "@constant/message";

interface MessageElements {
  container: HTMLElement;
  text: HTMLElement;
}

/**
 * Gets the DOM element. If not found, returns null.
 */
function getMessageElements(): MessageElements | null {
  const container = document.getElementById(MESSAGE_CONFIG.CONTAINER_ID);
  const text = document.getElementById(MESSAGE_CONFIG.TEXT_ID);

  if (!container || !text) {
    console.error("Message elements not found in DOM");

    return null;
  }

  return { container, text };
}

/**
 * Extracting message keys from URL query parameters
 */
function getMessageKeyFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);

  return params.get(MESSAGE_CONFIG.PARAM_NAME);
}

/**
 * Displays a message and hides it after durationMs milliseconds
 */

function displayMessage(
  messageKey: string,
  elements: MessageElements,
  durationMs: number = MESSAGE_CONFIG.DISPLAY_DURATION_MS,
): void {
  const message = MESSAGES[messageKey] || "알 수 없는 오류가 발생했습니다.";

  elements.text.textContent = message;
  elements.container.style.display = "flex";

  setTimeout(() => {
    elements.container.style.display = "none";
  }, durationMs);
}

/**
 * Checks and displays parameters in the URL
 */
export function checkAndDisplayMessage(): void {
  const messageKey = getMessageKeyFromUrl();

  if (!messageKey) {
    return;
  }

  const elements = getMessageElements();

  if (!elements) {
    return;
  }

  displayMessage(messageKey, elements);
}
