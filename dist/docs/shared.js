/* ── Theme Toggle ── */
function toggleTheme() {
    const html = document.documentElement;
    const toggle = document.getElementById("themeToggle");
    const label = document.getElementById("themeLabel");
    const isLight = html.classList.contains("light");
    if (isLight) {
        html.classList.replace("light", "dark");
        toggle?.classList.add("on");
        if (label)
            label.textContent = "Dark Mode";
    }
    else {
        html.classList.replace("dark", "light");
        toggle?.classList.remove("on");
        if (label)
            label.textContent = "Light Mode";
    }
    localStorage.setItem("theme", isLight ? "dark" : "light");
}
/* ── Apply saved theme preference on load ── */
(function () {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
        document.documentElement.classList.replace("dark", "light");
        const toggle = document.getElementById("themeToggle");
        const label = document.getElementById("themeLabel");
        if (toggle)
            toggle.classList.remove("on");
        if (label)
            label.textContent = "Light Mode";
    }
})();
/* ── Toast Notification ── */
let _tt;
function showToast(msg, color) {
    const toast = document.getElementById("toast");
    if (!toast)
        return;
    const toastMsg = document.getElementById("toastMsg");
    if (toastMsg)
        toastMsg.textContent = msg;
    toast.style.background = color === "red" ? "#ef4444" : "#5865F2";
    toast.classList.add("show");
    clearTimeout(_tt);
    _tt = setTimeout(() => toast.classList.remove("show"), 2500);
}
/* ── Section Navigation ── */
function showSection(sectionId) {
    // Hide all sections first
    document.querySelectorAll(".endpoint-section").forEach((section) => {
        section.classList.add("hidden");
    });
    // Show the selected section and make it visible immediately
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove("hidden");
        // Force immediate visibility for all scroll-fade elements
        // Do this synchronously before any scroll happens
        const fadeElements = targetSection.querySelectorAll(".scroll-fade");
        fadeElements.forEach((el) => {
            el.classList.add("visible");
            el.classList.remove("scroll-fade");
        });
        // Also handle if the section itself has scroll-fade
        if (targetSection.classList.contains("scroll-fade")) {
            targetSection.classList.add("visible");
            targetSection.classList.remove("scroll-fade");
        }
    }
    // Update active state in sidebar
    updateSidebarActive(sectionId);
    // Close mobile drawer if open
    closeMobileDrawer();
    // Scroll to top AFTER making content visible
    requestAnimationFrame(() => {
        window.scrollTo({ top: 0 });
    });
}
function updateSidebarActive(sectionId) {
    // Update left sidebar
    document
        .querySelectorAll(".left-sidebar .sidebar-link, .mobile-drawer .sidebar-link")
        .forEach((link) => {
            const onclick = link.getAttribute("onclick");
            if (onclick && onclick.includes(`'${sectionId}'`)) {
                link.classList.add("active");
            }
            else {
                link.classList.remove("active");
            }
        });
}
/* ── Mobile Drawer ── */
function toggleMobileDrawer() {
    const backdrop = document.getElementById("mobileDrawerBackdrop");
    const drawer = document.getElementById("mobileDrawer");
    const btn = document.getElementById("hamburgerBtn");
    if (backdrop && drawer && btn) {
        backdrop.classList.toggle("open");
        drawer.classList.toggle("open");
        btn.classList.toggle("open");
    }
}
function closeMobileDrawer() {
    const backdrop = document.getElementById("mobileDrawerBackdrop");
    const drawer = document.getElementById("mobileDrawer");
    const btn = document.getElementById("hamburgerBtn");
    if (backdrop && drawer && btn) {
        backdrop.classList.remove("open");
        drawer.classList.remove("open");
        btn.classList.remove("open");
    }
}
/* ── Scroll fade-in observer ── */
const scrollObserverOptions = {
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
});
