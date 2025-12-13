function initializeApp(): void {
  const resultSection = document.getElementById("app") as HTMLElement;
  resultSection.innerHTML = `<h1>Welcome to the App</h1><p>This is the main application area.</p>`;
}

// DOM이 로드되면 초기화
document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
});
