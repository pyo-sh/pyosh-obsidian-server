function initGoogleLogin() {
  const googleLoginBtn = document.getElementById("googleLoginBtn");

  if (!googleLoginBtn) {
    console.warn("Google login button not found");

    return;
  }

  googleLoginBtn.addEventListener("click", () => {
    window.location.href = "/api/auth/google";
  });
}

export function checkAuthError() {
  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get("error");

  if (!error) return;

  const errorMessage = document.getElementById("errorMessage");
  const errorText = document.getElementById("errorText");

  if (!errorMessage || !errorText) return;

  const errorMessages: Record<string, string> = {
    no_code: "인증 코드가 제공되지 않았습니다.",
    token_exchange_failed: "토큰 교환에 실패했습니다. 다시 시도해주세요.",
    server_error: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    no_data: "인증 정보를 찾을 수 없습니다. 다시 로그인해주세요.",
  };

  errorText.textContent =
    errorMessages[error] || "알 수 없는 오류가 발생했습니다.";
  errorMessage.style.display = "flex";

  // 5초 후 에러 메시지 숨기기
  setTimeout(() => {
    errorMessage.style.display = "none";
  }, 5000);
}

initGoogleLogin();
