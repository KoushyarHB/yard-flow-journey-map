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

  var glossaryEntries = null;
  var glossaryById = null;

  function getGlossaryById() {
    if (glossaryById) return glossaryById;
    var d = data();
    glossaryById = {};
    if (d && d.glossary && d.glossary.terms) {
      d.glossary.terms.forEach(function (t) {
        glossaryById[t.id] = t;
      });
    }
    return glossaryById;
  }

  function termMeaning(id) {
    var t = getGlossaryById()[id];
    return t ? L(t.meaning) : "";
  }

  function termPairLabel(id) {
    var t = getGlossaryById()[id];
    if (!t) return "";
    return t.en + " · " + t.fa;
  }

  function escapeRegex(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function buildGlossaryEntries() {
    if (glossaryEntries) return glossaryEntries;
    var d = data();
    if (!d || !d.glossary || !d.glossary.terms) {
      glossaryEntries = [];
      return glossaryEntries;
    }
    var out = [];
    d.glossary.terms.forEach(function (t) {
      function add(phrase, lang) {
        var p = String(phrase || "").trim();
        if (p.length < 2) return;
        out.push({ phrase: p, id: t.id, lang: lang, len: p.length });
      }
      add(t.en, "en");
      add(t.fa, "fa");
      (t.aliasesEn || []).forEach(function (a) {
        add(a, "en");
      });
      (t.aliasesFa || []).forEach(function (a) {
        add(a, "fa");
      });
    });
    out.sort(function (a, b) {
      return b.len - a.len;
    });
    glossaryEntries = out;
    return glossaryEntries;
  }

  function captureGlossaryReturn() {
    var page = location.pathname.split("/").pop() || "index.html";
    if (page === "glossary.html") return "";
    var q = location.search.replace(/^\?/, "");
    if (q) {
      q =
        "?" +
        q
          .split("&")
          .filter(function (p) {
            return p.indexOf("return=") !== 0;
          })
          .join("&");
      if (q === "?") q = "";
    }
    return page + q + location.hash;
  }

  function safeReturnUrl(raw) {
    if (!raw || typeof raw !== "string") return "story.html";
    if (!/^[\w.-]+\.html(\?[^#]*)?(#[\w.-]*)?$/i.test(raw)) return "story.html";
    return raw;
  }

  function resolveGlossaryReturn() {
    var fromQuery = new URLSearchParams(location.search).get("return");
    if (fromQuery) return safeReturnUrl(decodeURIComponent(fromQuery));
    if (document.referrer) {
      try {
        var u = new URL(document.referrer);
        if (u.origin === location.origin) {
          var name = u.pathname.split("/").pop();
          if (name && name !== "glossary.html") {
            return safeReturnUrl(name + u.search + u.hash);
          }
        }
      } catch (e) {
        /* ignore */
      }
    }
    return "story.html";
  }

  function glossaryHrefForTerm(id) {
    var href = "glossary.html";
    var ret = captureGlossaryReturn();
    if (ret) href += "?return=" + encodeURIComponent(ret);
    return href + "#glossary-" + id;
  }

  function phraseRegex(phrase, lang) {
    if (lang === "fa") {
      var parts = String(phrase)
        .split("")
        .map(function (c) {
          return escapeRegex(c) + "\\u200c?";
        });
      return new RegExp(parts.join(""), "g");
    }
    return new RegExp(escapeRegex(phrase), "gi");
  }

  function linkGlossary(text) {
    var raw = String(text == null ? "" : text);
    if (!raw) return "";
    var s = esc(raw);
    var lang = getLang();
    var entries = buildGlossaryEntries().filter(function (e) {
      return e.lang === lang;
    });
    if (!entries.length) return s;

    var used = new Array(s.length);
    var i;
    for (i = 0; i < used.length; i++) used[i] = false;

    var replacements = [];
    entries.forEach(function (e) {
      var re = phraseRegex(e.phrase, lang);
      var m;
      while ((m = re.exec(s)) !== null) {
        var start = m.index;
        var end = start + m[0].length;
        var overlap = false;
        for (i = start; i < end; i++) {
          if (used[i]) {
            overlap = true;
            break;
          }
        }
        if (overlap) continue;
        for (i = start; i < end; i++) used[i] = true;
        replacements.push({ start: start, end: end, id: e.id, text: m[0] });
      }
    });

    replacements.sort(function (a, b) {
      return a.start - b.start;
    });

    var result = "";
    var pos = 0;
    replacements.forEach(function (r) {
      result += s.slice(pos, r.start);
      var meaning = termMeaning(r.id);
      var pair = termPairLabel(r.id);
      var tip = pair ? pair + "\n" + meaning : meaning;
      result +=
        '<a class="gloss-term" href="' +
        esc(glossaryHrefForTerm(r.id)) +
        '" data-tip="' +
        esc(tip) +
        '" aria-label="' +
        esc(pair ? pair + ": " + meaning : meaning) +
        '">' +
        r.text +
        "</a>";
      pos = r.end;
    });
    result += s.slice(pos);
    return result;
  }

  function glossaryHtml(text) {
    return linkGlossary(formatLocalized(text));
  }

  function listHtml(bilingualList) {
    var items = L(bilingualList);
    if (!items || !items.length) return "<p class='muted'>" + esc(ui("emptyDash")) + "</p>";
    if (!Array.isArray(items)) return "<p class='sentence-list'>" + glossaryHtml(items) + "</p>";
    return (
      "<p class='sentence-list'>" +
      items
        .map(function (item) {
          return glossaryHtml(ensureSentence(item));
        })
        .join(" ") +
      "</p>"
    );
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
      "<h3>" + glossaryHtml(L(ch.title)) + "</h3>" +
      '<div class="meta-row">' +
      '<span class="chip">👤 ' + glossaryHtml(L(ch.actor)) + "</span>" +
      '<span class="chip setting">📍 ' + glossaryHtml(L(ch.setting)) + "</span>" +
      (ch.phaseHint ? '<span class="chip setting">' + glossaryHtml(L(ch.phaseHint)) + "</span>" : "") +
      "</div></div>";

    var body = '<div class="chapter-body">';
    body += '<p class="scene">' + glossaryHtml(L(ch.scene)) + "</p>";
    body +=
      '<div class="why"><strong>' +
      esc(ui("whyLabel")) +
      "</strong><br/>" +
      glossaryHtml(L(ch.whyItMatters)) +
      "</div>";

    if (ch.critical && ch.criticalNote) {
      body +=
        '<div class="alert critical-alert"><strong>' +
        esc(ui("criticalLabel")) +
        "</strong><br/>" +
        glossaryHtml(L(ch.criticalNote)) +
        "</div>";
    }
    if (ch.parallelNote) {
      body += '<div class="alert">' + glossaryHtml(L(ch.parallelNote)) + "</div>";
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
      glossaryHtml(L(ch.doneWhen)) +
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
        glossaryHtml(L(step.plain)) +
        "</b>" +
        glossaryHtml(L(step.status));
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

  function glossarySourceLabel(src) {
    if (!src) return ui("glossarySourceDomain");
    if (src.type === "web") return ui("glossarySourceWeb");
    return ui("glossarySourceDomain");
  }

  function glossaryCategoryLabel(catId) {
    var d = data();
    if (!d || !d.glossary) return catId;
    var cat = (d.glossary.categories || []).find(function (c) {
      return c.id === catId;
    });
    return cat ? L(cat.label) : catId;
  }

  function renderGlossary(root, opts) {
    var d = data();
    if (!d || !d.glossary) return;
    opts = opts || {};
    var terms = d.glossary.terms || [];
    var q = String(opts.query || "").trim().toLowerCase();
    var cat = opts.category || "";

    var filtered = terms.filter(function (t) {
      if (cat && t.category !== cat) return false;
      if (!q) return true;
      var hay =
        (t.en + " " + t.fa + " " + (t.aliasesEn || []).join(" ") + " " + (t.aliasesFa || []).join(" ") +
        " " +
        L(t.meaning)).toLowerCase();
      return hay.indexOf(q) >= 0;
    });

    root.innerHTML = "";

    var count = document.createElement("p");
    count.className = "glossary-count muted";
    count.textContent = fmt(ui("glossaryCount"), { count: filtered.length });
    root.appendChild(count);

    var byCat = {};
    filtered.forEach(function (t) {
      if (!byCat[t.category]) byCat[t.category] = [];
      byCat[t.category].push(t);
    });

    (d.glossary.categories || []).forEach(function (catDef) {
      var list = byCat[catDef.id];
      if (!list || !list.length) return;

      var section = document.createElement("section");
      section.className = "glossary-section";
      section.innerHTML = "<h3>" + esc(L(catDef.label)) + "</h3>";

      list.forEach(function (t) {
        var card = document.createElement("article");
        card.className = "glossary-card";
        card.id = "glossary-" + t.id;

        var aliasesEn = (t.aliasesEn || []).length ? " · " + esc((t.aliasesEn || []).join(", ")) : "";
        var aliasesFa = (t.aliasesFa || []).length ? " · " + esc((t.aliasesFa || []).join("، ")) : "";
        var srcNote =
          t.source && t.source.type === "web" && t.source.note
            ? '<p class="glossary-web-note">' + esc(L(t.source.note)) + "</p>"
            : "";

        card.innerHTML =
          '<div class="glossary-head">' +
          '<div class="glossary-pair"><span class="glossary-k">' +
          esc(ui("glossaryEnLabel")) +
          '</span><span class="glossary-v">' +
          esc(t.en) +
          aliasesEn +
          "</span></div>" +
          '<div class="glossary-pair"><span class="glossary-k">' +
          esc(ui("glossaryFaLabel")) +
          '</span><span class="glossary-v">' +
          esc(t.fa) +
          aliasesFa +
          "</span></div>" +
          "</div>" +
          '<p class="glossary-meaning"><strong>' +
          esc(ui("glossaryMeaningLabel")) +
          ":</strong> " +
          glossaryHtml(L(t.meaning)) +
          "</p>" +
          '<p class="glossary-source muted"><strong>' +
          esc(ui("glossarySourceLabel")) +
          ":</strong> " +
          esc(glossarySourceLabel(t.source)) +
          (t.source && t.source.ref ? " — " + esc(t.source.ref) : "") +
          "</p>" +
          srcNote;

        section.appendChild(card);
      });

      root.appendChild(section);
    });

    var hash = (opts.hash || location.hash || "").replace(/^#/, "");
    if (hash) {
      var target = document.getElementById(hash);
      if (target) {
        target.classList.add("glossary-highlight");
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }

  function initGlossaryBack(btnId) {
    var btn = document.getElementById(btnId || "glossary-back");
    if (!btn) return;
    function paint() {
      btn.href = resolveGlossaryReturn();
      btn.textContent = ui("glossaryBack");
    }
    paint();
    window.addEventListener("yf-lang-change", paint);
  }

  function paintUi(root, fmtMap) {
    (root || document).querySelectorAll("[data-ui]").forEach(function (el) {
      var key = el.getAttribute("data-ui");
      var text = ui(key);
      if (fmtMap && fmtMap[key]) text = fmt(text, fmtMap[key]);
      if (el.hasAttribute("data-glossary")) {
        el.innerHTML = glossaryHtml(text);
      } else {
        el.textContent = text;
      }
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
    glossaryHtml: glossaryHtml,
    linkGlossary: linkGlossary,
    renderGlossary: renderGlossary,
    glossaryCategoryLabel: glossaryCategoryLabel,
    paintUi: paintUi,
    initGlossaryBack: initGlossaryBack,
    resolveGlossaryReturn: resolveGlossaryReturn,
  };
})();
