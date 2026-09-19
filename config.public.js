  /* W1 — public config only. No credentials. No Business IDs. */
window.AMROTH_PUBLIC = {
  /* Local/staging Commander intake. Production URL set only when deploying with approval. */
  intakeUrl: "http://127.0.0.1:7420/api/public/amroth/enquiries",
  /* Permanent Amroth QR feature (2026-09-14) — same public-intake host as intakeUrl above.
     Production URL set only when deploying with approval. */
  qrApiBase: "http://127.0.0.1:7420/api/public/amroth",
  consentVersion: "amroth-web-consent-v1",
  gaId: "G-T5ERDNZHLZ",
  whatsappEnquiryE164: "918106350955",
  generalPhoneDisplay: "+91 7702741798",
  email: "amrothproducts@gmail.com"
};
