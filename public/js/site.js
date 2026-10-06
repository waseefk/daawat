/* Daawat Catering Services - site behaviour (no dependencies) */
(function () {
    "use strict";

    var header = document.querySelector(".site-header");
    var toTop = document.querySelector(".to-top");
    var navToggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("site-nav");

    // Solid header and back-to-top button once the page is scrolled
    function onScroll() {
        var y = window.scrollY || window.pageYOffset;
        header.classList.toggle("is-scrolled", y > 40);
        toTop.classList.toggle("is-visible", y > 600);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Mobile navigation
    function setMenu(open) {
        navToggle.setAttribute("aria-expanded", String(open));
        navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        nav.classList.toggle("is-open", open);
        header.classList.toggle("menu-open", open);
    }
    navToggle.addEventListener("click", function () {
        setMenu(navToggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
        if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") setMenu(false);
    });

    // Scroll to sections without adding #section to the address bar.
    // Smooth scrolling and the header offset come from the CSS on <html>.
    function clearHash() {
        if (location.hash && window.history.replaceState) {
            history.replaceState(null, "", location.pathname + location.search);
        }
    }
    document.addEventListener("click", function (e) {
        var link = e.target.closest('a[href^="#"]');
        if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        var id = link.getAttribute("href").slice(1);
        // "#top" has no element; browsers treat it as the top of the page
        var target = id === "top" ? document.documentElement : id && document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        if (id === "top") {
            window.scrollTo(0, 0);
            // Send keyboard focus back to the start of the page too
            if (document.activeElement) document.activeElement.blur();
        } else {
            target.scrollIntoView();
            // Move keyboard focus with the scroll, as a normal link jump would
            if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
            target.focus({ preventScroll: true });
        }
        clearHash();
    });
    // An old link with #section still jumps there, then the hash is tidied away
    window.addEventListener("load", function () {
        var target = location.hash && document.getElementById(location.hash.slice(1));
        if (target) target.scrollIntoView({ behavior: "instant" });
        clearHash();
    });

    // Menu tabs
    var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
    function selectTab(tab, focus) {
        tabs.forEach(function (t) {
            var selected = t === tab;
            t.setAttribute("aria-selected", String(selected));
            t.tabIndex = selected ? 0 : -1;
            document.getElementById(t.getAttribute("aria-controls")).hidden = !selected;
        });
        if (focus) tab.focus();
    }
    tabs.forEach(function (tab, i) {
        tab.addEventListener("click", function () { selectTab(tab); });
        tab.addEventListener("keydown", function (e) {
            var next = null;
            if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
            if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
            if (next) { e.preventDefault(); selectTab(next, true); }
        });
    });

    // Keep the copyright year and years in business current
    var thisYear = new Date().getFullYear();
    document.getElementById("year").textContent = thisYear;
    Array.prototype.forEach.call(document.querySelectorAll(".years-since"), function (el) {
        el.textContent = thisYear - Number(el.getAttribute("data-since"));
    });
})();
