interface PageSection {
  id: string;
  label: string;
}

interface PageLink {
  url: string;
  label: string;
}

let SECTIONS: PageSection[] = [];
let PREV_PAGE: PageLink | null = null;
let NEXT_PAGE: PageLink | null = null;

function copyUrl(path: string): void {
  const base = "https://api.bdtools.xyz";
  navigator.clipboard
    .writeText(base + path)
    .then(() => showToast("URL copied!"));
}

function navigateSection(direction: "prev" | "next"): void {
  const currentSection = document.querySelector(
    ".endpoint-section:not(.hidden)",
  );
  if (!currentSection) return;

  const currentId = currentSection.id;
  const currentIndex = SECTIONS.findIndex((s) => s.id === currentId);

  if (direction === "prev") {
    if (currentIndex > 0) {
      showSection(SECTIONS[currentIndex - 1].id);
    } else if (PREV_PAGE) {
      window.location.href = PREV_PAGE.url;
    }
  } else if (direction === "next") {
    if (currentIndex < SECTIONS.length - 1) {
      showSection(SECTIONS[currentIndex + 1].id);
    } else if (NEXT_PAGE) {
      window.location.href = NEXT_PAGE.url;
    }
  }
}

function updateNavButtons(): void {
  const currentSection = document.querySelector(
    ".endpoint-section:not(.hidden)",
  );
  if (!currentSection) return;

  const currentId = currentSection.id;
  const currentIndex = SECTIONS.findIndex((s) => s.id === currentId);

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const prevText = document.getElementById("prevText");
  const nextText = document.getElementById("nextText");

  if (prevBtn && prevText) {
    if (currentIndex > 0) {
      prevText.textContent = SECTIONS[currentIndex - 1].label;
      prevBtn.style.display = "inline-flex";
    } else if (PREV_PAGE) {
      prevText.textContent = PREV_PAGE.label;
      prevBtn.style.display = "inline-flex";
    } else {
      prevBtn.style.display = "none";
    }
  }

  if (nextBtn && nextText) {
    if (currentIndex < SECTIONS.length - 1) {
      nextText.textContent = SECTIONS[currentIndex + 1].label;
      nextBtn.style.display = "inline-flex";
    } else if (NEXT_PAGE) {
      nextText.textContent = NEXT_PAGE.label;
      nextBtn.style.display = "inline-flex";
    } else {
      nextBtn.style.display = "none";
    }
  }
}

const originalShowSection = (window as any).showSection as
  | ((sectionId: string, scrollToTop?: boolean) => void)
  | undefined;
(window as any).showSection = function (
  sectionId: string,
  scrollToTop = true,
): void {
  if (typeof originalShowSection === "function") {
    originalShowSection(sectionId, scrollToTop);
  }

  updateNavButtons();
};

document.addEventListener("DOMContentLoaded", function (): void {
  SECTIONS = (window as any).PAGE_SECTIONS || [];
  PREV_PAGE = (window as any).PREV_PAGE || null;
  NEXT_PAGE = (window as any).NEXT_PAGE || null;

  if (SECTIONS.length > 0) {
    const hashSectionId = window.location.hash.slice(1);
    const hasValidHash = SECTIONS.some((s) => s.id === hashSectionId);

    if (typeof (window as any).showSection === "function") {
      if (hasValidHash) {
        (window as any).showSection(hashSectionId, false);
      } else {
        (window as any).showSection(SECTIONS[0].id);
      }
    }
    setTimeout(() => {
      updateNavButtons();
    }, 0);
  }
});
