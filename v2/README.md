# v2

Fully self-serve punch card system. See `CLAUDE.md` in project root for context.

## Specs

- `user-app-spec.md` — customer-facing app (mobile browser)
- `merchant-app-spec.md` — business-facing app (desktop browser)
- `todo.md` — open questions and ideas

## Designs

All in `designs/`. These are standalone HTML files — open in a browser to preview.

| File | What |
|------|------|
| `landing.html` | Landing page at epunch.app |
| `user-app.html` | Customer app — QR code, punch cards, redemption |
| `merchant-dashboard.html` | Merchant dashboard — stats, activity, settings |
| `mobile-viewer.html` | Dev tool to preview designs on mobile with state toggles |
| `data.js` | Shared mock data for user-app and merchant-dashboard |

### `handout/`

Print-ready handout (paper ad) to hand out to cafe owners.

| File | What |
|------|------|
| `handout.html` | Final handout layout (front + back) |
| `app.html` | Embedded phone mockup shown inside the handout |
| `data.js` | Mock data for the handout phone mockup |
| `devices.min.css` | Third-party CSS for phone device frame |
