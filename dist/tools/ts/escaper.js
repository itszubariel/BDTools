const ldrtxt = document.getElementById("ldrtxt");
let dc = 0;
const di = setInterval(() => {
    dc = (dc + 1) % 4;
    ldrtxt.textContent = "Loading" + ".".repeat(dc);
}, 350);
window.addEventListener("load", () => {
    setTimeout(() => {
        const l = document.getElementById("ldr");
        l.classList.add("out");
        setTimeout(() => l.remove(), 400);
        clearInterval(di);
    }, 900);
});
function toast(msg, type = "s") {
    const box = document.getElementById("toasts");
    const t = document.createElement("div");
    t.className = `toast ${type}`;
    t.innerHTML = `<span>${msg}</span><div class="tbar"></div>`;
    box.appendChild(t);
    setTimeout(() => t.remove(), 4500);
}
function toggleTheme() {
    const h = document.documentElement;
    const t = document.getElementById("tog");
    const dark = h.classList.toggle("dark");
    h.classList.toggle("light", !dark); // ← add this line
    localStorage.setItem("darkMode", dark ? "enabled" : "disabled");
    t.classList.toggle("on", dark);
}
(function () {
    document
        .getElementById("tog")
        .classList.toggle("on", document.documentElement.classList.contains("dark"));
})();
window.addEventListener("load", () => {
    if (!localStorage.getItem("visited")) {
        toast("Welcome! 👋", "s");
        localStorage.setItem("visited", "true");
    }
});
// ==================== UNESCAPE FUNCTION ====================
function unescapeText(text) {
    let result = text;
    // Unescape $ (reverse order of escape)
    const dollarRule = document.querySelector('.rule-select[data-from="$"]');
    if (dollarRule) {
        const select = dollarRule.querySelector(".rule-choice");
        let replacement = select.value === "a" ? dollarRule.dataset.a : dollarRule.dataset.b;
        // Escape special regex chars in replacement
        const escapedReplacement = replacement.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
        result = result.replace(new RegExp(escapedReplacement, "g"), "$");
    }
    // Unescape other rules
    document.querySelectorAll(".rule-select").forEach((rule) => {
        const htmlRule = rule;
        const from = htmlRule.dataset.from;
        if (from === "$")
            return;
        let replacement = !htmlRule.querySelector(".rule-choice")
            ? "\\\\"
            : htmlRule.querySelector(".rule-choice").value === "a"
                ? htmlRule.dataset.a
                : htmlRule.dataset.b;
        const escapedReplacement = replacement.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
        // Replace the replacement string back to the 'from' character
        result = result.replace(new RegExp(escapedReplacement, "g"), from);
    });
    // Unescape backslashes last
    result = result.replace(/\\\\/g, "\\");
    return result;
}
// ==================== ESCAPE FUNCTION ====================
function escapeText(text) {
    let result = text;
    // FORCE escape backslashes first
    result = result.replace(/\\/g, "\\\\");
    // Escape everything except $ next
    document.querySelectorAll(".rule-select").forEach((rule) => {
        const htmlRule = rule;
        const from = htmlRule.dataset.from;
        if (from === "$")
            return;
        let replacement = !htmlRule.querySelector(".rule-choice")
            ? "\\\\"
            : htmlRule.querySelector(".rule-choice").value === "a"
                ? htmlRule.dataset.a
                : htmlRule.dataset.b;
        const escapedFrom = from.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
        result = result.replace(new RegExp(escapedFrom, "g"), replacement);
    });
    // Escape $ last
    const dollarRule = document.querySelector('.rule-select[data-from="$"]');
    if (dollarRule) {
        const select = dollarRule.querySelector(".rule-choice");
        let replacement = select.value === "a" ? dollarRule.dataset.a : dollarRule.dataset.b;
        if (replacement === "$$c[]") {
            replacement = "$$c[]".replace(/\$/g, "$$$$");
        }
        else if (replacement.includes("$")) {
            replacement = replacement.replace(/\$/g, "$$$$");
        }
        result = result.replace(/\$/g, replacement);
    }
    return result;
}
// ==================== UI LOGIC ====================
const inputEl = document.getElementById("input-text");
const outputEl = document.getElementById("output-text");
document.getElementById("replace-btn").addEventListener("click", () => {
    const val = inputEl.value.trim();
    if (!val) {
        toast("Nothing to escape", "e");
        return;
    }
    outputEl.value = escapeText(val);
    toast("Code escaped successfully", "s");
});
document.getElementById("reverse-btn").addEventListener("click", () => {
    const val = inputEl.value.trim();
    if (!val) {
        toast("Nothing to unescape", "e");
        return;
    }
    outputEl.value = unescapeText(val);
    toast("Code unescaped successfully", "s");
});
document.getElementById("copy-output").addEventListener("click", () => {
    if (!outputEl.value.trim()) {
        toast("Nothing to copy", "e");
        return;
    }
    navigator.clipboard
        .writeText(outputEl.value)
        .then(() => toast("Copied to clipboard", "s"))
        .catch(() => toast("Copy failed", "e"));
});
// Clear buttons (both toolbar and card)
const clearBtns = document.querySelectorAll("#clear-input, #clear-input2");
clearBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        inputEl.value = "";
        outputEl.value = "";
        toast("Cleared", "s");
    });
});
// Ctrl+Enter shortcut
inputEl.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        document.getElementById("replace-btn").click();
    }
});
// Scroll fade-in observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
});
window.addEventListener("load", () => {
    const fadeElements = document.querySelectorAll(".scroll-fade");
    fadeElements.forEach((el) => observer.observe(el));
});
