/**
 * Shared Amroth header/footer chrome for static pages.
 * Pages with [data-amroth-mount="chrome"] get identical header+footer injected.
 * Homepage keeps markup inline; this file only normalises class hooks.
 */
(function () {
  const HEADER = `
<header class="header header--w1 amroth-header" data-amroth-chrome="header">
  <nav class="navbar" aria-label="Primary">
    <div class="nav-container">
      <a href="index.html" class="logo-link" aria-label="Amroth home">
        <img src="images/svg/amroth_logo.svg" alt="Amroth" class="logo-img" height="40" width="110">
      </a>
      <ul class="nav-menu" id="primary-menu">
        <li><a class="nav-link" href="index.html#products">Products</a></li>
        <li><a class="nav-link" href="index.html#paths">Partners</a></li>
        <li><a class="nav-link" href="index.html#trust">Trust</a></li>
        <li><a class="nav-link" href="index.html#enquire">Enquire</a></li>
        <li><a class="nav-link" href="investors.html">Investors</a></li>
        <li><a class="nav-link" href="blog.html">Blog</a></li>
      </ul>
      <a class="btn btn-primary nav-cta" href="index.html#enquire" data-cta="nav-enquire">Request details</a>
      <button type="button" class="hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="primary-menu">
        <span class="bar"></span><span class="bar"></span><span class="bar"></span>
      </button>
    </div>
  </nav>
  <p class="legal-once">Amroth is the consumer brand of <strong>Srivallabha Sustainable Solutions</strong>.</p>
</header>`;

  const FOOTER = `
<footer class="footer amroth-footer" data-amroth-chrome="footer">
  <div class="container footer-content">
    <div class="footer-section">
      <img src="images/svg/amroth_logo.svg" alt="Amroth" height="44" width="120" loading="lazy">
      <p>Amroth · Srivallabha Sustainable Solutions · Takkellapadu, Amaravathi District, AP</p>
    </div>
    <div class="footer-section">
      <h2 class="footer-heading">Links</h2>
      <ul>
        <li><a href="privacy.html">Privacy</a></li>
        <li><a href="terms.html">Terms</a></li>
        <li><a href="investors.html">Investors</a></li>
        <li><a href="blog.html">Blog</a></li>
        <li><a href="https://instagram.com/amrothnutrition" rel="noopener noreferrer">Instagram</a></li>
      </ul>
    </div>
  </div>
  <p class="footer-copy">© Srivallabha Sustainable Solutions. Local implementation only until publish approval.</p>
</footer>`;

  const mount = document.querySelector("[data-amroth-mount=\"chrome\"]");
  if (!mount) return;

  document.body.classList.add("amroth-site");

  // Photographic atmosphere so glass can transmit (Commander gas-backdrop pattern)
  if (!document.querySelector(".amroth-backdrop")) {
    document.body.insertAdjacentHTML(
      "afterbegin",
      '<div class="amroth-backdrop" aria-hidden="true"><img class="amroth-backdrop__img" src="images/allProds-Splash.png" alt="" width="1600" height="900" decoding="async"><div class="amroth-backdrop__scrim"></div></div>',
    );
  }

  // Remove legacy chrome so one shared header/footer owns the pattern
  document.querySelectorAll("body > header.header:not([data-amroth-chrome]), body > footer.footer:not([data-amroth-chrome])").forEach((n) => n.remove());

  if (!document.querySelector("[data-amroth-chrome=\"header\"]")) {
    document.body.insertAdjacentHTML("afterbegin", HEADER);
  }
  if (!document.querySelector("[data-amroth-chrome=\"footer\"]")) {
    document.body.insertAdjacentHTML("beforeend", FOOTER);
  }

  // Mark current page in nav
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".amroth-header .nav-link").forEach((a) => {
    const href = a.getAttribute("href") || "";
    if (href === path || href.endsWith("/" + path)) {
      a.setAttribute("aria-current", "page");
    }
  });
})();
