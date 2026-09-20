/* Nazeer Ahmad Portfolio — vanilla JS interactions */
(function () {
  "use strict";

  /* Pointer + motion capability gates */
  var finePointer = window.matchMedia("(pointer: fine)").matches;
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Sticky header + nav hide + progress + parallax ---------- */
  var header = document.getElementById("siteHeader");
  var heroBg = document.querySelector(".hero-bg");
  var progress = document.querySelector(".scroll-progress");
  var lastY = window.scrollY;
  var scrollTicking = false;
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle("scrolled", y > 24);
    // Hide header scrolling down, reveal scrolling up (not while mobile menu is open)
    if (typeof mobileMenu !== "undefined" && mobileMenu && !mobileMenu.classList.contains("open")) {
      if (y > 160 && y > lastY + 4) header.classList.add("nav-hidden");
      else if (y < lastY - 4 || y <= 160) header.classList.remove("nav-hidden");
    }
    lastY = y;
    // Scroll progress bar
    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = "scaleX(" + (max > 0 ? Math.min(y / max, 1) : 0) + ")";
    }
    // Gentle hero background parallax
    if (heroBg && y < window.innerHeight * 1.25) {
      heroBg.style.transform = "translateY(" + y * 0.12 + "px)";
    }
    scrollTicking = false;
  }
  window.addEventListener("scroll", function () {
    if (!scrollTicking) { requestAnimationFrame(onScroll); scrollTicking = true; }
  }, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById("menuToggle");
  var mobileMenu = document.getElementById("mobileMenu");
  toggle.addEventListener("click", function () {
    var open = mobileMenu.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  });
  mobileMenu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      mobileMenu.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });

  /* ---------- Staggered group reveals (cards cascade in) ---------- */
  var staggerKids = new Set();
  var staggerGroups = document.querySelectorAll("[data-stagger]");
  staggerGroups.forEach(function (group) {
    group.querySelectorAll(".reveal").forEach(function (kid) { staggerKids.add(kid); });
  });
  if ("IntersectionObserver" in window) {
    var groupIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var kids = entry.target.querySelectorAll(".reveal");
          kids.forEach(function (kid, i) {
            kid.classList.remove("reveal-d1", "reveal-d2", "reveal-d3", "reveal-d4");
            var d = i * 85;
            kid.style.transitionDelay = d + "ms";
            kid.classList.add("visible");
            setTimeout(function () { kid.style.transitionDelay = ""; }, d + 950);
          });
          entry.target.classList.add("draw"); // process timeline line draws itself
          groupIO.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );
    staggerGroups.forEach(function (g) { groupIO.observe(g); });
  } else {
    staggerGroups.forEach(function (g) {
      g.classList.add("draw");
      g.querySelectorAll(".reveal").forEach(function (k) { k.classList.add("visible"); });
    });
  }

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  var revealEls = [];
  document.querySelectorAll(".reveal").forEach(function (el) {
    if (!staggerKids.has(el)) revealEls.push(el);
  });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- Sticky bar: hide while contact section is in view ---------- */
  var stickyBar = document.querySelector(".sticky-cta");
  var contactSec = document.getElementById("contact");
  if (stickyBar && contactSec && "IntersectionObserver" in window) {
    var barIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          stickyBar.classList.toggle("bar-hidden", entry.isIntersecting);
        });
      },
      { threshold: 0.08 }
    );
    barIO.observe(contactSec);
  }

  /* ---------- FAQ accordion ---------- */
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    q.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      // close all
      faqItems.forEach(function (other) {
        other.classList.remove("open");
        other.querySelector(".faq-a").style.maxHeight = null;
        other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
      });
      // open this one if it was closed
      if (!isOpen) {
        item.classList.add("open");
        a.style.maxHeight = a.scrollHeight + "px";
        q.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- Active nav link (scrollspy) ---------- */
  var sections = document.querySelectorAll("section[id]");
  var navLinks = document.querySelectorAll(".nav-links a");
  function spy() {
    var pos = window.scrollY + 120;
    var current = null;
    sections.forEach(function (s) {
      if (s.offsetTop <= pos) current = s.id;
    });
    navLinks.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current);
    });
  }
  window.addEventListener("scroll", spy, { passive: true });
  spy();

  /* ---------- Word-by-word title animation ---------- */
  function splitWords(el) {
    var idx = 0;
    function addWord(text, parent) {
      var w = document.createElement("span"); w.className = "w";
      var wi = document.createElement("span"); wi.className = "wi";
      wi.style.setProperty("--i", idx++);
      wi.textContent = text;
      w.appendChild(wi); parent.appendChild(w);
    }
    function process(node, parent) {
      if (node.nodeType === 3) {
        node.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) parent.appendChild(document.createTextNode(" "));
          else addWord(part, parent);
        });
      } else if (node.nodeType === 1) {
        if (node.classList && node.classList.contains("gold")) {
          // Keep shimmer text atomic: splitting it into nested word spans
          // breaks background-clip:text and makes the words invisible.
          var w = document.createElement("span"); w.className = "w";
          var wi = document.createElement("span"); wi.className = "wi";
          wi.style.setProperty("--i", idx++);
          wi.appendChild(node.cloneNode(true));
          w.appendChild(wi); parent.appendChild(w);
        } else {
          var clone = node.cloneNode(false);
          Array.prototype.slice.call(node.childNodes).forEach(function (c) { process(c, clone); });
          parent.appendChild(clone);
        }
      }
    }
    var frag = document.createDocumentFragment();
    Array.prototype.slice.call(el.childNodes).forEach(function (n) { process(n, frag); });
    el.innerHTML = "";
    el.appendChild(frag);
  }
  document.querySelectorAll(".section-title, .hero h1").forEach(splitWords);

  /* ---------- Hero entrance trigger ---------- */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { document.body.classList.add("loaded"); });
  });

  /* ---------- Hero photo 3D tilt (desktop pointers only) ---------- */
  var heroPhoto = document.querySelector(".hero-photo");
  if (heroPhoto && finePointer && !reducedMotion) {
    var heroSec = document.querySelector(".hero");
    heroSec.addEventListener("pointermove", function (e) {
      if (!heroPhoto.classList.contains("tilt-live")) return;
      var r = heroPhoto.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      heroPhoto.style.transform =
        "perspective(900px) rotateY(" + (px * 10).toFixed(2) + "deg) rotateX(" + (-py * 10).toFixed(2) + "deg)";
    });
    heroSec.addEventListener("pointerleave", function () { heroPhoto.style.transform = ""; });
    setTimeout(function () { heroPhoto.classList.add("tilt-live"); }, 1700);
  }

  /* ---------- Cursor spotlight on cards (desktop pointers only) ---------- */
  if (finePointer && !reducedMotion) {
    document.querySelectorAll(".service-card, .work-card, .team-card, .why-card, .step").forEach(function (card) {
      card.classList.add("spotlight");
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - r.left) + "px");
        card.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }

  /* ---------- Magnetic CTA buttons (desktop pointers only) ---------- */
  if (finePointer && !reducedMotion) {
    document.querySelectorAll(".btn").forEach(function (btn) {
      btn.addEventListener("pointermove", function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) / (r.width / 2);
        var y = (e.clientY - r.top - r.height / 2) / (r.height / 2);
        btn.style.transform = "translate(" + (x * 7).toFixed(1) + "px," + (y * 7).toFixed(1) + "px)";
      });
      btn.addEventListener("pointerleave", function () { btn.style.transform = ""; });
    });

    /* ---------- 3D tilt on service cards (keeps the hover lift) ---------- */
    document.querySelectorAll(".service-card").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          "perspective(950px) rotateY(" + (px * 7).toFixed(2) + "deg) rotateX(" + (-py * 7).toFixed(2) + "deg) translateY(-6px)";
      });
      card.addEventListener("pointerleave", function () { card.style.transform = ""; });
    });
  }

  /* ---------- Back-to-top button ---------- */
  var toTop = document.getElementById("toTop");
  if (toTop) {
    var topTicking = false;
    function toggleTop() {
      toTop.classList.toggle("show", window.scrollY > 600);
      topTicking = false;
    }
    window.addEventListener("scroll", function () {
      if (!topTicking) { requestAnimationFrame(toggleTop); topTicking = true; }
    }, { passive: true });
    toggleTop();
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
