/* Nazeer Ahmad Portfolio — vanilla JS interactions */
(function () {
  "use strict";

  /* ---------- Sticky header state ---------- */
  var header = document.getElementById("siteHeader");
  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
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

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  var revealEls = document.querySelectorAll(".reveal");
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

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
