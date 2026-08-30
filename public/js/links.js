// ============================================================
// links.js — THE ONLY FILE YOU EDIT to change the Harbor.
//
// Add a tile  -> add a block to TILES.
// Fix a link  -> change its `url`.
// Hide a tile -> add   hidden: true,
// Add a KPI   -> see the KPIS section at the bottom.
// ============================================================

export const HARBOR = {
  // ---------- what the page calls itself ----------
  NAME: "Harbor",                  // sits next to the JETTY wordmark
  PAGE_TITLE: "Harbor — Jetty",    // browser tab + what a bookmark is called
  TAGLINE: "Draw Your Own Line.",
  SUBTITLE: "Every Jetty tool, one door.",

  // ---------- the tiles ----------
  // icon: one of  compass · manifest · tide · board · calendar · gull · link
  // url:  leave "" and the tile shows as "link coming" (dimmed, not clickable)
  TILES: [
    {
      name: "Jetty Central Dashboard",
      blurb: "Helm — booked dollars, goals, reps, retailers.",
      url: "https://whsl-central-dashboard.netlify.app/",
      icon: "compass",
    },
    {
      name: "Manifest",
      blurb: "Order status & fulfillment for the WHSL team.",
      url: "https://jetty-order-manifest.netlify.app",
      icon: "manifest",
    },
    {
      name: "Tide Chart",
      blurb: "Product trends, seasonality, and category mix.",
      url: "https://jetty-tide-chart.netlify.app",
      icon: "tide",
    },
    {
      name: "Whiteboard",
      blurb: "FW27 line review — drag cards, Drive stays in sync.",
      url: "https://jetty-whiteboard.netlify.app",
      icon: "board",
    },
    {
      name: "WHSL Appt Schedule",
      blurb: "Market appointments and show scheduling.",
      url: "https://jetty-appt-schedule.netlify.app",
      icon: "calendar",
    },
    {
      name: "Otis the Seagull",
      blurb: "Beach patrol. Do not feed him.",
      url: "https://otis-the-gull-game.netlify.app/",
      icon: "gull",
      fun: true,                    // renders in the "Off the clock" row
    },
  ],

  // ---------- KPI strip (top of page) ----------
  // Empty = no strip shown at all. When you're ready for numbers:
  //   1. set SUMMARY_URL to the Harbor Apps Script /exec URL
  //   2. list the KPIs you want here; `key` matches a key in that JSON
  //
  // Example:
  //   { key: "bookedYTD", label: "Booked YTD",  format: "usd",  source: "Central" },
  //   { key: "pctShipped", label: "% Shipped",  format: "pct",  source: "Manifest" },
  SUMMARY_URL: "",
  KPIS: [],
};
