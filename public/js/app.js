// ============================================================
// app.js — gate, tiles, and (optional) KPI strip.
// You should not need to edit this file. Edit js/links.js instead.
// ============================================================
import { HARBOR } from "./links.js";

const $ = (sel, root = document) => root.querySelector(sel);

// ---------- password gate ----------
// The shared Jetty team password — the same one that opens the other tools, so
// nobody hits a second, different prompt on the way in. The password itself is
// never in this file; only its SHA-256 fingerprint is. An unlock is remembered
// per device. To change it, see the "Password" section of the README.
const GATE_HASH = "e591eb27e3f9c5041466df89f5479875024715cb60a222cc4006b78bff005549";
const GATE_KEY = "harbor_unlocked_v1";
async function sha256Hex(s) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function passwordGate() {
  return new Promise((resolve) => {
    const gate = $("#gate");
    if (!gate) return resolve();
    let ok = false;
    try { ok = localStorage.getItem(GATE_KEY) === GATE_HASH; } catch (_) {}
    if (ok) { gate.style.display = "none"; return resolve(); }
    const form = $("#gateForm"), pw = $("#gatePw"), err = $("#gateErr");
    setTimeout(() => pw && pw.focus(), 50);
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const h = await sha256Hex((pw.value || "").trim());
      if (h === GATE_HASH) {
        try { localStorage.setItem(GATE_KEY, GATE_HASH); } catch (_) {}
        gate.style.display = "none";
        resolve();
      } else {
        err.textContent = "Incorrect password. Try again.";
        pw.value = ""; pw.focus();
      }
    });
  });
}

// ---------- icons ----------
// Simple line icons drawn inline, so the page has no external image requests.
const ICONS = {
  compass: '<circle cx="12" cy="12" r="9"/><path d="M15.6 8.4l-2 5.2-5.2 2 2-5.2z"/>',
  manifest:'<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4"/><path d="M9 12h7M9 16h7M9 8h3"/>',
  tide:    '<path d="M3 15c2.5 0 2.5-2.5 5-2.5S10.5 15 13 15s2.5-2.5 5-2.5S20.5 15 21 15"/><path d="M3 19c2.5 0 2.5-2.5 5-2.5S10.5 19 13 19s2.5-2.5 5-2.5S20.5 19 21 19"/><path d="M12 10V4M12 4l3 2M12 4L9 6"/>',
  board:   '<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M7 8h4v4H7zM14 8h3M14 12h3"/><path d="M12 18v3"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M8 14h3v3H8z"/>',
  gull:    '<path d="M2 11c3 0 5-3 7-3s2 2 3 2 1-2 3-2 4 3 7 3"/><path d="M8 14c1.5 2 3 3 4 3s2.5-1 4-3"/><circle cx="12" cy="7" r=".6" fill="currentColor" stroke="none"/>',
  link:    '<path d="M10 13a5 5 0 007.5.5l2-2A5 5 0 1012.5 4.5l-1 1"/><path d="M14 11a5 5 0 00-7.5-.5l-2 2A5 5 0 1011.5 19.5l1-1"/>',
  media:   '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.4"/><path d="M3 16l4.5-4 3.5 3 3-2.5L21 17"/>',
  pages:   '<path d="M4 6h10M4 12h10M4 18h10"/><path d="M18 5.5l2 2-2 2M18 15.5l2 2-2 2"/>',
  table:   '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M3 14.5h18M9 9v11"/>',
  layout:  '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9.5 9v11"/><path d="M13 12.5h5M13 16h3"/>',
};
function iconSvg(key) {
  const body = ICONS[key] || ICONS.link;
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${body}</svg>`;
}

// ---------- tiles ----------
function tileHtml(t, style) {
  const cls = style ? ` tile--${style}` : "";
  const icon = `<div class="tile__icon">${iconSvg(t.icon)}</div>`;
  const body = `<div class="tile__body">
      <div class="tile__name">${esc(t.name)}</div>
      <div class="tile__blurb">${esc(t.blurb || "")}</div>
      ${t.url ? "" : '<span class="tile__soon">Link coming</span>'}
    </div>`;
  if (!t.url) return `<div class="tile${cls} tile--todo">${icon}${body}</div>`;
  return `<a class="tile${cls}" href="${esc(t.url)}" target="_blank" rel="noopener">
      ${icon}${body}<span class="tile__arrow">↗</span>
    </a>`;
}
function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
// Sections come straight from HARBOR.SECTIONS, in that order. A tile with no
// `section` falls into the first one, so the common case stays uncluttered.
// A section with no tiles in it simply doesn't render.
function renderSections() {
  const all = (HARBOR.TILES || []).filter((t) => !t.hidden);
  const sections = HARBOR.SECTIONS || [{ key: "tools", label: "Tools" }];
  const fallback = sections[0].key;
  $("#sections").innerHTML = sections.map((s) => {
    const mine = all.filter((t) => (t.section || fallback) === s.key);
    if (!mine.length) return "";
    return `<section class="sect">
        <div class="sectlbl">${esc(s.label)}</div>
        ${s.note ? `<div class="sectnote">${esc(s.note)}</div>` : ""}
        <div class="tiles">${mine.map((t) => tileHtml(t, s.style)).join("")}</div>
      </section>`;
  }).join("");
}

// ---------- KPI strip ----------
const fmt = {
  usd: (n) => "$" + Math.round(n).toLocaleString("en-US"),
  usd0k:(n) => "$" + Math.round(n / 1000).toLocaleString("en-US") + "k",
  num: (n) => Math.round(n).toLocaleString("en-US"),
  pct: (n) => (n * 100).toFixed(1) + "%",
  raw: (v) => String(v),
};
function renderKpis(values) {
  const defs = HARBOR.KPIS || [];
  if (!defs.length) return;
  const box = $("#kpis");
  box.hidden = false;
  box.innerHTML = defs.map((d) => {
    const v = values ? values[d.key] : undefined;
    const shown = v == null || v === "" ? "—" : (fmt[d.format] || fmt.raw)(v);
    return `<div class="kpi">
        <div class="kpi__val">${esc(shown)}</div>
        <div class="kpi__lbl">${esc(d.label)}</div>
        ${d.source ? `<div class="kpi__src">${esc(d.source)}</div>` : ""}
      </div>`;
  }).join("");
}
async function loadKpis() {
  const defs = HARBOR.KPIS || [];
  if (!defs.length) return;
  renderKpis(null);                       // show the labels with em-dashes first
  if (!HARBOR.SUMMARY_URL) return;
  try {
    const r = await fetch(HARBOR.SUMMARY_URL, { redirect: "follow" });
    const j = await r.json();
    renderKpis(j.values || j);
  } catch (_) { /* leave the em-dashes; the hub still works as a link page */ }
}

// ---------- boot ----------
init();
async function init() {
  await passwordGate();
  $("#heroTitle").textContent = HARBOR.NAME;
  $("#heroTag").textContent = HARBOR.TAGLINE;
  $("#heroSub").textContent = HARBOR.SUBTITLE || "";
  document.title = HARBOR.PAGE_TITLE || HARBOR.NAME;
  renderSections();
  loadKpis();
}
