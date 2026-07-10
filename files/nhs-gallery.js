/* NHS photo gallery lightbox — no dependencies */
(function () {
  "use strict";
  var items = [], idx = 0, lb, img, count;

  function build() {
    lb = document.createElement("div");
    lb.className = "nhs-lightbox";
    lb.innerHTML =
      '<img alt="" />' +
      '<button class="nhs-lb-close" aria-label="Close">&#10005;</button>' +
      '<button class="nhs-lb-prev" aria-label="Previous photo">&#10094;</button>' +
      '<button class="nhs-lb-next" aria-label="Next photo">&#10095;</button>' +
      '<div class="nhs-lb-count"></div>';
    document.body.appendChild(lb);
    img = lb.querySelector("img");
    count = lb.querySelector(".nhs-lb-count");
    lb.querySelector(".nhs-lb-close").addEventListener("click", close);
    lb.querySelector(".nhs-lb-prev").addEventListener("click", function (e) { e.stopPropagation(); step(-1); });
    lb.querySelector(".nhs-lb-next").addEventListener("click", function (e) { e.stopPropagation(); step(1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
    });
    var x0 = null;
    lb.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
      x0 = null;
    }, { passive: true });
  }

  function show() {
    var it = items[idx];
    img.src = it.href;
    img.alt = it.alt;
    count.textContent = (idx + 1) + " / " + items.length;
    [idx + 1, idx - 1].forEach(function (i) {
      var n = (i + items.length) % items.length;
      (new Image()).src = items[n].href;
    });
  }
  function step(d) { idx = (idx + d + items.length) % items.length; show(); }
  function open(gallery, i) {
    items = gallery; idx = i;
    if (!lb) build();
    show();
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function close() {
    lb.classList.remove("open");
    document.body.style.overflow = "";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var galleries = document.querySelectorAll(".nhs-gallery");
    Array.prototype.forEach.call(galleries, function (g) {
      var links = g.querySelectorAll("a.nhs-thumb");
      var list = Array.prototype.map.call(links, function (a) {
        return { href: a.getAttribute("href"), alt: a.querySelector("img") ? a.querySelector("img").alt : "" };
      });
      Array.prototype.forEach.call(links, function (a, i) {
        a.addEventListener("click", function (e) { e.preventDefault(); open(list, i); });
      });
    });
  });
})();
