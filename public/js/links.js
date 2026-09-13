// ============================================================
// links.js — THE ONLY FILE YOU EDIT to change the Harbor.
//
// Add a tile     -> add a block to TILES.
// Fix a link     -> change its `url`.
// Hide a tile    -> add   hidden: true,
// Move a tile    -> change its `section` to another SECTIONS key.
// Add a section  -> add to SECTIONS, then point tiles at its key.
// Add a KPI      -> see the KPIS section at the bottom.
// ============================================================

export const HARBOR = {
  // ---------- what the page calls itself ----------
  NAME: "Harbor",                  // sits next to the JETTY wordmark
  PAGE_TITLE: "Harbor — Jetty",    // browser tab + what a bookmark is called
  TAGLINE: "Draw Your Own Line.",
  SUBTITLE: "Every Jetty tool, one door.",

  // ---------- sections ----------
  // Rendered top to bottom in this order. A section with no tiles is skipped.
  // style: leave off for the normal white tile, or "airtable" for the sand-
  // edged treatment. note: optional line of hint text under the heading.
  SECTIONS: [
    { key: "tools", label: "Tools" },
    {
      key: "airtable",
      label: "Airtable",
      style: "airtable",
      note: "Opens in Airtable — you'll need to be signed in to your Jetty account.",
    },
    { key: "fun", label: "Off the clock" },
  ],

  // ---------- the tiles ----------
  // section: a key from SECTIONS above. Leave it off and the tile lands in the
  //          first section ("tools").
  // icon:    compass · manifest · tide · board · calendar · media · pages ·
  //          table · layout · box · people · gull · link
  // url:     leave "" and the tile shows as "link coming" (dimmed, not clickable)
  TILES: [
    {
      name: "The Lineup",
      blurb: "Master Dashboard and CRM.",
      url: "https://jetty-the-lineup.netlify.app/",
      icon: "people",               // Supabase-backed; not the shared Jetty gate
    },
    {
      name: "Manifest",
      blurb: "Order status & fulfillment for the WHSL team.",
      // MASTER link (?key=...) — shows every territory's rows, deliberately.
      // Safe only because Harbor's audience is leadership, not reps. If reps
      // ever get the Harbor password this must change: see README, "A note on
      // the Manifest key".
      url: "https://jetty-order-manifest.netlify.app/?key=0fb68200dae7459f9d083ec43f804d5e",
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
      name: "Image Library",
      blurb: "Product and lifestyle photography, searchable.",
      url: "https://jetty-media-library.netlify.app/",
      icon: "media",
    },
    {
      name: "Territory Links",
      blurb: "Every territory's private dashboard link, ready to hand out.",
      url: "https://whsl-central-dashboard.netlify.app/?pages",
      icon: "pages",
    },
    {
      name: "Warehouse",
      blurb: "Pick & pack for wholesale and ecommerce orders.",
      url: "https://jettydistribution.up.railway.app",
      icon: "box",                  // has its own login — not the Jetty password
    },

    // ---------- Airtable ----------
    {
      name: "Resource Center",
      blurb: "Sales rep resources — Jetty WHSL Resource Center.",
      url: "https://airtable.com/appHPbrOjbD4AfSlG/tblJoPHK9ERA7ScfT/viw4j9m97k5kpnxvK?blocks=hide",
      icon: "table",
      section: "airtable",
    },
    {
      name: "CRM",
      blurb: "Commercial Sales New base.",
      url: "https://airtable.com/appVIK4CawVEY8hBJ/tblWhs5YnLHVVYhGd/viw6WWATT5UURDU8D?blocks=hide",
      icon: "table",
      section: "airtable",
    },
    {
      name: "Budget Tracker HUB",
      blurb: "",                    // add a one-liner here if you want one
      url: "https://airtable.com/appJbKBr1gHkPtd8a/pageqGmhsGBhBXiUM",
      icon: "layout",
      section: "airtable",
    },

    // ---------- off the clock ----------
    {
      name: "Otis the Seagull",
      blurb: "Beach patrol. Do not feed him.",
      url: "https://otis-the-gull-game.netlify.app/",
      icon: "gull",
      section: "fun",
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
