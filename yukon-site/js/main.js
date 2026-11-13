/* YUKON — Big Land. Bigger Dreams. */
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };

  /* ---------- features that never need GSAP ---------- */
  function common() {
    if (common.done) return; common.done = true;
    var hdr = $("#hdr"), menu = $("#menu"), burger = $("#burger");
    $("#theme").addEventListener("click", function () {
      var dark = root.getAttribute("data-theme") === "dark" ||
        (!root.getAttribute("data-theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
      root.setAttribute("data-theme", dark ? "light" : "dark");
    });
    function setMenu(o) {
      menu.classList.toggle("open", o);
      burger.setAttribute("aria-expanded", o);
      if (window.__lenis) { o ? window.__lenis.stop() : window.__lenis.start(); }
      else { document.body.style.overflow = o ? "hidden" : ""; }
    }
    burger.addEventListener("click", function () { setMenu(!menu.classList.contains("open")); });
    window.__closeMenu = function () { if (menu.classList.contains("open")) setMenu(false); };

    /* video: plays /video/yukon.mp4 as soon as the file exists */
    var vid = $("#vid"), play = $("#play"), src = vid.getAttribute("data-src");
    var ready = false, v = null;
    fetch(src, { method: "HEAD" }).then(function (r) {
      if (r.ok && /video/.test(r.headers.get("content-type") || "")) {
        v = document.createElement("video");
        v.src = src; v.controls = true; v.playsInline = true; v.preload = "metadata";
        vid.appendChild(v); ready = true;
      }
    }).catch(function () {});
    play.addEventListener("click", function () {
      if (!ready) return;
      vid.classList.add("playing"); v.play();
    });
    if (!hdr) return;
  }

  function fail() {
    root.classList.add("no-anim");
    var p = $(".preloader"); if (p) p.remove();
  }

  if (reduce || !window.gsap || !window.ScrollTrigger) { fail(); common(); return; }

  try { init(); } catch (e) { console.error(e); fail(); common(); }

  /* ---------- helpers ---------- */
  function splitWords(el) {
    var nodes = [].slice.call(el.childNodes), words = [];
    el.textContent = "";
    function mk(c) {
      var w = document.createElement("span"); w.className = "w";
      var i = document.createElement("span"); i.className = "wi";
      if (typeof c === "string") i.textContent = c; else i.appendChild(c);
      w.appendChild(i); el.appendChild(w); words.push(i);
    }
    nodes.forEach(function (n) {
      if (n.nodeType === 3) {
        n.textContent.split(/(\s+)/).forEach(function (t) {
          if (!t) return;
          if (/^\s+$/.test(t)) el.appendChild(document.createTextNode(" ")); else mk(t);
        });
      } else if (n.classList && n.classList.contains("ln")) {
        el.appendChild(n); words = words.concat(splitWords(n));
      } else mk(n);
    });
    return words;
  }
  function fmt(v, d) { return v.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }); }

  /* ---------- main ---------- */
  function init() {
    gsap.registerPlugin(ScrollTrigger);
    common();

    /* smooth scroll */
    var lenis = null;
    if (window.Lenis) {
      lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95 });
      window.__lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
      lenis.stop();
    }
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href");
        if (id.length < 2) return;
        var t = $(id); if (!t) return;
        e.preventDefault(); window.__closeMenu();
        if (lenis) lenis.scrollTo(id === "#top" ? 0 : t, { offset: -64, duration: 1.7 });
        else t.scrollIntoView({ behavior: "smooth" });
      });
    });

    /* header hide / solid */
    var hdr = $("#hdr");
    ScrollTrigger.create({
      start: 0, end: "max",
      onUpdate: function (self) {
        var y = self.scroll();
        hdr.classList.toggle("solid", y > 60);
        hdr.classList.toggle("hide", self.direction === 1 && y > 500);
      }
    });
    /* active nav link */
    $$(".nav a").forEach(function (a) {
      var s = $(a.getAttribute("href")); if (!s) return;
      ScrollTrigger.create({
        trigger: s, start: "top 55%", end: "bottom 55%",
        onToggle: function (self) { a.classList.toggle("on", self.isActive); }
      });
    });

    /* cursor + magnetic buttons */
    if (fine) {
      var cur = $(".cursor");
      var qx = gsap.quickTo(cur, "x", { duration: 0.35, ease: "power3" });
      var qy = gsap.quickTo(cur, "y", { duration: 0.35, ease: "power3" });
      window.addEventListener("mousemove", function (e) { qx(e.clientX); qy(e.clientY); });
      $$("a,button,.card,.panel,.tile").forEach(function (el) {
        el.addEventListener("mouseenter", function () { cur.classList.add("big"); });
        el.addEventListener("mouseleave", function () { cur.classList.remove("big"); });
      });
      $$(".btn,.icon-btn").forEach(function (el) {
        el.addEventListener("mousemove", function (e) {
          var r = el.getBoundingClientRect();
          gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.4, duration: 0.4 });
        });
        el.addEventListener("mouseleave", function () { gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1,.4)" }); });
      });
    }

    /* ---------- initial states (hidden behind the preloader) ---------- */
    var heroLetters = $$("h1.mega span");
    var sloganWords = splitWords($(".slogan"));
    gsap.set(heroLetters, { yPercent: 115 });
    gsap.set(sloganWords, { yPercent: 115 });
    gsap.set([".eyebrow", ".hero-cta", ".hero-foot", ".scroll-cue", ".hdr"], { autoAlpha: 0 });
    gsap.set(".hero-img", { scale: 1.3 });

    /* ---------- preloader ---------- */
    var pl = $(".preloader"), count = $(".pl-count"), plLetters = $$(".pl-word span");
    gsap.set(plLetters, { yPercent: 110 });
    var counter = { v: 0 }, loaded = false, minDone = false;
    function go() { if (loaded && minDone) outro(); }
    window.addEventListener("load", function () { loaded = true; go(); });
    if (document.readyState === "complete") loaded = true;
    gsap.timeline({ onComplete: function () { minDone = true; go(); } })
      .to(plLetters, { yPercent: 0, duration: 1, stagger: 0.07, ease: "power4.out" }, 0)
      .to(counter, { v: 100, duration: 1.7, ease: "power2.inOut", onUpdate: function () { count.textContent = Math.round(counter.v); } }, 0);
    setTimeout(function () { loaded = minDone = true; go(); }, 6000);

    var done = false;
    function outro() {
      if (done) return; done = true;
      if (lenis) lenis.start();
      gsap.timeline()
        .to(plLetters, { yPercent: -110, duration: 0.7, stagger: 0.04, ease: "power3.in" })
        .to(".pl-top,.pl-foot", { autoAlpha: 0, duration: 0.3 }, "<")
        .to(pl, { yPercent: -100, duration: 1.1, ease: "power4.inOut" }, "-=0.2")
        .add(heroIn, "-=0.6")
        .add(function () { pl.remove(); ScrollTrigger.refresh(); });
    }
    function heroIn() {
      var tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.to(".hero-img", { scale: 1, duration: 2.4, ease: "power3.out" }, 0)
        .to(".hdr", { autoAlpha: 1, duration: 1 }, 0.4)
        .to(".eyebrow", { autoAlpha: 1, duration: 1 }, 0.3)
        .to(heroLetters, { yPercent: 0, duration: 1.4, stagger: 0.09 }, 0.2)
        .to(sloganWords, { yPercent: 0, duration: 1.1, stagger: 0.08 }, 0.9)
        .to([".hero-cta", ".hero-foot", ".scroll-cue"], { autoAlpha: 1, duration: 1, stagger: 0.12 }, 1.2);
    }

    /* ---------- hero scroll ---------- */
    gsap.to(".hero-img", { yPercent: 14, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".hero-in", { yPercent: -10, autoAlpha: 0.15, ease: "none", scrollTrigger: { trigger: ".hero", start: "20% top", end: "bottom top", scrub: true } });

    /* ---------- section titles ---------- */
    $$(".sec h2, .h-sec h2, .concl h2").forEach(function (h) {
      var ws = splitWords(h);
      gsap.from(ws, { yPercent: 115, duration: 1.3, stagger: 0.07, ease: "power4.out", scrollTrigger: { trigger: h, start: "top 88%" } });
    });
    $$(".num").forEach(function (n) {
      gsap.from(n, { autoAlpha: 0, x: -20, duration: 1, ease: "power3.out", scrollTrigger: { trigger: n, start: "top 92%" } });
    });

    /* ---------- generic reveals ---------- */
    $$("[data-reveal]").forEach(function (el) {
      var d = parseFloat(el.getAttribute("data-delay") || 0);
      gsap.from(el, { y: 60, autoAlpha: 0, duration: 1.2, delay: d, ease: "power4.out", scrollTrigger: { trigger: el, start: "top 90%" } });
    });
    $$("[data-stagger]").forEach(function (g) {
      gsap.from(g.children, { y: 70, autoAlpha: 0, duration: 1.2, stagger: 0.14, ease: "power4.out", scrollTrigger: { trigger: g, start: "top 85%" } });
    });

    /* ---------- image frames: clip reveal + parallax ---------- */
    $$(".frame").forEach(function (f) {
      var img = $("img", f);
      gsap.fromTo(f, { clipPath: "inset(14% 10% 14% 10% round 28px)" },
        { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1.6, ease: "power4.out", scrollTrigger: { trigger: f, start: "top 88%" } });
      gsap.from(img, { scale: 1.35, duration: 2, ease: "power3.out", scrollTrigger: { trigger: f, start: "top 88%" } });
      if (!f.classList.contains("noparallax")) {
        gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: f, start: "top bottom", end: "bottom top", scrub: true } });
      }
    });
    $$(".band > img, .concl-bg img").forEach(function (img) {
      var t = img.closest(".band") || img.closest(".concl");
      gsap.fromTo(img, { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: t, start: "top bottom", end: "bottom top", scrub: true } });
    });

    /* ---------- counters ---------- */
    $$("[data-count]").forEach(function (el) {
      var end = parseFloat(el.dataset.count), d = parseInt(el.dataset.decimals || "0", 10);
      var pre = el.dataset.prefix || "", suf = el.dataset.suffix || "", o = { v: 0 };
      el.textContent = pre + fmt(0, d) + suf;
      ScrollTrigger.create({
        trigger: el, start: "top 88%", once: true,
        onEnter: function () {
          gsap.to(o, { v: end, duration: 2.2, ease: "power3.out", onUpdate: function () { el.textContent = pre + fmt(o.v, d) + suf; } });
        }
      });
    });

    /* ---------- horizontal landscapes ---------- */
    var mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", function () {
      var sec = $(".h-sec"), track = $(".h-track"), bar = $(".h-progress i");
      var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth + 40); };
      gsap.to(track, {
        x: function () { return -dist(); }, ease: "none",
        scrollTrigger: {
          trigger: sec, start: "top top", end: function () { return "+=" + dist(); },
          pin: true, scrub: 0.7, anticipatePin: 1, invalidateOnRefresh: true,
          onUpdate: function (s) { gsap.set(bar, { scaleX: s.progress }); }
        }
      });
      gsap.from(".panel", { y: 80, autoAlpha: 0, duration: 1.3, stagger: 0.15, ease: "power4.out", scrollTrigger: { trigger: sec, start: "top 70%" } });
    });
    mm.add("(max-width: 1023px)", function () {
      $$(".panel").forEach(function (p) {
        gsap.from(p, { y: 60, autoAlpha: 0, duration: 1.2, ease: "power4.out", scrollTrigger: { trigger: p, start: "top 88%" } });
      });
    });

    /* ---------- compare rows ---------- */
    $$(".cmp-r").forEach(function (r, i) {
      gsap.from(r.children, { y: 50, autoAlpha: 0, duration: 1.1, stagger: 0.1, ease: "power4.out", scrollTrigger: { trigger: r, start: "top 90%" } });
    });
    gsap.from(".cmp-h > *", { y: 40, autoAlpha: 0, duration: 1, stagger: 0.1, ease: "power4.out", scrollTrigger: { trigger: ".cmp-h", start: "top 90%" } });

    /* ---------- marquee reacts to scroll speed ---------- */
    var mq = $(".mq");
    if (mq) {
      var tw = gsap.to(mq, { xPercent: -50, duration: 26, ease: "none", repeat: -1 });
      ScrollTrigger.create({
        onUpdate: function (s) { tw.timeScale(Math.min(7, 1 + Math.abs(s.getVelocity()) / 350)); }
      });
      gsap.ticker.add(function () { if (tw.timeScale() > 1) tw.timeScale(Math.max(1, tw.timeScale() * 0.955)); });
    }

    /* ---------- conclusion extras ---------- */
    gsap.from(".concl .kw, .concl .come, .concl .btn", { y: 40, autoAlpha: 0, duration: 1.1, stagger: 0.14, ease: "power4.out", scrollTrigger: { trigger: ".concl .kw", start: "top 90%" } });
    gsap.from(".mega-foot", { yPercent: 40, autoAlpha: 0, duration: 1.6, ease: "power4.out", scrollTrigger: { trigger: ".mega-foot", start: "top 100%" } });

    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
  }
})();
