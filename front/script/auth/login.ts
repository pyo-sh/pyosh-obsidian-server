export function setupGoogleLogin() {
  const googleLoginBtn = document.getElementById("googleLoginBtn");

  if (!googleLoginBtn) {
    console.warn("Google login button not found");

    return;
  }

  googleLoginBtn.addEventListener("click", () => {
    window.location.href = "/api/auth/google";
  });
}
