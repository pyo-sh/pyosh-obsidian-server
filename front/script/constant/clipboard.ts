export const CLIPBOARD_CONFIG = {
  FEEDBACK_DURATION_MS: 2000,
  SUCCESS_TEXT: "복사됨!",
  DEFAULT_TEXT: "복사",
  ERROR_MESSAGE: "클립보드 복사에 실패했습니다.",
  CLASS_NAME: "copied",
} as const;

export const CLIPBOARD_SELECTORS = {
  COPY_ICON: ".copy-icon",
  CHECK_ICON: ".check-icon",
  COPY_TEXT: ".copy-text",
} as const;
