/* ==========================================================================
   Northstone Kitchen & Bath — shared JavaScript
   Fictional business · Portfolio demonstration by Vantorax Studio
   Vanilla JS, no dependencies, no build step.
   ========================================================================== */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  /* ------------------------------------------------------------------
     Illustrative project data (used by the details modal).
     Photographs are stock images used as visual references only.
     ------------------------------------------------------------------ */
  function img(id, w) {
    return "https://images.unsplash.com/photo-" + id + "?auto=format&fit=crop&w=" + w + "&q=70";
  }

  var PROJECTS = {
    "modern-oak-kitchen": {
      title: "The Modern Oak Kitchen",
      category: "Kitchens",
      image: img("1589268395705-ecd1dca58cb9", 1400),
      alt: "Warm wood kitchen cabinetry with a sink and island, used as a visual reference",
      description:
        "An illustrative concept built around warm timber cabinetry, a practical work triangle and soft, layered lighting. The idea: let natural wood tones bring warmth while clean hardware and calm countertops keep the room feeling current.",
      points: ["Wood-toned custom cabinetry concept", "Island sized around circulation space", "Task and ambient lighting layers"]
    },
    "calm-retreat-bathroom": {
      title: "The Calm Retreat Bathroom",
      category: "Bathrooms",
      image: img("1646974400439-8472d58bb19e", 1400),
      alt: "Bright bathroom with a large bathtub beside a window, used as a visual reference",
      description:
        "An illustrative spa-inspired concept that places a soaking tub near natural light, with a restrained palette and uncluttered surfaces so the room feels quiet and restful.",
      points: ["Soaking tub positioned for natural light", "Neutral, low-contrast material palette", "Concealed storage to keep surfaces clear"]
    },
    "contemporary-family-kitchen": {
      title: "The Contemporary Family Kitchen",
      category: "Kitchens",
      image: img("1682888813795-192fca4a10d9", 1400),
      alt: "Large contemporary kitchen with a central island and marble-look countertops, used as a visual reference",
      description:
        "An illustrative concept for a busy household: a generous central island for homework and meals, durable surfaces, and clear zones for cooking, cleanup and storage.",
      points: ["Central island with seating", "Durable, easy-care surface options", "Zoned layout for cooking and cleanup"]
    },
    "timeless-vanity-suite": {
      title: "The Timeless Vanity Suite",
      category: "Bathrooms",
      image: img("1682888818704-6dc91e9d7532", 1400),
      alt: "Bathroom with green vanity cabinets and a marble-look shower, used as a visual reference",
      description:
        "An illustrative concept pairing a deep green vanity with stone-look tile and a glass-enclosed shower. Classic proportions and quality fixtures aim for a look that stays relevant for years.",
      points: ["Statement vanity with generous drawers", "Stone-look tile with a clean shower enclosure", "Fixture finishes chosen to work together"]
    },
    "bright-open-kitchen": {
      title: "The Bright Open Kitchen",
      category: "Kitchens",
      image: img("1769745241584-be9b8227e126", 1400),
      alt: "Bright minimalist kitchen with white cabinets and wooden countertops, used as a visual reference",
      description:
        "An illustrative concept that favors light, openness and simple lines: pale cabinetry, wood-toned counters and plenty of daylight to make the room feel larger and easy to live in.",
      points: ["Light cabinetry to maximize brightness", "Wood-tone worktops for warmth", "Open sightlines to adjoining rooms"]
    },
    "warm-minimalist-bathroom": {
      title: "The Warm Minimalist Bathroom",
      category: "Bathrooms",
      image: img("1593465713677-e078861911d7", 1400),
      alt: "Minimalist bathroom with a white tub and tiled walls with warm accents, used as a visual reference",
      description:
        "An illustrative concept that keeps the palette minimal while adding warmth through finish choices: soft neutrals, a freestanding tub and a few carefully chosen metal accents.",
      points: ["Minimal palette with warm accents", "Freestanding tub as the focal point", "Simple, easy-to-clean surfaces"]
    }
  };

  /* ------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------ */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  var desktopMQ = window.matchMedia("(min-width: 1000px)");

  /* ------------------------------------------------------------------
     Current-year copyright
     ------------------------------------------------------------------ */
  function initYear() {
    $all("[data-year]").forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
  }

  /* ------------------------------------------------------------------
     Image fallback: reveal the CSS fallback background if an image fails
     ------------------------------------------------------------------ */
  function initImageFallback() {
    function markFailed(image) {
      var holder = image.closest(".media, .page-hero__media, .modal__media, .concept-card, .hero-media, .cta-band__bg");
      if (holder) { holder.classList.add("img-fail"); }
      image.setAttribute("data-failed", "true");
    }
    $all("img").forEach(function (image) {
      image.addEventListener("error", function () { markFailed(image); });
      if (image.complete && image.naturalWidth === 0 && image.getAttribute("src")) { markFailed(image); }
    });
  }

  /* ------------------------------------------------------------------
     Navigation: mobile menu + services dropdown
     ------------------------------------------------------------------ */
  function initNav() {
    var toggle = $(".menu-toggle");
    var nav = $("#site-nav");
    if (!toggle || !nav) { return; }

    var dropToggle = $(".dropdown-toggle", nav);
    var dropdown = dropToggle ? document.getElementById(dropToggle.getAttribute("aria-controls")) : null;

    function setMenu(open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close main menu" : "Open main menu");
      if (!open) { setDropdown(false); }
    }

    function setDropdown(open) {
      if (!dropToggle || !dropdown) { return; }
      dropdown.classList.toggle("is-open", open);
      dropToggle.setAttribute("aria-expanded", String(open));
    }

    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });

    if (dropToggle && dropdown) {
      dropToggle.addEventListener("click", function () {
        setDropdown(dropToggle.getAttribute("aria-expanded") !== "true");
      });

      dropToggle.addEventListener("keydown", function (e) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setDropdown(true);
          var first = $("a", dropdown);
          if (first) { first.focus(); }
        }
      });

      dropdown.addEventListener("keydown", function (e) {
        var links = $all("a", dropdown);
        var idx = links.indexOf(document.activeElement);
        if (e.key === "ArrowDown") { e.preventDefault(); links[(idx + 1) % links.length].focus(); }
        if (e.key === "ArrowUp") { e.preventDefault(); links[(idx - 1 + links.length) % links.length].focus(); }
      });

      var item = dropToggle.parentElement;
      item.addEventListener("mouseenter", function () { if (desktopMQ.matches) { setDropdown(true); } });
      item.addEventListener("mouseleave", function () { if (desktopMQ.matches) { setDropdown(false); } });
      item.addEventListener("focusout", function (e) {
        if (desktopMQ.matches && e.relatedTarget && !item.contains(e.relatedTarget)) { setDropdown(false); }
      });
    }

    // Close menu after a destination is selected
    $all("a", nav).forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") { return; }
      if (dropdown && dropdown.classList.contains("is-open")) {
        setDropdown(false);
        if (dropToggle) { dropToggle.focus(); }
        return;
      }
      if (nav.classList.contains("is-open")) {
        setMenu(false);
        toggle.focus();
      }
    });

    document.addEventListener("click", function (e) {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        if (desktopMQ.matches) { setDropdown(false); } else { setMenu(false); }
      }
    });

    var onChange = function () { setMenu(false); };
    if (desktopMQ.addEventListener) { desktopMQ.addEventListener("change", onChange); }
    else if (desktopMQ.addListener) { desktopMQ.addListener(onChange); }
  }

  /* ------------------------------------------------------------------
     Scroll reveal (progressive enhancement)
     ------------------------------------------------------------------ */
  function initReveal() {
    var items = $all(".reveal");
    if (!items.length) { return; }
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------
     FAQ accordions
     ------------------------------------------------------------------ */
  function initFaq() {
    $all(".faq-trigger").forEach(function (btn) {
      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      if (!panel) { return; }
      btn.addEventListener("click", function () {
        var open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!open));
        panel.hidden = open;
      });
    });
  }

  /* ------------------------------------------------------------------
     Projects: category filters
     ------------------------------------------------------------------ */
  function initFilters() {
    var buttons = $all(".filter-btn");
    var cards = $all(".project-card");
    var status = $("#filter-status");
    if (!buttons.length || !cards.length) { return; }

    function apply(filter, label) {
      var shown = 0;
      cards.forEach(function (card) {
        var match = filter === "all" || card.getAttribute("data-category") === filter;
        card.hidden = !match;
        if (match) { shown += 1; }
      });
      buttons.forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.getAttribute("data-filter") === filter));
      });
      if (status) {
        status.textContent = "Showing " + shown + " " + (shown === 1 ? "concept" : "concepts") + " in " + label + ".";
      }
    }

    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        apply(b.getAttribute("data-filter"), b.textContent.trim());
      });
    });
  }

  /* ------------------------------------------------------------------
     Reusable accessible modal for project details
     ------------------------------------------------------------------ */
  function initModal() {
    var modal = $("#project-modal");
    if (!modal) { return; }

    var dialog = $(".modal__dialog", modal);
    var closeBtn = $(".modal__close", modal);
    var backdrop = $(".modal__backdrop", modal);
    var imgEl = $("#modal-image", modal);
    var mediaEl = $(".modal__media", modal);
    var catEl = $("#modal-category", modal);
    var titleEl = $("#modal-title", modal);
    var descEl = $("#modal-description", modal);
    var listEl = $("#modal-points", modal);
    var lastTrigger = null;

    function fill(project) {
      mediaEl.classList.remove("img-fail");
      imgEl.removeAttribute("data-failed");
      imgEl.src = project.image;
      imgEl.alt = project.alt;
      catEl.textContent = project.category + " · Illustrative concept";
      titleEl.textContent = project.title;
      descEl.textContent = project.description;
      listEl.textContent = "";
      project.points.forEach(function (p) {
        var li = document.createElement("li");
        li.textContent = p;
        listEl.appendChild(li);
      });
    }

    function open(id, trigger) {
      var project = PROJECTS[id];
      if (!project) { return; }
      lastTrigger = trigger || document.activeElement;
      fill(project);
      modal.classList.add("is-open");
      document.body.classList.add("no-scroll");
      closeBtn.focus();
    }

    function close() {
      if (!modal.classList.contains("is-open")) { return; }
      modal.classList.remove("is-open");
      document.body.classList.remove("no-scroll");
      if (lastTrigger && typeof lastTrigger.focus === "function") { lastTrigger.focus(); }
    }

    $all("[data-project]").forEach(function (btn) {
      btn.addEventListener("click", function () { open(btn.getAttribute("data-project"), btn); });
    });
    closeBtn.addEventListener("click", close);
    backdrop.addEventListener("click", close);

    modal.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { e.stopPropagation(); close(); return; }
      if (e.key !== "Tab") { return; }
      var focusables = $all("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])", dialog)
        .filter(function (el) { return !el.disabled && el.offsetParent !== null; });
      if (!focusables.length) { e.preventDefault(); return; }
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    // Deep link support: projects.html?project=modern-oak-kitchen
    try {
      var params = new URLSearchParams(window.location.search);
      var wanted = params.get("project");
      if (wanted && PROJECTS[wanted]) {
        var trigger = $('[data-project="' + wanted + '"]');
        open(wanted, trigger);
      }
    } catch (err) { /* URLSearchParams unavailable: ignore */ }
  }

  /* ------------------------------------------------------------------
     Contact form: inline validation + honest demo submission
     ------------------------------------------------------------------ */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  var RULES = {
    name: function (v) { return v.trim().length >= 2 ? "" : "Please enter your full name."; },
    email: function (v) {
      if (!v.trim()) { return "Please enter your email address."; }
      return EMAIL_RE.test(v.trim()) ? "" : "Please enter a valid email address, like name@example.com.";
    },
    phone: function (v) {
      if (!v.trim()) { return ""; }
      var digits = v.replace(/\D/g, "");
      return digits.length >= 7 && digits.length <= 15 && /^[\d\s()+.\-]+$/.test(v) ? "" : "Please enter a valid phone number or leave this blank.";
    },
    "project-type": function (v) { return v ? "" : "Please choose a project type."; },
    location: function (v) { return v.trim().length >= 3 ? "" : "Please enter your city and state or ZIP code."; },
    details: function (v) { return v.trim().length >= 20 ? "" : "Please share a few details about your project (at least 20 characters)."; },
    consent: function (_v, field) { return field.checked ? "" : "Please confirm that you agree before continuing."; }
  };

  /**
   * Hook for a real form service.
   * The demo resolves locally and sends nothing anywhere. To connect a genuine
   * service later, replace the body of this function with a fetch() call to
   * the endpoint your chosen provider gives you, and keep the same Promise
   * contract: resolve on success, reject on failure.
   */
  function submitInquiry(data) {
    void data;
    return new Promise(function (resolve) { window.setTimeout(resolve, 350); });
  }

  function initForm() {
    var form = $("#quote-form");
    if (!form) { return; }
    var status = $("#form-status");

    function fieldFor(name) { return form.elements[name]; }

    function showError(field, message) {
      var err = document.getElementById(field.id + "-error");
      if (!err) { return; }
      err.textContent = message;
      err.classList.toggle("is-visible", Boolean(message));
      if (message) { field.setAttribute("aria-invalid", "true"); }
      else { field.removeAttribute("aria-invalid"); }
    }

    function validateField(field) {
      var rule = RULES[field.id];
      if (!rule) { return true; }
      var message = rule(field.value, field);
      showError(field, message);
      return message === "";
    }

    Object.keys(RULES).forEach(function (key) {
      var field = fieldFor(key);
      if (!field) { return; }
      var evt = field.type === "checkbox" || field.tagName === "SELECT" ? "change" : "blur";
      field.addEventListener(evt, function () { validateField(field); });
      field.addEventListener("input", function () {
        if (field.getAttribute("aria-invalid") === "true") { validateField(field); }
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.className = "form-status";
      status.textContent = "";

      var firstInvalid = null;
      Object.keys(RULES).forEach(function (key) {
        var field = fieldFor(key);
        if (field && !validateField(field) && !firstInvalid) { firstInvalid = field; }
      });

      if (firstInvalid) {
        status.className = "form-status is-error";
        status.textContent = "Please fix the highlighted fields and try again. No information has been submitted.";
        firstInvalid.focus();
        return;
      }

      var submitBtn = $("button[type='submit']", form);
      submitBtn.disabled = true;
      var original = submitBtn.textContent;
      submitBtn.textContent = "Sending demo…";

      var data = {};
      new FormData(form).forEach(function (value, key) { data[key] = value; });

      submitInquiry(data).then(function () {
        status.className = "form-status is-success";
        status.textContent = "Demo submission complete. This demonstration form is not connected to a real business inbox.";
        form.reset();
        $all("[aria-invalid]", form).forEach(function (el) { el.removeAttribute("aria-invalid"); });
        $all(".error-msg", form).forEach(function (el) { el.textContent = ""; el.classList.remove("is-visible"); });
        status.setAttribute("tabindex", "-1");
        status.focus();
      }).catch(function () {
        status.className = "form-status is-error";
        status.textContent = "Something went wrong with the demo submission. Please try again.";
      }).then(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = original;
      });
    });
  }

  /* ------------------------------------------------------------------
     Init
     ------------------------------------------------------------------ */
  function init() {
    initYear();
    initImageFallback();
    initNav();
    initReveal();
    initFaq();
    initFilters();
    initModal();
    initForm();
  }

  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", init); }
  else { init(); }
})();
