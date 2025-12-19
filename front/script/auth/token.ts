import { getToken } from "@api/token";
import { copyToClipboard } from "@common/clipboard";
import { TOKEN_DOM_IDS } from "@constant/token";

interface TokenElements {
  accessTokenContent: HTMLElement;
  refreshTokenContent: HTMLElement;
  refreshTokenSection: HTMLElement;
  copyTokenBtn: HTMLButtonElement;
  copyRefreshTokenBtn: HTMLButtonElement;
  revokeBtn: HTMLButtonElement;
}

/**
 * Safely retrieve all the DOM elements you need
 */
function getTokenElements(): TokenElements | null {
  const accessTokenContent = document.getElementById(
    TOKEN_DOM_IDS.ACCESS_TOKEN_CONTENT,
  ) as TokenElements["accessTokenContent"] | null;
  const refreshTokenContent = document.getElementById(
    TOKEN_DOM_IDS.REFRESH_TOKEN_CONTENT,
  ) as TokenElements["refreshTokenContent"] | null;
  const refreshTokenSection = document.getElementById(
    TOKEN_DOM_IDS.REFRESH_TOKEN_SECTION,
  ) as TokenElements["refreshTokenSection"] | null;
  const copyTokenBtn = document.getElementById(TOKEN_DOM_IDS.COPY_TOKEN_BTN) as
    | TokenElements["copyTokenBtn"]
    | null;
  const copyRefreshTokenBtn = document.getElementById(
    TOKEN_DOM_IDS.COPY_REFRESH_TOKEN_BTN,
  ) as TokenElements["copyRefreshTokenBtn"] | null;
  const revokeBtn = document.getElementById(TOKEN_DOM_IDS.REVOKE_BTN) as
    | TokenElements["revokeBtn"]
    | null;

  if (
    !accessTokenContent ||
    !refreshTokenContent ||
    !refreshTokenSection ||
    !copyTokenBtn ||
    !copyRefreshTokenBtn ||
    !revokeBtn
  ) {
    console.warn("One or more required DOM elements not found");

    return null;
  }

  return {
    accessTokenContent,
    refreshTokenContent,
    refreshTokenSection,
    copyTokenBtn,
    copyRefreshTokenBtn,
    revokeBtn,
  };
}

/**
 * Display the token contents in the UI
 */
function displayTokenContent(
  elements: TokenElements,
  accessToken: string,
  refreshToken: string,
): void {
  elements.accessTokenContent.textContent = accessToken;
  elements.refreshTokenContent.textContent = refreshToken;

  if (refreshToken) {
    elements.refreshTokenSection.style.display = "block";
  }
}

export async function setupTokenDisplay(): Promise<void> {
  try {
    const { accessToken, refreshToken } = await getToken();
    const elements = getTokenElements();
    const loadingDisplay = document.getElementById("loadingSection");
    const successDisplay = document.getElementById("successSection");

    if (!elements) {
      return;
    }

    if (loadingDisplay && successDisplay && accessToken && refreshToken) {
      loadingDisplay.style.display = "none";
      successDisplay.style.display = "block";
    }

    displayTokenContent(elements, accessToken, refreshToken);

    // Access Token Copy Button
    elements.copyTokenBtn.addEventListener("click", () => {
      copyToClipboard(accessToken, elements.copyTokenBtn);
    });

    // Refresh Token Copy Button
    elements.copyRefreshTokenBtn.addEventListener("click", () => {
      copyToClipboard(refreshToken, elements.copyRefreshTokenBtn);
    });

    // Revoke Button
    elements.revokeBtn.addEventListener("click", (e) => {
      const confirmed = confirm("정말로 Google 계정 권한을 취소하시겠습니까?");

      if (!confirmed) {
        e.preventDefault();
      }
    });
  } catch (error) {
    console.error("Failed to initialize token display:", error);
  }
}
