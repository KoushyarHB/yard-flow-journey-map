(function () {
  "use strict";

  var eventsBound = false;
  var currentId = "overview";

  function initPrezi() {
    var Y = window.YardStory;
    var d = Y.data();
    if (!d || !d.prezi) return;

    var viewport = document.getElementById("prezi-viewport");
    var canvas = document.getElementById("prezi-canvas");
    var hudStep = document.getElementById("prezi-step");
    var btnPrev = document.getElementById("prezi-prev");
    var btnNext = document.getElementById("prezi-next");
    var btnOverview = document.getElementById("prezi-overview");
    var linkChapter = document.getElementById("prezi-chapter-link");
    if (!viewport || !canvas) return;

    var meta = d.prezi.meta;
    var frames = d.prezi.frames;
    var path = d.prezi.path;
    var frameById = {};
    frames.forEach(function (f) {
      frameById[f.id] = f;
    });

    var pathIndex = 0;

    canvas.style.width = meta.canvas.width + "px";
    canvas.style.height = meta.canvas.height + "px";

    function frameCenter(f) {
      return { x: f.x + f.w / 2, y: f.y + f.h / 2 };
    }

    function buildCanvas() {
      var svg =
        '<svg class="prezi-paths" width="' +
        meta.canvas.width +
        '" height="' +
        meta.canvas.height +
        '" aria-hidden="true"><defs><linearGradient id="prezi-line" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#0d9488" stop-opacity="0.35"/><stop offset="100%" stop-color="#0891b2" stop-opacity="0.65"/></linearGradient></defs>';
      for (var i = 0; i < path.length - 1; i++) {
        var a = frameById[path[i]];
        var b = frameById[path[i + 1]];
        if (!a || !b) continue;
        var ca = frameCenter(a);
        var cb = frameCenter(b);
        svg +=
          '<line x1="' +
          ca.x +
          '" y1="' +
          ca.y +
          '" x2="' +
          cb.x +
          '" y2="' +
          cb.y +
          '" stroke="url(#prezi-line)" stroke-width="3" stroke-dasharray="8 6"/>';
      }
      svg += "</svg>";

      var html = svg;
      frames.forEach(function (f) {
        var cls = "prezi-frame prezi-frame--" + f.kind;
        if (f.critical) cls += " prezi-frame--critical";
        html +=
          '<article class="' +
          cls +
          '" data-frame-id="' +
          Y.esc(f.id) +
          '" style="left:' +
          f.x +
          "px;top:" +
          f.y +
          "px;width:" +
          f.w +
          "px;min-height:" +
          f.h +
          'px">';
        if (f.kind === "chapter") {
          html +=
            '<div class="prezi-frame-kicker">' +
            Y.esc(Y.fmt(Y.ui("chapterOf"), { n: f.chapterN, total: 12 })) +
            "</div>";
        }
        html += "<h3>" + Y.glossaryHtml(Y.L(f.title)) + "</h3>";
        if (f.actor) {
          html += '<div class="prezi-actor">👤 ' + Y.glossaryHtml(Y.L(f.actor)) + "</div>";
        }
        if (f.hook) {
          html += '<p class="prezi-hook">' + Y.glossaryHtml(Y.L(f.hook)) + "</p>";
        } else if (f.body) {
          html += '<p class="prezi-hook">' + Y.glossaryHtml(Y.L(f.body)) + "</p>";
        }
        if (f.done) {
          html +=
            '<p class="prezi-done"><strong>' +
            Y.esc(Y.ui("donePrefix")) +
            "</strong>" +
            Y.glossaryHtml(Y.L(f.done)) +
            "</p>";
        }
        if (f.critical) {
          html +=
            '<span class="prezi-crit">' + Y.esc(Y.ui("criticalBadge")) + "</span>";
        }
        html += "</article>";
      });
      canvas.innerHTML = html;

      canvas.querySelectorAll(".prezi-frame").forEach(function (el) {
        el.addEventListener("click", function (e) {
          e.stopPropagation();
          flyTo(el.getAttribute("data-frame-id"));
        });
      });
    }

    function fitOverview() {
      var vpW = viewport.clientWidth;
      var vpH = viewport.clientHeight;
      var scale = Math.min(vpW / meta.canvas.width, vpH / meta.canvas.height) * 0.88;
      return {
        scale: scale,
        tx: (vpW - meta.canvas.width * scale) / 2,
        ty: (vpH - meta.canvas.height * scale) / 2,
      };
    }

    function focusFrame(f) {
      var vpW = viewport.clientWidth;
      var vpH = viewport.clientHeight;
      var scale = Math.min(vpW / (f.w + 100), vpH / (f.h + 140)) * 0.9;
      var cx = f.x + f.w / 2;
      var cy = f.y + f.h / 2;
      return {
        scale: scale,
        tx: vpW / 2 - cx * scale,
        ty: vpH / 2 - cy * scale,
      };
    }

    function applyTransform(t) {
      canvas.style.transform =
        "translate(" + t.tx + "px, " + t.ty + "px) scale(" + t.scale + ")";
    }

    function updateHud() {
      pathIndex = Math.max(0, path.indexOf(currentId));
      canvas.querySelectorAll(".prezi-frame").forEach(function (el) {
        el.classList.toggle("active", el.getAttribute("data-frame-id") === currentId);
      });
      if (hudStep) {
        hudStep.textContent = Y.fmt(Y.ui("preziStepOf"), {
          n: pathIndex + 1,
          total: path.length,
        });
      }
      if (linkChapter) {
        var f = frameById[currentId];
        var showChapter = !!(f && f.kind === "chapter");
        if (showChapter) {
          linkChapter.href = "story.html#" + f.id;
        }
        linkChapter.classList.toggle("is-unavailable", !showChapter);
        linkChapter.setAttribute("aria-hidden", showChapter ? "false" : "true");
        linkChapter.tabIndex = showChapter ? 0 : -1;
      }
      btnPrev.disabled = pathIndex <= 0;
      btnNext.disabled = pathIndex >= path.length - 1;
    }

    function flyTo(id, keepFocus) {
      currentId = id;
      var f = frameById[id];
      if (!f) return;
      var t =
        id === "overview" && !keepFocus ? fitOverview() : focusFrame(f);
      applyTransform(t);
      updateHud();
    }

    function step(delta) {
      var next = pathIndex + delta;
      if (next < 0 || next >= path.length) return;
      flyTo(path[next], true);
    }

    function paintHud() {
      btnPrev.textContent = Y.ui("preziPrev");
      btnNext.textContent = Y.ui("preziNext");
      btnOverview.textContent = Y.ui("preziOverview");
      linkChapter.textContent = Y.ui("preziReadChapter");
      var hint = document.getElementById("prezi-hint");
      if (hint) hint.textContent = Y.ui("preziHint");
      updateHud();
    }

    buildCanvas();

    if (!eventsBound) {
      eventsBound = true;
      btnPrev.onclick = function () {
        step(-1);
      };
      btnNext.onclick = function () {
        step(1);
      };
      btnOverview.onclick = function () {
        flyTo("overview");
      };

      window.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          step(1);
        }
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          step(-1);
        }
        if (e.key === "Escape") flyTo("overview");
      });

      window.addEventListener("resize", function () {
        flyTo(currentId, true);
      });

      flyTo("overview");
    } else {
      flyTo(currentId, true);
    }

    paintHud();
  }

  window.YardPrezi = { init: initPrezi };
})();
