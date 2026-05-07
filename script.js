/* =========================================================
   Portfolio interactions
   - Matrix rain background
   - Mobile nav
   - Smooth scroll + active link
   - Reveal-on-scroll
   - Image modal (cert + achievement)
   - Navbar scroll effect
   ========================================================= */

(function () {
  "use strict";

  /* ---------- Matrix Rain ---------- */
  function initMatrix() {
    const canvas = document.getElementById("matrix");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const chars =
      "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン{}<>[]/\\=*+-#@!?$&";
    let columns, drops, fontSize;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      fontSize = Math.max(12, Math.floor(window.innerWidth / 110));
      columns = Math.floor(canvas.width / fontSize);
      drops = new Array(columns).fill(0).map(function () { return Math.random() * -100; });
    }

    function draw() {
      ctx.fillStyle = "rgba(7, 9, 13, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#9fef00";
      ctx.font = fontSize + "px JetBrains Mono, monospace";
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        ctx.fillText(text, x, y);
        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 1;
      }
    }

    resize();
    let rafId;
    let lastTime = 0;
    function loop(ts) {
      if (ts - lastTime > 33) {
        draw();
        lastTime = ts;
      }
      rafId = requestAnimationFrame(loop);
    }

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        if (rafId) cancelAnimationFrame(rafId);
      } else {
        rafId = requestAnimationFrame(loop);
      }
    });

    let resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    });

    rafId = requestAnimationFrame(loop);
  }

  /* ---------- Mobile Nav ---------- */
  function initMobileNav() {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    if (!hamburger || !navMenu) return;

    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    document.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", function () {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
      });
    });
  }

  /* ---------- Smooth Scroll ---------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (!href || href === "#") return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const offset = 70;
          const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      });
    });
  }

  /* ---------- Active Nav Link on Scroll ---------- */
  function initActiveLink() {
    const sections = document.querySelectorAll("section[id]");
    const links = document.querySelectorAll(".nav-link");

    function updateActive() {
      let current = "";
      const scrollY = window.pageYOffset + 120;
      sections.forEach(function (section) {
        if (scrollY >= section.offsetTop) current = section.id;
      });
      links.forEach(function (link) {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + current) link.classList.add("active");
      });
    }

    window.addEventListener("scroll", updateActive, { passive: true });
    updateActive();
  }

  /* ---------- Reveal on Scroll ---------- */
  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("visible"); });
      return;
    }
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -60px 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Image Modal ---------- */
  function initModal() {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const modalCaption = document.getElementById("modalCaption");
    const modalClose = document.querySelector(".modal-close");
    if (!modal) return;

    function open(src, alt) {
      modal.classList.add("active");
      modalImg.src = src;
      modalImg.alt = alt || "";
      modalCaption.textContent = alt || "";
      document.body.style.overflow = "hidden";
    }
    function close() {
      modal.classList.remove("active");
      modalImg.src = "";
      document.body.style.overflow = "";
    }

    document.querySelectorAll(".cert-image, .achievement-image").forEach(function (box) {
      box.addEventListener("click", function () {
        const img = box.querySelector("img");
        if (img) open(img.src, img.alt);
      });
    });

    if (modalClose) modalClose.addEventListener("click", close);
    modal.addEventListener("click", function (e) {
      if (e.target === modal) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("active")) close();
    });
  }

  /* ---------- Navbar background on scroll ---------- */
  function initNavbarScroll() {
    const nav = document.querySelector(".navbar");
    if (!nav) return;
    function onScroll() {
      if (window.scrollY > 30) {
        nav.style.background = "rgba(7, 9, 13, 0.92)";
        nav.style.borderBottomColor = "rgba(159, 239, 0, 0.15)";
      } else {
        nav.style.background = "rgba(7, 9, 13, 0.78)";
        nav.style.borderBottomColor = "";
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Easter egg: Konami code ---------- */
  function initEasterEgg() {
    const code = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
    let idx = 0;
    document.addEventListener("keydown", function (e) {
      if (e.key === code[idx]) {
        idx++;
        if (idx === code.length) {
          document.body.style.transition = "filter 0.4s";
          document.body.style.filter = "hue-rotate(180deg)";
          setTimeout(function () { document.body.style.filter = ""; }, 1500);
          idx = 0;
        }
      } else {
        idx = 0;
      }
    });
  }

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    initMatrix();
    initMobileNav();
    initSmoothScroll();
    initActiveLink();
    initReveal();
    initModal();
    initNavbarScroll();
    initEasterEgg();
  });
})();
