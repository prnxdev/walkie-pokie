# WalkiePokie

> Explore the wilderness and catch AI-generated fantasy creatures — powered by a local LLM running on your machine.

---

## What is this?

WalkiePokie is a full-stack creature-catching game where every creature you encounter is **uniquely generated on the fly** by a local Ollama model. No two runs are the same. Wander into the wild, wait for the encounter, and see what the AI conjures up — from fire-breathing salamanders to eldritch sky-jellyfish.

Think Pokémon, but every creature is a surprise even to the developer.

---

## Features

- **AI creature generation** — Each encounter calls a local LLM (via Ollama) with structured output, producing a creature with a name, types, rarity, attacks, height, weight, and lore description.
- **Real-time results** — Encounters stream back over WebSockets so you see the creature appear the moment it's ready.
- **Pokédex** — Caught creatures are saved to a SQLite database and browsable in your personal collection.
- **Rarity system** — Creatures roll as Common, Rare, or Legendary, with varied stats to match.
- **Persistent identity** — Register a trainer name and your collection persists across sessions.
- **Runs fully offline** — No cloud API keys required. Just Ollama running locally.

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | Vue 3 + TypeScript |
| Backend | Nitro (H3) + Socket.IO |
| AI | Ollama (`llama3.2` by default) |
| Database | SQLite via `better-sqlite3` |
| Monorepo | Nx |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/)
- [Ollama](https://ollama.com/) running locally with a model pulled:

```sh
ollama pull llama3.2
```

### Install & run

```sh
pnpm install

# Start backend
pnpm nx serve backend

# Start frontend (separate terminal)
pnpm nx serve frontend
```

Open [http://localhost:4200](http://localhost:4200) and start exploring.

### Environment variables

| Variable | Default | Description |
|---|---|---|
| `OLLAMA_HOST` | `http://localhost:11434` | Ollama server URL |
| `OLLAMA_MODEL` | `llama3.2` | Model to use for generation |

---

## How it works

1. You click **Explore** in the app.
2. The frontend sends a request to the backend with your socket ID.
3. The backend calls Ollama with a structured JSON schema prompt — temperature 0.9 for maximum creativity.
4. The generated creature is validated against a Zod schema and emitted back over the WebSocket.
5. If you're logged in, the creature is saved to SQLite and added to your Pokédex.

---

## Project structure

```
apps/
  backend/        — Nitro API server + Socket.IO
  frontend/       — Vue 3 SPA
libs/
  shared/schema/  — Zod creature schema shared between front and back
```
