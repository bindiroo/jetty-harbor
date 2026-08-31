# Harbor

Harbor is the Jetty team's front door: one branded page that links to every
internal tool. Static — no build step, no data source (yet). Netlify serves the
`public/` folder as-is; everything the page needs (fonts aside) is in this repo.

```
public/
  index.html        the page
  css/harbor.css    Jetty brand styling
  js/links.js       <-- THE ONLY FILE YOU EDIT: tiles + KPIs
  js/app.js         gate, tile rendering, optional KPI fetch
  assets/           Jetty badge + favicon
netlify.toml        publish = public, no build command
```

## Run it locally

```bash
python3 -m http.server 8140 --directory public
# open http://localhost:8140
```

## Add or change a link

Open `public/js/links.js`, edit the `TILES` list, save, commit, push. Netlify
redeploys in about 20 seconds.

```js
{
  name:  "New Tool",
  blurb: "One line about what it does.",
  url:   "https://new-tool.netlify.app",
  icon:  "link",     // compass · manifest · tide · board · calendar · gull · link
},
```

A tile with `url: ""` renders dimmed with a "Link coming" badge, so you can list
something before it's live.

## Sections

Tiles are grouped by `section`, and the groups themselves come from `SECTIONS`
at the top of the same file — order on the page follows order in that list. A
tile with no `section` falls into the first one, and a section with no tiles
simply doesn't render.

```js
SECTIONS: [
  { key: "tools",    label: "Tools" },
  { key: "airtable", label: "Airtable", style: "airtable", note: "…" },
  { key: "fun",      label: "Off the clock" },
],
```

`style: "airtable"` gives those tiles a sand left edge and sand icon, so links
that leave the Jetty sites read differently at a glance without leaving the
brand palette. `note` is an optional line of hint text under the heading. To add
another styled group, add a `SECTIONS` entry and a `.tile--<style>` rule in
`css/harbor.css`.

## Password

The site is **public** — anyone with the link reaches it — and the first thing
they meet is a shared-password gate. It uses the same team password as the other
Jetty tools, so there's no second prompt on the way through. The password itself
is never in the code; only its SHA-256 fingerprint (`GATE_HASH` in `js/app.js`)
is. To change it, hash the new one and replace that constant:

```bash
printf '%s' 'newpassword' | shasum -a 256
```

Changing it here makes Harbor diverge from the other five tools, which each hold
their own copy of the old fingerprint — you'd need to update all six to keep one
password everywhere.

**What this gate is and isn't.** It runs in the browser, so it keeps the page
tidy and out of casual reach, but someone who opens View Source can read the tile
list without knowing the password. That is an acceptable trade here: the only
thing behind the gate is a list of links, and every tool those links point at has
its own gate. Do not put anything genuinely sensitive on this page without moving
to server-side protection first (see `docs/REAL-AUTH.md`).

## Keep the repo private

The site is public; the **repo should stay private**. A public repo would publish
the tile list and the password fingerprint to anyone browsing GitHub.

## KPIs at the top (not wired yet)

The strip is built but stays hidden while `HARBOR.KPIS` is empty. The plan is one
small Apps Script that runs on a schedule, reads a few numbers from each tool's
sheet, and returns a single JSON blob:

```json
{ "updated": "2026-08-30T11:00:00Z",
  "values": { "bookedYTD": 4820000, "pctShipped": 0.61, "openOrders": 312 } }
```

Then set `SUMMARY_URL` to that script's `/exec` URL and list the KPIs you want in
`HARBOR.KPIS`. One fetch, no per-tool keys in the browser, and the page still
works as a link page if the script is down.
