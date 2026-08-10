function toggleTheme(): void {
  const html = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  const label = document.getElementById("themeLabel");
  const isLight = html.classList.contains("light");

  if (isLight) {
    html.classList.replace("light", "dark");
    toggle?.classList.add("on");
    if (label) label.textContent = "Dark Mode";
  } else {
    html.classList.replace("dark", "light");
    toggle?.classList.remove("on");
    if (label) label.textContent = "Light Mode";
  }
  localStorage.setItem("theme", isLight ? "dark" : "light");
}

(function (): void {
  const saved = localStorage.getItem("theme");
  if (saved === "light") {
    document.documentElement.classList.replace("dark", "light");
    const toggle = document.getElementById("themeToggle");
    const label = document.getElementById("themeLabel");
    if (toggle) toggle.classList.remove("on");
    if (label) label.textContent = "Light Mode";
  }
})();

let _tt: ReturnType<typeof setTimeout>;
function showToast(msg: string, color?: string): void {
  const toast = document.getElementById("toast");
  if (!toast) return;
  const toastMsg = document.getElementById("toastMsg");
  if (toastMsg) toastMsg.textContent = msg;
  toast.style.background = color === "red" ? "#ef4444" : "#5865F2";
  toast.classList.add("show");
  clearTimeout(_tt);
  _tt = setTimeout(() => toast.classList.remove("show"), 2500);
}

function showSection(sectionId: string, scrollToTop = true): void {
  document.querySelectorAll(".endpoint-section").forEach((section) => {
    section.classList.add("hidden");
  });

  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.remove("hidden");

    const fadeElements = targetSection.querySelectorAll(".scroll-fade");
    fadeElements.forEach((el) => {
      el.classList.add("visible");
      el.classList.remove("scroll-fade");
    });

    if (targetSection.classList.contains("scroll-fade")) {
      targetSection.classList.add("visible");
      targetSection.classList.remove("scroll-fade");
    }
  }

  history.pushState(null, "", `#${sectionId}`);

  updateSidebarActive(sectionId);

  closeMobileDrawer();

  requestAnimationFrame(() => {
    if (scrollToTop) {
      window.scrollTo({ top: 0 });
    } else if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  });
}

function updateSidebarActive(sectionId: string): void {
  document
    .querySelectorAll(
      ".left-sidebar .sidebar-link, .mobile-drawer .sidebar-link",
    )
    .forEach((link) => {
      const onclick = link.getAttribute("onclick");
      if (onclick && onclick.includes(`'${sectionId}'`)) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
}

function toggleMobileDrawer(): void {
  const backdrop = document.getElementById("mobileDrawerBackdrop");
  const drawer = document.getElementById("mobileDrawer");
  const btn = document.getElementById("hamburgerBtn");

  if (backdrop && drawer && btn) {
    backdrop.classList.toggle("open");
    drawer.classList.toggle("open");
    btn.classList.toggle("open");
  }
}

function closeMobileDrawer(): void {
  const backdrop = document.getElementById("mobileDrawerBackdrop");
  const drawer = document.getElementById("mobileDrawer");
  const btn = document.getElementById("hamburgerBtn");

  if (backdrop && drawer && btn) {
    backdrop.classList.remove("open");
    drawer.classList.remove("open");
    btn.classList.remove("open");
  }
}

const scrollObserverOptions: IntersectionObserverInit = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      scrollObserver.unobserve(entry.target);
    }
  });
}, scrollObserverOptions);

window.addEventListener("load", () => {
  const fadeElements = document.querySelectorAll(".scroll-fade");
  fadeElements.forEach((el) => scrollObserver.observe(el));

  const hash = window.location.hash.slice(1);
  if (hash && document.getElementById(hash)) {
    showSection(hash, false);
  }
});
