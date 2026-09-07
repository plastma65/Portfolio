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

  /* ---------- Portfolio content refresh ---------- */
  function initPortfolioContent() {
    document.title = "Trần Tuấn Anh — Cyber Security & AI/ML Portfolio";

    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Trần Tuấn Anh - Cyber Security Intern portfolio with web security, HTB/CTF, AI threat detection, Luna Zero 110M and applied AI/ML projects."
      );
    }

    const heroSubtitle = document.querySelector(".hero-subtitle");
    if (heroSubtitle) {
      heroSubtitle.innerHTML = 'Cyber Security Intern · AI / ML<span class="cursor"></span>';
    }

    const heroDescription = document.querySelector(".hero-description");
    if (heroDescription) {
      heroDescription.innerHTML =
        "Sinh viên Công nghệ Thông tin tại Đại học Công nghệ Sài Gòn (STU), tập trung chính vào " +
        "<strong>Cyber Security</strong>: web security, pentesting, CTF và threat detection. " +
        "Song song, tôi xây dựng các hệ thống <strong>AI / Machine Learning</strong> và LLM từ training đến deployment. " +
        "Đang tìm kiếm cơ hội thực tập <strong>Cyber Security</strong> hoặc <strong>AI / ML</strong>, với định hướng dài hạn ở giao điểm giữa AI và Security.";
    }

    const aboutParagraphs = document.querySelectorAll(".about-text > p");
    if (aboutParagraphs.length >= 4) {
      aboutParagraphs[3].innerHTML =
        "<strong>Cyber Security là hướng tôi ưu tiên</strong>, đặc biệt là web security, pentesting, threat detection và red teaming. " +
        "Song song, tôi phát triển nền tảng AI/ML để hiểu sâu hơn các hệ thống hiện đại: xây <strong>Luna Zero</strong> — " +
        "mô hình ngôn ngữ tiếng Việt khoảng <strong>110M tham số train hoàn toàn từ số 0</strong>, fine-tune " +
        "<strong>Qwen3-4B bằng QLoRA</strong> cho Luna, và xây RAG/anomaly-detection pipeline. " +
        "Mục tiêu dài hạn là khai thác tốt cả hai năng lực tại giao điểm giữa <strong>AI và Security</strong>.";
    }

    const nlpCategory = Array.from(document.querySelectorAll(".skill-category")).find(function (card) {
      const heading = card.querySelector("h3");
      return heading && heading.textContent.includes("NLP & LLM");
    });
    if (nlpCategory) {
      const list = nlpCategory.querySelector(".skill-list");
      if (list) {
        list.innerHTML =
          '<li><span class="skill-name">Language-model training from scratch (decoder-only GPT)</span><span class="skill-level intermediate">Trung bình</span></li>' +
          '<li><span class="skill-name">Byte-level BPE &amp; tokenizer/data pipelines</span><span class="skill-level intermediate">Trung bình</span></li>' +
          '<li><span class="skill-name">RAG &amp; Semantic Search (FAISS)</span><span class="skill-level intermediate">Trung bình</span></li>' +
          '<li><span class="skill-name">Fine-tuning: QLoRA / LoRA / PEFT</span><span class="skill-level intermediate">Trung bình</span></li>' +
          '<li><span class="skill-name">Hugging Face model release &amp; evaluation</span><span class="skill-level intermediate">Trung bình</span></li>';
      }
    }

    const lunaCard = Array.from(document.querySelectorAll(".project-card")).find(function (card) {
      const title = card.querySelector(".project-title");
      return title && title.textContent.includes("Luna — Trợ lý AI");
    });

    if (lunaCard && !document.getElementById("luna-zero-project")) {
      const lunaZeroHtml = `
        <article class="project-card reveal" id="luna-zero-project">
          <div class="project-header">
            <div class="project-icon alt"><i class="fas fa-moon"></i></div>
            <div class="project-meta">
              <span class="project-tag ai">AI / LLM</span>
              <span class="project-year">2026</span>
            </div>
          </div>
          <h3 class="project-title">Luna Zero — Vietnamese Language Model from Scratch</h3>
          <div class="project-stack">
            <span class="tech-chip">Python</span>
            <span class="tech-chip">PyTorch</span>
            <span class="tech-chip">Byte-level BPE</span>
            <span class="tech-chip">Safetensors</span>
            <span class="tech-chip">Hugging Face</span>
          </div>
          <p class="project-role">
            <i class="fas fa-user-astronaut"></i> <strong>Role:</strong> Cá nhân — thiết kế, train, eval và release end-to-end
          </p>
          <ul class="project-points">
            <li>Thiết kế và train <strong>decoder-only Transformer ~110M tham số hoàn toàn từ số 0</strong> trên khoảng <strong>2,2 tỷ token tiếng Việt</strong>; không nạp pretrained weights từ model khác.</li>
            <li>Xây toàn bộ pipeline gồm <strong>Byte-level BPE 32K</strong>, xử lý/dedup dữ liệu, checkpoint/resume, autoregressive sampling và CPU/GPU inference.</li>
            <li>Final held-out trên dữ liệu human-authored đã khóa trước khi đo: <strong>NLL 3.2195, PPL 25.016</strong> trên 17.580 token; exact-document overlap bằng 0 với 2,4M raw documents.</li>
            <li>Public source theo <strong>Apache-2.0</strong> và inference-only Safetensors weights; đã kiểm vòng export → Hugging Face → clean download → CPU forward.</li>
          </ul>
          <div class="project-stats">
            <div class="pstat"><span class="pstat-value">~110M</span><span class="pstat-label">Parameters</span></div>
            <div class="pstat"><span class="pstat-value">2.2B</span><span class="pstat-label">Train Tokens</span></div>
            <div class="pstat"><span class="pstat-value">25.016</span><span class="pstat-label">Final PPL</span></div>
          </div>
          <div class="project-actions">
            <a href="https://github.com/plastma65/luna-zero-vi" target="_blank" rel="noopener" class="project-action"><i class="fab fa-github"></i> GitHub</a>
            <a href="https://huggingface.co/Lozens/Luna-Zero-110M" target="_blank" rel="noopener" class="project-action"><i class="fas fa-cube"></i> Hugging Face</a>
          </div>
        </article>`;
      lunaCard.insertAdjacentHTML("beforebegin", lunaZeroHtml);

      const lunaPoints = lunaCard.querySelectorAll(".project-points li");
      if (lunaPoints.length > 0) {
        lunaPoints[0].innerHTML =
          'Fine-tune <strong>Qwen3-4B-Instruct với QLoRA</strong> (4-bit bitsandbytes, LoRA adapters qua PEFT, SFTTrainer) trên persona dataset tự xây dựng.';
      }
      if (lunaPoints.length > 1) {
        lunaPoints[1].innerHTML =
          'Xây <strong>RAG pipeline trên 476 tài liệu</strong>: multilingual E5 embeddings, FAISS cosine index, hybrid semantic + keyword retrieval với title weighting và relevance thresholding.';
      }
      const sourceLink = lunaCard.querySelector(".project-actions a");
      if (sourceLink) sourceLink.href = "https://github.com/plastma65/luna-vi-companion";
    }

    const googleCertCard = Array.from(document.querySelectorAll(".cert-card")).find(function (card) {
      const title = card.querySelector("h3");
      return title && title.textContent.includes("Google Cybersecurity Professional Certificate");
    });
    if (googleCertCard) {
      const status = googleCertCard.querySelector(".cert-status");
      if (status) status.innerHTML = '<i class="fas fa-spinner"></i> 6 / 9 khoá';

      const progressFill = googleCertCard.querySelector(".cert-progress-fill, .progress-fill");
      if (progressFill) progressFill.style.width = "66.7%";
      const progressText = googleCertCard.querySelector(".cert-progress-percent, .progress-percent");
      if (progressText) progressText.textContent = "67%";

      const oldLooseLink = googleCertCard.querySelector(".course-6-certificate");
      if (oldLooseLink) oldLooseLink.remove();

      const course6 = Array.from(googleCertCard.querySelectorAll(".course-item")).find(function (item) {
        const num = item.querySelector(".course-num");
        return num && num.textContent.trim() === "06";
      });
      if (course6) {
        course6.classList.remove("pending");
        course6.classList.add("done");

        const date = course6.querySelector(".course-date");
        if (date) date.innerHTML = '<i class="fas fa-calendar-check"></i> 07/09/2026';

        let link = course6.querySelector(".course-link");
        if (!link) {
          link = document.createElement("a");
          link.className = "course-link";
          course6.appendChild(link);
        }
        link.href = "https://coursera.org/share/42ee829052ffb110e8b21ecc0e398abf";
        link.target = "_blank";
        link.rel = "noopener";
        link.innerHTML = '<i class="fas fa-certificate"></i> Xem';
      }
    }

    const learningIntro = document.querySelector("#learning .learning-intro");
    if (learningIntro && !document.getElementById("security-learning-path")) {
      const path = document.createElement("p");
      path.id = "security-learning-path";
      path.innerHTML =
        "<strong>Lộ trình hiện tại:</strong> Google Cybersecurity Professional Certificate (6/9), " +
        "HTB Academy Junior Cybersecurity Analyst (đang học). Tiếp theo dự kiến: " +
        "Penetration Tester, Web Penetration Tester và AI Red Teaming.";
      learningIntro.appendChild(path);
    }
  }

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    initPortfolioContent();
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
