export const MESSAGE_KEYS = {
  NO_CODE: "no_code",
  TOKEN_EXCHANGE_FAILED: "token_exchange_failed",
  SERVER_ERROR: "server_error",
  NO_DATA: "no_data",
  IP_MISMATCH: "ip_mismatch",
  REVOKED: "revoked",
  REVOKE_ERROR: "revoke_error",
} as const;

export const MESSAGES: Record<string, string> = {
  [MESSAGE_KEYS.NO_CODE]: "인증 코드가 제공되지 않았습니다.",
  [MESSAGE_KEYS.TOKEN_EXCHANGE_FAILED]:
    "토큰 교환에 실패했습니다. 다시 시도해주세요.",
  [MESSAGE_KEYS.SERVER_ERROR]:
    "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
  [MESSAGE_KEYS.NO_DATA]: "인증 정보를 찾을 수 없습니다. 다시 로그인해주세요.",
  [MESSAGE_KEYS.IP_MISMATCH]:
    "로그인 후 IP가 다른 곳에서 토큰이 요청되었습니다. 다시 로그인해주세요.",
  [MESSAGE_KEYS.REVOKED]: "Google 계정 권한이 성공적으로 취소되었습니다.",
  [MESSAGE_KEYS.REVOKE_ERROR]:
    "Google 계정 권한 취소에 실패했습니다. 이미 만료됐는지, 올바르게 요청했는지 확인해주세요.",
};

export const MESSAGE_CONFIG = {
  CONTAINER_ID: "message",
  TEXT_ID: "messageText",
  DISPLAY_DURATION_MS: 5000,
  PARAM_NAME: "message",
} as const;
