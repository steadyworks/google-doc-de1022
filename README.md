# Google Doc Live Demo

Build a live collaborative document editor — a Google Docs–style demo where multiple browser clients edit a shared document in real time. This is a demo app, so no auth or database is required; everything lives in memory.

## Stack

- **Frontend**: Vite + React + TailwindCSS (port 3000)
- **Backend**: Node.js + Express + Socket.io (port 3001)
- **Persistence**: In-memory only (no database)

## Features

### Document Editor

A large, scrollable `<textarea>` fills the main content area. All clients visiting the same document URL share the same live content. When any client edits the textarea, the change is broadcast to every other connected client within 200 ms.

Documents are addressed by ID in the URL: `/doc/:id`. Visiting `/` redirects automatically to `/doc/default`.

### Real-time Sync

When a client edits the document:

1. The client updates its own textarea immediately (no waiting for server).
2. The client emits a `text-change` event carrying the full document content.
3. The server stores the latest content in memory and broadcasts it to **all other clients** in the same room (no self-echo).
4. Receiving clients replace their textarea value with the incoming content.

Conflict resolution is **last-write-wins** — no OT or CRDT required.

### Concurrent Connections Counter

A live counter in the **top-right corner** of every page shows how many clients are currently connected to the same document. It updates immediately when any client joins or leaves.

Display format: **`N connected`** — e.g. `"1 connected"`, `"3 connected"`.

### Connection Status Indicator

A small badge next to (or below) the counter shows the current WebSocket state: `"connected"` when the Socket.io socket is open, `"disconnected"` when it is not. It must update reactively.

---

## Pages

**`/`** — Redirect immediately to `/doc/default`.

**`/doc/:id`** — Collaborative editor for document `:id`.

Layout:
- **Header bar** (sticky top): document ID label on the left; connection counter + status badge on the right.
- **Editor area** (remainder of viewport): full-width, full-height `<textarea>` for document content with a comfortable font and padding.

---

## UI Requirements

Use these `data-testid` attributes **exactly** — the Playwright test harness depends on them.

### Editor page (`/doc/:id`)

- `data-testid="doc-editor"` — the main `<textarea>`. Its `value` must always equal the current document content and it must be directly editable by the user.
- `data-testid="connection-counter"` — element in the top-right whose `innerText` is `"N connected"` (e.g. `"3 connected"`). Must update live.
- `data-testid="connection-status"` — badge whose `innerText` is exactly `"connected"` or `"disconnected"`.
- `data-testid="doc-id"` — element showing the current document ID string (e.g. `"default"`).
