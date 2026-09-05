/**
 * Amroth.life — W1 Commander intake, analytics, a11y helpers.
 * No secrets. No Business IDs. WhatsApp click ≠ Lead.
 */
(function () {
  const cfg = window.AMROTH_PUBLIC || {};
  const isDev = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) || location.search.includes("debug=true");

  function track(name, params) {
    if (isDev) {
      console.log("[analytics]", name, params);
      return;
    }
    if (typeof gtag === "function") gtag("event", name, { ...params, transport_type: "beacon" });
  }

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }
  function qsa(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  }

  function utmBag() {
    const p = new URLSearchParams(location.search);
    return {
      utmSource: p.get("utm_source") || sessionStorage.getItem("utm_source"),
      utmMedium: p.get("utm_medium") || sessionStorage.getItem("utm_medium"),
      utmCampaign: p.get("utm_campaign") || sessionStorage.getItem("utm_campaign"),
      utmContent: p.get("utm_content") || sessionStorage.getItem("utm_content"),
      referrer: document.referrer || sessionStorage.getItem("referrer") || null,
      landingPage: sessionStorage.getItem("landing_page") || location.href,
    };
  }

  function persistAttribution() {
    const p = new URLSearchParams(location.search);
    ["utm_source", "utm_medium", "utm_campaign", "utm_content"].forEach((k) => {
      if (p.get(k)) sessionStorage.setItem(k, p.get(k));
    });
    if (document.referrer && !sessionStorage.getItem("referrer")) sessionStorage.setItem("referrer", document.referrer);
    if (!sessionStorage.getItem("landing_page")) sessionStorage.setItem("landing_page", location.href);
  }

  function idemKey() {
    const k = "amroth_idem_" + location.pathname;
    let v = sessionStorage.getItem(k);
    if (!v) {
      v = "web-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
      sessionStorage.setItem(k, v);
    }
    return v;
  }

  function showStatus(el, msg, kind) {
    if (!el) return;
    el.textContent = msg;
    el.dataset.kind = kind || "info";
  }

  // Header
  const header = qs(".header");
  window.addEventListener("scroll", () => {
    header?.classList.toggle("scrolled", window.scrollY > 40);
  });

  const hamburger = qs(".hamburger");
  const navMenu = qs(".nav-menu");
  hamburger?.addEventListener("click", () => {
    const open = navMenu?.classList.toggle("is-open");
    navMenu?.classList.toggle("active", !!open);
    hamburger.setAttribute("aria-expanded", open ? "true" : "false");
    hamburger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  qsa(".nav-link").forEach((a) =>
    a.addEventListener("click", () => {
      navMenu?.classList.remove("active", "is-open");
      hamburger?.setAttribute("aria-expanded", "false");
      hamburger?.setAttribute("aria-label", "Open menu");
    }),
  );

  // Single scroll-top
  const scrollTopBtn = qs("#scrollTop");
  window.addEventListener("scroll", () => {
    const show = window.scrollY > 300;
    scrollTopBtn?.classList.toggle("show", show);
    scrollTopBtn?.classList.toggle("is-visible", show);
  });
  scrollTopBtn?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  persistAttribution();

  // Glass premium selects — replace native OS menus with crystal dropdowns
  function enhanceGlassSelect(select) {
    if (!select || select.dataset.glassSelect === "1") return;
    select.dataset.glassSelect = "1";
    select.classList.add("amroth-select-native");

    const wrap = document.createElement("div");
    wrap.className = "amroth-select";
    select.parentNode.insertBefore(wrap, select);
    wrap.appendChild(select);

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "amroth-select__trigger";
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.setAttribute("aria-expanded", "false");
    if (select.id) trigger.setAttribute("aria-labelledby", select.id + "-label");
    if (select.id) {
      const lab = document.querySelector(`label[for="${select.id}"]`);
      if (lab && !lab.id) lab.id = select.id + "-label";
    }

    const valueEl = document.createElement("span");
    valueEl.className = "amroth-select__value";

    const chevron = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    chevron.setAttribute("class", "amroth-select__chevron");
    chevron.setAttribute("viewBox", "0 0 16 16");
    chevron.setAttribute("aria-hidden", "true");
    chevron.innerHTML = '<path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>';

    trigger.appendChild(valueEl);
    trigger.appendChild(chevron);

    const menu = document.createElement("ul");
    menu.className = "amroth-select__menu";
    menu.setAttribute("role", "listbox");
    if (select.id) menu.id = select.id + "-listbox";
    trigger.setAttribute("aria-controls", menu.id);

    function selectedLabel() {
      const opt = select.options[select.selectedIndex];
      return opt ? opt.textContent : "";
    }

    function syncFromSelect() {
      valueEl.textContent = selectedLabel();
      qsa(".amroth-select__option", menu).forEach((btn) => {
        const on = btn.dataset.value === select.value;
        btn.classList.toggle("is-selected", on);
        btn.setAttribute("aria-selected", on ? "true" : "false");
      });
    }

    function close() {
      wrap.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
    }

    function open() {
      qsa(".amroth-select.is-open").forEach((el) => {
        if (el !== wrap) el.classList.remove("is-open");
      });
      wrap.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
      const sel = qs(".amroth-select__option.is-selected", menu);
      (sel || qs(".amroth-select__option", menu))?.focus();
    }

    Array.from(select.options).forEach((opt) => {
      const li = document.createElement("li");
      li.setAttribute("role", "presentation");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "amroth-select__option";
      btn.setAttribute("role", "option");
      btn.dataset.value = opt.value;
      btn.textContent = opt.textContent;
      btn.addEventListener("click", () => {
        select.value = opt.value;
        select.dispatchEvent(new Event("change", { bubbles: true }));
        syncFromSelect();
        close();
        trigger.focus();
      });
      li.appendChild(btn);
      menu.appendChild(li);
    });

    trigger.addEventListener("click", () => {
      if (wrap.classList.contains("is-open")) close();
      else open();
    });

    trigger.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });

    menu.addEventListener("keydown", (e) => {
      const options = qsa(".amroth-select__option", menu);
      const i = options.indexOf(document.activeElement);
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        trigger.focus();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        options[Math.min(i + 1, options.length - 1)]?.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        options[Math.max(i - 1, 0)]?.focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        options[0]?.focus();
      } else if (e.key === "End") {
        e.preventDefault();
        options[options.length - 1]?.focus();
      }
    });

    select.addEventListener("change", syncFromSelect);
    wrap.appendChild(trigger);
    wrap.appendChild(menu);
    syncFromSelect();
  }

  qsa(".enquiry-form select").forEach(enhanceGlassSelect);

  document.addEventListener("click", (e) => {
    qsa(".amroth-select.is-open").forEach((el) => {
      if (!el.contains(e.target)) el.classList.remove("is-open");
    });
  });

  // Audience paths — select + scroll to single form
  qsa(".path-card[data-audience], [data-audience]").forEach((el) => {
    el.addEventListener("click", () => {
      const audience = el.getAttribute("data-audience");
      track("audience_path_selection", { audience, cta: el.getAttribute("data-cta") || "" });
      qsa(".path-card").forEach((c) => c.classList.remove("is-selected"));
      if (el.classList.contains("path-card")) el.classList.add("is-selected");
      const intent = qs("#intent");
      if (intent && audience) {
        const map = {
          "direct-customer": "direct-customer",
          distributor: "distributor",
          retailer: "retailer",
          institution: "institution",
          "export-buyer": "export-buyer",
        };
        if (map[audience]) intent.value = map[audience];
        if (audience === "institution") intent.value = "institution";
        intent.dispatchEvent(new Event("change", { bubbles: true }));
      }
      qs("#enquire")?.scrollIntoView({ behavior: "smooth" });
    });
  });

  qsa("[data-product-cta]").forEach((el) => {
    el.addEventListener("click", () => {
      const product = el.getAttribute("data-product-cta");
      track("product_view", { product });
      const sel = qs("#productInterest");
      if (sel && product) {
        sel.value = product;
        sel.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
  });

  // WhatsApp sticky — contact-intent only; prefers enquiry ref after form success
  const wa = qs("#whatsappSticky");
  function waHref(ref) {
    const e164 = cfg.whatsappEnquiryE164 || "918106350955";
    const text = ref
      ? `Hi Amroth — enquiry ref ${ref}.`
      : "Hi Amroth — I would like product details (I have not submitted the web form yet).";
    return `https://wa.me/${e164}?text=${encodeURIComponent(text)}`;
  }
  if (wa) {
    wa.setAttribute("href", waHref(sessionStorage.getItem("amroth_enquiry_ref")));
    wa.addEventListener("click", () => {
      track("whatsapp_click", { cta: "wa-sticky", has_ref: Boolean(sessionStorage.getItem("amroth_enquiry_ref")) });
    });
  }

  // Form → Commander
  const form = qs("#amrothForm");
  const status = qs("#formStatus");
  const submitBtn = qs("#formSubmit");
  let lastPayload = null;

  form?.addEventListener("focusin", () => track("form_start", { form: "amroth-enquiry" }), { once: true });

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const phone = String(fd.get("phone") || "").trim();
    const email = String(fd.get("email") || "").trim();
    if (!phone && !email) {
      showStatus(status, "Provide a phone number or email.", "error");
      track("form_validation_failure", { reason: "contact" });
      return;
    }
    if (!fd.get("consentAccepted")) {
      showStatus(status, "Consent is required.", "error");
      track("form_validation_failure", { reason: "consent" });
      return;
    }

    const attr = utmBag();
    const productInterest = String(fd.get("productInterest") || "");
    const payload = {
      idempotencyKey: idemKey(),
      intent: String(fd.get("intent") || "product-enquiry"),
      name: String(fd.get("name") || "").trim(),
      phone: phone || undefined,
      email: email || undefined,
      city: String(fd.get("city") || "").trim() || undefined,
      organizationName: String(fd.get("organizationName") || "").trim() || undefined,
      productInterest: productInterest === "Other / unmapped" ? "Unmapped interest" : productInterest,
      message: String(fd.get("message") || "").trim() || undefined,
      consentAccepted: true,
      consentVersion: cfg.consentVersion || "amroth-web-consent-v1",
      consentAt: new Date().toISOString(),
      landingPage: attr.landingPage,
      referrer: attr.referrer,
      ctaId: "enquiry-form",
      utmSource: attr.utmSource || undefined,
      utmMedium: attr.utmMedium || undefined,
      utmCampaign: attr.utmCampaign || undefined,
      utmContent: attr.utmContent || undefined,
      honeypot: String(fd.get("honeypot") || ""),
      channel: "website",
    };
    lastPayload = payload;

    const url = cfg.intakeUrl;
    if (!url) {
      showStatus(status, "Intake is not configured.", "error");
      return;
    }

    submitBtn.disabled = true;
    showStatus(status, "Submitting…", "pending");
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": payload.idempotencyKey,
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.accepted) {
        track("lead_submission_failure", { status: res.status });
        showStatus(status, json.message || "Could not submit. Your entries are kept — tap Submit to retry.", "error");
        submitBtn.disabled = false;
        return;
      }
      sessionStorage.setItem("amroth_enquiry_ref", json.enquiryRef);
      if (wa && json.whatsappContinueUrl) wa.setAttribute("href", json.whatsappContinueUrl);
      track(json.investorOnly ? "quote_request" : "lead_submission_success", { created: json.created });
      if (productInterest.includes("Sample") || payload.intent === "sample") track("sample_request", {});
      showStatus(
        status,
        (json.message || "Thank you.") + (json.enquiryRef ? ` Reference: ${json.enquiryRef}` : "") +
          (json.whatsappContinueUrl ? " You may continue on WhatsApp with this reference." : ""),
        "success",
      );
      // Keep fields on success except honeypot — user may open WhatsApp
      submitBtn.disabled = false;
      // New idempotency for a fresh enquiry
      sessionStorage.removeItem("amroth_idem_" + location.pathname);
    } catch (err) {
      console.error(err);
      track("lead_submission_failure", { status: "network" });
      showStatus(status, "Network error. Your entries are kept — please retry.", "error");
      submitBtn.disabled = false;
      if (lastPayload) {
        /* retained in form DOM */
      }
    }
  });

  console.log("Amroth W1 site ready");

  /* Live amroth.life counter — exact behaviour from stable script.js */
  function animateCounters() {
    const counters = document.querySelectorAll(".stat-number");
    counters.forEach((counter) => {
      const target = counter.textContent;
      const isPercentage = target.includes("%");
      const hasPlus = target.includes("+");
      const numericTarget = parseInt(String(target).replace(/\D/g, ""), 10);
      if (!numericTarget && numericTarget !== 0) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        if (isPercentage) counter.textContent = numericTarget + "%";
        else if (hasPlus) counter.textContent = numericTarget + "+";
        else counter.textContent = String(numericTarget);
        return;
      }

      let current = 0;
      const increment = numericTarget / 100;
      const timer = setInterval(() => {
        current += increment;
        if (current >= numericTarget) {
          current = numericTarget;
          clearInterval(timer);
        }
        if (isPercentage) {
          counter.textContent = Math.floor(current) + "%";
        } else if (hasPlus) {
          counter.textContent = Math.floor(current) + "+";
        } else {
          counter.textContent = String(Math.floor(current));
        }
      }, 20);
    });
  }

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  const statsSection = qs(".story-stats");
  if (statsSection) statsObserver.observe(statsSection);

  qsa(".stat-card").forEach((card) => {
    card.addEventListener("click", () => {
      track("stat_panel_click", { label: card.querySelector(".stat-label")?.textContent || "" });
      qs("#products")?.scrollIntoView({ behavior: "smooth" });
    });
  });

  qsa(".amroth-product-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest("a, button")) return;
      const product = card.getAttribute("data-product");
      const sel = qs("#productInterest");
      if (sel && product) {
        sel.value = product;
        sel.dispatchEvent(new Event("change", { bubbles: true }));
      }
      track("product_panel_click", { product: product || "" });
      qs("#enquire")?.scrollIntoView({ behavior: "smooth" });
    });
  });

  qsa(".faq-item .faq-question").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const open = item?.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  const chatbotToggle = qs("#chatbot-toggle");
  const chatbotWindow = qs("#chatbot-window");
  const chatbotClose = qs("#chatbot-close");
  const chatbotInput = qs("#chatbot-input");
  const chatbotSend = qs("#chatbot-send");
  const chatbotMessages = qs("#chatbot-messages");

  function setChatOpen(open) {
    if (!chatbotWindow || !chatbotToggle) return;
    chatbotWindow.classList.toggle("active", open);
    chatbotWindow.hidden = !open;
    chatbotToggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  chatbotToggle?.addEventListener("click", () => setChatOpen(!chatbotWindow?.classList.contains("active")));
  chatbotClose?.addEventListener("click", () => setChatOpen(false));

  const chatbotResponses = {
    hi: "Hi — welcome to Amroth. Ask about products, ingredients, preparation or how to enquire.",
    hello: "Hello — how can I help with Amroth products today?",
    products:
      "Public enquiry products today: Multigrain Powder and Instant Sambar Mix. Other category names in older materials may be unmapped until catalogue authority exists.",
    product:
      "Public enquiry products today: Multigrain Powder and Instant Sambar Mix. Use Request details / sample / quote on the site.",
    multigrain:
      "Multigrain Powder uses 25+ natural ingredients spanning cereals, millets, pulses, nuts and seeds. Add water, boil while stirring, season and serve.",
    sambar:
      "Instant Sambar Mix is a spice-and-dal blend for a quick sambar-style meal — add water, boil, serve with rice, idli or dosa.",
    ingredients:
      "Stated formulations use natural ingredients with no preservatives or artificial additives. Exact pack guidance is confirmed when you receive product details.",
    natural: "Yes — clean-label intent: 100% natural ingredients without chemical shelf-life enhancers in stated formulations.",
    preservatives: "No preservatives or artificial colours in our stated formulations.",
    contact: "Call +91 7702741798 or email amrothproducts@gmail.com. WhatsApp enquiry is also available from the site.",
    email: "Email us at amrothproducts@gmail.com.",
    phone: "Call +91 7702741798.",
    whatsapp: "Use Enquire on WhatsApp on this page — preferably after submitting the web form so we have your enquiry reference.",
    enquire: "Scroll to Enquire, choose your path, and submit the form. We create one enquiry record and can continue on WhatsApp afterward.",
    order: "We do not run self-serve checkout yet. Please submit an enquiry or WhatsApp us for details, samples or quotes.",
    buy: "Purchases are handled through enquiry — not an online cart. Use Request Product Details or Enquire on WhatsApp.",
    price: "Pricing is confirmed through enquiry for your channel and quantity — we do not publish a public price list here.",
    location: "Srivallabha Sustainable Solutions / Amroth — Takkellapadu Village, Amaravathi District, Andhra Pradesh.",
    medical: "I can only share general product and preparation information. I cannot give medical, diagnostic or nutrition therapy advice.",
    default:
      "I can help with Amroth products, ingredients, preparation, contact and how to enquire. I do not give medical advice. Try: products, ingredients, enquire, contact.",
  };

  function getBotResponse(message) {
    const lower = message.toLowerCase();
    if (/(diagnos|cure|treat|disease|diabetes|bp|blood pressure|medic)/.test(lower)) {
      return chatbotResponses.medical;
    }
    for (const [key, response] of Object.entries(chatbotResponses)) {
      if (key !== "default" && lower.includes(key)) return response;
    }
    return chatbotResponses.default;
  }

  function addMessage(text, isUser) {
    if (!chatbotMessages) return;
    const messageDiv = document.createElement("div");
    messageDiv.className = `chat-message ${isUser ? "user-message" : "bot-message"}`;
    messageDiv.innerHTML =
      `<div class="message-avatar" aria-hidden="true"><i class="fas ${isUser ? "fa-user" : "fa-leaf"}"></i></div>` +
      `<div class="message-content"><p></p></div>`;
    messageDiv.querySelector("p").textContent = text;
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  function sendMessage() {
    const message = (chatbotInput?.value || "").trim();
    if (!message) return;
    addMessage(message, true);
    chatbotInput.value = "";
    window.setTimeout(() => addMessage(getBotResponse(message), false), 450);
  }

  chatbotSend?.addEventListener("click", sendMessage);
  chatbotInput?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
  qsa(".quick-reply-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (chatbotInput) chatbotInput.value = btn.getAttribute("data-message") || "";
      sendMessage();
    });
  });
})();
