/* Permanent Amroth QR landing — shared logic for /q/<slug>/.
 * Progressive enhancement: the page already has a working "View Product" link and a working
 * WhatsApp link in the raw HTML (no JS needed for either to work). This script only:
 *   1. Fetches richer, currently-editable content from Commander's public QR API (product name,
 *      honest Request Sample/Quote wording, a retirement notice) and updates the page with it.
 *   2. Records landing-view / product-click / whatsapp-click as separate, best-effort, anonymous
 *      events. A failed or unavailable analytics call NEVER blocks either button.
 * No auto-redirect. No opening both destinations together. No timed redirect. Every navigation
 * happens strictly inside a real user click handler. */
(function () {
	"use strict";

	var root = document.querySelector("[data-amroth-qr]");
	if (!root) return;
	var slug = root.getAttribute("data-slug");
	var cfg = window.AMROTH_PUBLIC || {};
	var apiBase = cfg.qrApiBase || "";

	var viewBtn = root.querySelector("[data-qr-view]");
	var waBtn = root.querySelector("[data-qr-whatsapp]");
	var productNameEl = root.querySelector("[data-qr-product-name]");
	var noticeEl = root.querySelector("[data-qr-notice]");

	function visitorId() {
		try {
			var key = "amroth_qr_visitor_id";
			var existing = window.localStorage.getItem(key);
			if (existing) return existing;
			var fresh =
				(window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : String(Date.now()) + Math.random().toString(36).slice(2)).replace(
					/[^a-zA-Z0-9_-]/g,
					"",
				);
			window.localStorage.setItem(key, fresh);
			return fresh;
		} catch (e) {
			// Storage blocked (private mode, disabled cookies-equivalent) — the page still works,
			// this scan just won't contribute to the unique-visitor estimate.
			return null;
		}
	}

	function eventIdemKey(eventType) {
		return slug + ":" + eventType + ":" + (window.performance ? Math.round(window.performance.now()) : Date.now());
	}

	/* QR-11: capture UTM params from this page's own URL (e.g. a print run's label might link
	 * /q/multigrain?utm_source=print&utm_campaign=diwali-2026) plus document.referrer — secondary
	 * context alongside the QR/slug itself, which remains the primary attribution. */
	function utmParams() {
		var out = {};
		try {
			var params = new URLSearchParams(window.location.search);
			var map = { utm_source: "utmSource", utm_medium: "utmMedium", utm_campaign: "utmCampaign", utm_content: "utmContent" };
			for (var key in map) {
				var v = params.get(key);
				if (v) out[map[key]] = v.slice(0, 200);
			}
			if (document.referrer) out.referrer = document.referrer.slice(0, 500);
		} catch (e) {
			/* malformed query string — attribution is best-effort, never blocks the page */
		}
		return out;
	}

	/** Best-effort only. Never throws into the caller; never delays a navigation. */
	function recordEvent(eventType) {
		if (!apiBase) return;
		var body = JSON.stringify(
			Object.assign({ slug: slug, eventType: eventType, visitorId: visitorId(), idempotencyKey: eventIdemKey(eventType) }, utmParams()),
		);
		try {
			var url = apiBase + "/qr/events";
			if (navigator.sendBeacon) {
				var ok = navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
				if (ok) return;
			}
			fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: body, keepalive: true }).catch(function () {});
		} catch (e) {
			/* analytics must never block the landing page or its buttons */
		}
	}

	function applyLanding(landing) {
		if (!landing) return;
		if (landing.productName && productNameEl) productNameEl.textContent = landing.productName;
		if (landing.viewProductUrl && viewBtn) viewBtn.setAttribute("href", landing.viewProductUrl);
		if (landing.whatsappUrl && waBtn) waBtn.setAttribute("href", landing.whatsappUrl);
		if (landing.requestActionLabel && waBtn) {
			var label = waBtn.querySelector("[data-qr-wa-label]");
			if (label) label.textContent = landing.requestActionLabel + " on WhatsApp";
		}
		if (landing.status === "retired" && noticeEl) {
			noticeEl.textContent = landing.retiredMessage || "This code is no longer active.";
			noticeEl.hidden = false;
		}
	}

	function init() {
		recordEvent("landing-view");
		if (viewBtn) {
			viewBtn.addEventListener("click", function () {
				recordEvent("product-click");
				// No preventDefault — this is a real <a href>, so the click itself performs the
				// only navigation, explicitly, after the user's own click.
			});
		}
		if (waBtn) {
			waBtn.addEventListener("click", function () {
				recordEvent("whatsapp-click");
			});
		}
		if (!apiBase) return; // No API configured — the static fallback links already work.
		fetch(apiBase + "/qr/" + encodeURIComponent(slug), { method: "GET" })
			.then(function (r) {
				return r.ok ? r.json() : null;
			})
			.then(function (data) {
				if (data && data.landing) applyLanding(data.landing);
			})
			.catch(function () {
				/* Static fallback content/links already rendered — nothing further to do. */
			});
	}

	if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
	else init();
})();
