// ==================================================================
// ASTRE — cinematic reveal, ambient light field, scroll reveal
// Vanilla JS. No dependencies, no backend.
// ==================================================================

(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------
     Footer year
     --------------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------
     Cinematic reveal
     Adds .is-ready once the page (and the logo image) is settled,
     which triggers the staggered CSS transitions defined in style.css.
     --------------------------------------------------------------- */
  function startReveal() {
    // A short breath before anything moves — lets the black hold.
    var delay = reduceMotion ? 60 : 250;
    window.setTimeout(function () {
      root.classList.add("is-ready");
    }, delay);
  }

  var logoImg = document.querySelector(".hero__mark img");
  if (logoImg && !logoImg.complete) {
    logoImg.addEventListener("load", startReveal, { once: true });
    logoImg.addEventListener("error", startReveal, { once: true });
    // Safety net in case the load event never fires
    window.setTimeout(startReveal, 1200);
  } else {
    startReveal();
  }

  /* ---------------------------------------------------------------
     Signature interactive light field
     Desktop / mouse: the light follows the cursor, lerped for a
     slow, polished-marble feel rather than a snappy cursor-follow.
     Touch / coarse pointers: a slow autonomous drift instead.
     Reduced motion: a fixed, gently held light with no animation loop.
     --------------------------------------------------------------- */
  var field = document.querySelector(".light-field");

  if (field) {
    var isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

    if (reduceMotion) {
      field.style.setProperty("--mx", "50%");
      field.style.setProperty("--my", "40%");
    } else {
      var targetX = 50, targetY = 42;
      var curX = 50, curY = 42;
      var w = window.innerWidth, h = window.innerHeight;

      window.addEventListener("resize", function () {
        w = window.innerWidth;
        h = window.innerHeight;
      });

      if (!isCoarsePointer) {
        window.addEventListener("mousemove", function (e) {
          targetX = (e.clientX / w) * 100;
          targetY = (e.clientY / h) * 100;
        }, { passive: true });
      }

      var t0 = performance.now();

      function tick(now) {
        if (isCoarsePointer) {
          // Slow autonomous figure-eight drift — no cursor required.
          var t = (now - t0) / 1000;
          targetX = 50 + Math.sin(t * 0.12) * 22;
          targetY = 40 + Math.sin(t * 0.09) * 12 + Math.cos(t * 0.05) * 6;
        }

        // Lerp toward the target for a slow, weighted movement.
        curX += (targetX - curX) * 0.035;
        curY += (targetY - curY) * 0.035;

        field.style.setProperty("--mx", curX.toFixed(2) + "%");
        field.style.setProperty("--my", curY.toFixed(2) + "%");

        requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    }
  }

  /* ---------------------------------------------------------------
     Scroll reveal for the philosophy section
     --------------------------------------------------------------- */
  var philosophy = document.getElementById("philosophy");

  if (philosophy) {
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            philosophy.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      io.observe(philosophy);
    } else {
      // Fallback for very old browsers
      philosophy.classList.add("is-visible");
    }
  }
})();
