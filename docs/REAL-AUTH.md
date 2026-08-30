# If you ever need a real password on Harbor

Harbor ships with a **browser-side** gate (`GATE_HASH` in `public/js/app.js`).
It is a deterrent, not a lock: the page and its tile list are already in the
browser before the gate is drawn, so View Source gets past it.

That is fine for what Harbor holds today — a list of links, each pointing at a
tool with its own gate. It stops being fine the moment a real number lands on
the page (the KPI strip) or a link itself is sensitive.

Here are the three ways up, cheapest first.

---

## 1. Leave it as-is

**Protects against:** a stray link getting forwarded, someone idly typing the
URL, the page being screenshotted over a shoulder.
**Does not protect against:** anyone curious enough to press Cmd-Option-U.

Right answer while Harbor is only a link page.

---

## 2. Netlify's built-in password protection

Netlify can password-protect a whole site server-side, configured in the site's
UI under visitor access — no code at all. Real protection: Netlify refuses to
send the HTML without the password.

Two things to check before counting on it:

- It is a **paid-plan feature**. Confirm it's included on your current plan
  before planning around it — Netlify moves these between tiers.
- It replaces the branded Jetty gate with Netlify's own prompt.

---

## 3. An Edge Function (free tier, real protection)

Netlify runs this on their servers *before* any HTML is sent. The password
lives in a Netlify environment variable, never in the repo.

Create `netlify/edge-functions/gate.js`:

```js
export default async (request, context) => {
  const PASS = Netlify.env.get("HARBOR_PASSWORD");
  if (!PASS) return context.next();          // not configured yet — don't lock anyone out

  const header = request.headers.get("authorization") || "";
  if (header.startsWith("Basic ")) {
    const [, pass] = atob(header.slice(6)).split(":");
    if (pass === PASS) return context.next();
  }
  return new Response("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Harbor", charset="UTF-8"' },
  });
};
```

Add to `netlify.toml`:

```toml
[[edge_functions]]
  function = "gate"
  path = "/*"
```

Then set `HARBOR_PASSWORD` in Netlify under environment variables, and delete
the browser-side gate from `index.html` / `app.js` so people aren't asked twice.

**The trade-off:** this uses HTTP Basic Auth, so viewers get the browser's plain
grey dialog instead of the Jetty-branded card. Any username works; only the
password is checked.

---

## 4. Branded *and* real (most work)

Keep the Jetty card by having the edge function serve the login page itself:

1. Edge function checks for a signed cookie. If valid, `context.next()`.
2. If not, it returns the branded login HTML instead of the real page.
3. That form POSTs to the same function; on a correct password it sets a signed,
   `HttpOnly`, `Secure` cookie (say, 30 days) and redirects.

Same protection as option 3 with the Jetty gate intact. Worth doing if Harbor
ever becomes the page the whole company lands on — overkill before then.
