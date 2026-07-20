(function () {
  "use strict";

  var LANG_KEY = "yf-journey-lang";

  function data() {
    return window.JOURNEY_DATA;
  }

  function getLang() {
    var stored = localStorage.getItem(LANG_KEY);
    if (stored === "fa" || stored === "en") return stored;
    return "en";
  }

  function setLang(lang) {
    if (lang !== "fa" && lang !== "en") return;
    localStorage.setItem(LANG_KEY, lang);
    applyDocumentLang(lang);
    window.dispatchEvent(new CustomEvent("yf-lang-change", { detail: { lang: lang } }));
  }

  function applyDocumentLang(lang) {
    var html = document.documentElement;
    html.lang = lang;
    html.dir = lang === "fa" ? "rtl" : "ltr";
    document.body.classList.toggle("lang-fa", lang === "fa");
    document.body.classList.toggle("lang-en", lang === "en");
    syncLangToggle(lang);
  }

  function syncLangToggle(lang) {
    document.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
      btn.classList.toggle("on", btn.getAttribute("data-lang-btn") === lang);
    });
  }

  var FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
  var AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";

  /** Western ↔ Persian digits so FA UI never shows 1,2,12 and EN never shows ۱،۲،۱۲ */
  function localizeDigits(value) {
    if (Array.isArray(value)) {
      return value.map(function (item) {
        return localizeDigits(item);
      });
    }
    var s = String(value == null ? "" : value);
    if (getLang() === "fa") {
      return s
        .replace(/[0-9]/g, function (d) {
          return FA_DIGITS[Number(d)];
        })
        .replace(/[٠-٩]/g, function (d) {
          return FA_DIGITS[AR_DIGITS.indexOf(d)];
        });
    }
    return s
      .replace(/[۰-۹]/g, function (d) {
        return String(FA_DIGITS.indexOf(d));
      })
      .replace(/[٠-٩]/g, function (d) {
        return String(AR_DIGITS.indexOf(d));
      });
  }

  /** Persian typography: exactly one space after sentence-ending dot, no space before punctuation */
  function normalizeFaPunctuation(value) {
    if (getLang() !== "fa") return value;
    if (Array.isArray(value)) {
      return value.map(function (item) {
        return normalizeFaPunctuation(item);
      });
    }
    return String(value == null ? "" : value)
      .replace(/\s+([.؟!])/g, "$1")
      .replace(/\.([^\s.\n])/g, ". $1")
      .replace(/([،؛:])(?=[^\s])/g, "$1 ")
      .replace(/ {2,}/g, " ")
      .trim();
  }

  function formatLocalized(value) {
    return normalizeFaPunctuation(localizeDigits(value));
  }

  /** Pick bilingual field: {en,fa} or plain string fallback */
  function L(field) {
    if (field == null) return "";
    var out;
    if (typeof field === "string") out = field;
    else if (typeof field === "object") {
      var lang = getLang();
      if (field[lang] != null) out = field[lang];
      else if (field.en != null) out = field.en;
      else if (field.fa != null) out = field.fa;
      else if (Array.isArray(field)) out = field;
      else out = String(field);
    } else out = String(field);
    return formatLocalized(out);
  }

  function ui(key) {
    var d = data();
    if (!d || !d.ui || !d.ui[key]) return key;
    return L(d.ui[key]);
  }

  function fmt(template, vars) {
    var mapped = {};
    Object.keys(vars || {}).forEach(function (k) {
      mapped[k] = localizeDigits(vars[k]);
    });
    return localizeDigits(
      String(template).replace(/\{(\w+)\}/g, function (_, k) {
        return mapped[k] != null ? mapped[k] : "";
      })
    );
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function ensureSentence(text) {
    var s = String(text == null ? "" : text).trim();
    if (!s) return "";
    if (/[.؟!]$/.test(s)) return s;
    return s + ".";
  }

  function listHtml(bilingualList) {
    var items = L(bilingualList);
    if (!items || !items.length) return "<p class='muted'>" + esc(ui("emptyDash")) + "</p>";
    if (!Array.isArray(items)) return "<p class='sentence-list'>" + esc(ensureSentence(items)) + "</p>";
    return "<p class='sentence-list'>" + esc(items.map(ensureSentence).join(" ")) + "</p>";
  }

  var gallery = [];
  var gIndex = 0;

  function ensureLb() {
    if (document.getElementById("lb")) return;
    var el = document.createElement("div");
    el.id = "lb";
    el.className = "lightbox";
    el.innerHTML = '<button class="x" type="button" aria-label="Close">×</button><img alt=""/><div class="cap"></div>';
    document.body.appendChild(el);
    el.querySelector(".x").onclick = closeLb;
    el.onclick = function (e) { if (e.target === el) closeLb(); };
    document.addEventListener("keydown", function (e) {
      if (!el.classList.contains("open")) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowRight") nav(1);
      if (e.key === "ArrowLeft") nav(-1);
    });
  }

  function openLb(tool, tools) {
    ensureLb();
    gallery = (tools || [tool]).filter(function (t) { return t && t.image; });
    gIndex = Math.max(0, gallery.findIndex(function (t) { return t.id === tool.id; }));
    if (gIndex < 0) gIndex = 0;
    showLb();
    document.getElementById("lb").classList.add("open");
  }

  function closeLb() {
    var el = document.getElementById("lb");
    if (el) el.classList.remove("open");
  }

  function nav(d) {
    if (!gallery.length) return;
    gIndex = (gIndex + d + gallery.length) % gallery.length;
    showLb();
  }

  function showLb() {
    var t = gallery[gIndex];
    var el = document.getElementById("lb");
    if (!t || !el) return;
    el.querySelector("img").src = t.image;
    el.querySelector(".cap").textContent = t.title + (t.route ? " · " + t.route : "");
  }

  function toolCard(t, tools) {
    var div = document.createElement("div");
    div.className = "tool" + (t.isMobile ? " mobile" : "");
    div.innerHTML =
      (t.image ? '<img src="' + t.image + '" alt="' + esc(t.title) + '" loading="lazy"/>' : "<div style='aspect-ratio:16/10;background:#f5f5f4'></div>") +
      '<div class="cap">' + esc(t.title) +
      '<div class="route">' + esc(t.route || "") + "</div></div>";
    div.onclick = function () { openLb(t, tools); };
    return div;
  }

  function renderChapter(ch) {
    var art = document.createElement("article");
    art.className = "chapter" + (ch.critical ? " critical" : "");
    art.id = ch.id;

    var head =
      '<div class="chapter-head">' +
      '<div class="kicker">' +
      esc(fmt(ui("chapterOf"), { n: ch.n, total: data().chapters.length })) +
      "</div>" +
      "<h3>" + esc(L(ch.title)) + "</h3>" +
      '<div class="meta-row">' +
      '<span class="chip">👤 ' + esc(L(ch.actor)) + "</span>" +
      '<span class="chip setting">📍 ' + esc(L(ch.setting)) + "</span>" +
      (ch.phaseHint ? '<span class="chip setting">' + esc(L(ch.phaseHint)) + "</span>" : "") +
      "</div></div>";

    var body = '<div class="chapter-body">';
    body += '<p class="scene">' + esc(L(ch.scene)) + "</p>";
    body += '<div class="why"><strong>' + esc(ui("whyLabel")) + "</strong><br/>" + esc(L(ch.whyItMatters)) + "</div>";

    if (ch.critical && ch.criticalNote) {
      body +=
        '<div class="alert critical-alert"><strong>' +
        esc(ui("criticalLabel")) +
        "</strong><br/>" +
        esc(L(ch.criticalNote)) +
        "</div>";
    }
    if (ch.parallelNote) {
      body += '<div class="alert">' + esc(L(ch.parallelNote)) + "</div>";
    }

    body += '<div class="grid-2">';
    body += '<div class="block"><h4>' + esc(ui("physicalLabel")) + "</h4>" + listHtml(ch.physicalWorld) + "</div>";
    body += '<div class="block"><h4>' + esc(ui("userDoesLabel")) + "</h4>" + listHtml(ch.userDoes) + "</div>";
    body += "</div>";

    body += '<div class="grid-2">';
    body += '<div class="block"><h4>' + esc(ui("systemLabel")) + "</h4>" + listHtml(ch.softwareChanges) + "</div>";
    body += '<div class="block"><h4>' + esc(ui("rulesLabel")) + "</h4>" + listHtml(ch.rules) + "</div>";
    body += "</div>";

    body +=
      '<div class="done"><span class="done-prefix">' +
      esc(ui("donePrefix")) +
      "</span>" +
      esc(L(ch.doneWhen)) +
      "</div>";

    body +=
      '<div class="tools"><h4>' +
      esc(ui("toolsLabel")) +
      "</h4>" +
      '<p class="tools-note">' +
      esc(ui("toolsNote")) +
      "</p>" +
      '<div class="tool-rail" data-tools></div></div>';

    art.innerHTML = head + body;
    var rail = art.querySelector("[data-tools]");
    (ch.tools || []).forEach(function (t) {
      rail.appendChild(toolCard(t, ch.tools));
    });
    return art;
  }

  function renderProgress(container, chapters) {
    container.innerHTML = "";
    var label = document.createElement("div");
    label.className = "rail-label";
    label.textContent = fmt(ui("chapterNavLabel"), { total: chapters.length });
    container.appendChild(label);

    var row = document.createElement("div");
    row.className = "progress-row";
    chapters.forEach(function (ch) {
      var a = document.createElement("a");
      a.href = "#" + ch.id;
      a.className = "progress-dot" + (ch.critical ? " crit" : "");
      a.title = L(ch.title) + (ch.critical ? " — " + ui("criticalBadge") : "");
      a.innerHTML =
        '<span class="num">' +
        esc(localizeDigits(ch.n)) +
        "</span>" +
        (ch.critical ? '<span class="crit-mark" title="' + esc(ui("criticalBadge")) + '">★</span>' : "");
      row.appendChild(a);
    });
    container.appendChild(row);
  }

  function renderLifecycle(container) {
    var d = data();
    if (!d || !d.lifecycle) return;
    container.innerHTML = "";

    var total = d.lifecycle.length;
    var label = document.createElement("div");
    label.className = "rail-label";
    label.textContent = fmt(ui("lifecycleRibbonLabel"), { total: total });
    container.appendChild(label);

    var row = document.createElement("div");
    row.className = "lifecycle-row";
    d.lifecycle.forEach(function (step, i) {
      if (i) {
        var ar = document.createElement("span");
        ar.className = "life-arrow";
        ar.textContent = getLang() === "fa" ? "←" : "→";
        row.appendChild(ar);
      }
      var el = document.createElement("span");
      el.className = "life-step";
      el.innerHTML =
        '<span class="life-n">' +
        esc(localizeDigits(i + 1 + "/" + total)) +
        "</span>" +
        "<b>" +
        esc(L(step.plain)) +
        "</b>" +
        esc(step.status);
      row.appendChild(el);
    });
    container.appendChild(row);
  }

  function initPictureMode() {
    var btn = document.getElementById("picture-mode");
    if (!btn) return;
    function sync() {
      var on = document.body.classList.contains("picture-mode");
      btn.classList.toggle("on", on);
      btn.textContent = on ? ui("showStoryText") : ui("picturesOnly");
    }
    btn.onclick = function () {
      document.body.classList.toggle("picture-mode");
      sync();
    };
    sync();
    window.addEventListener("yf-lang-change", sync);
  }

  function initLangToggle() {
    applyDocumentLang(getLang());
    document.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
      btn.onclick = function () {
        setLang(btn.getAttribute("data-lang-btn"));
      };
    });
  }

  function langSwitcherHtml() {
    return (
      '<div class="lang-switch" role="group" aria-label="Language">' +
      '<button type="button" data-lang-btn="en">EN</button>' +
      '<button type="button" data-lang-btn="fa">فا</button>' +
      "</div>"
    );
  }

  function bindChrome(selectors) {
    Object.keys(selectors).forEach(function (sel) {
      var el = document.querySelector(sel);
      if (!el) return;
      var key = selectors[sel];
      function paint() {
        el.textContent = ui(key);
      }
      paint();
      window.addEventListener("yf-lang-change", paint);
    });
  }

  window.YardStory = {
    data: data,
    esc: esc,
    L: L,
    ui: ui,
    fmt: fmt,
    localizeDigits: localizeDigits,
    getLang: getLang,
    setLang: setLang,
    applyDocumentLang: applyDocumentLang,
    initLangToggle: initLangToggle,
    langSwitcherHtml: langSwitcherHtml,
    bindChrome: bindChrome,
    renderChapter: renderChapter,
    renderProgress: renderProgress,
    renderLifecycle: renderLifecycle,
    initPictureMode: initPictureMode,
    openLb: openLb,
    listHtml: listHtml,
  };
})();
