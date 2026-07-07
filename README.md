# Personalising Agents

Exploring how AI agents can feel personal, not generic.

![Prototype preview](prototype/Desktop.png)

---

## What This Is

A sub-project exploring the concept of agent personalisation. The core idea: collect a user's choices (name, avatar, tone) into a markdown file that gets injected into the LLM's system prompt on every turn. The agent doesn't just know your name, it has a persistent identity shaped by those choices.

Companies like Claude already use this pattern (project knowledge, custom instructions), but they frame it as configuration, not personalisation. This project explores what happens when you make it the first thing a user sees.

---

## Contents

| Path | What |
|------|------|
| [`prototype/`](prototype/) | Interactive HTML prototype showing the personalisation flow |
| [`docs/project-page.md`](docs/project-page.md) | Concept overview and exploration notes |
| [`docs/soul.md`](docs/soul.md) | Research on SOUL.md — how agent identity is stored and injected |
| [`docs/research.md`](docs/research.md) | Research sources and references |

---

## The Mechanism

```
User choices → written to profile.md → injected into LLM system prompt → persistent identity
```

The personalisation data (name, avatar selection, tone settings) is stored in a structured markdown file. Every time the user interacts with the agent, that profile is loaded as context. The result is an agent that:

- Greets you by **name**
- Communicates in your chosen **tone**
- Shows your selected **avatar**
- Remembers these choices across sessions

No fine-tuning, no model changes. Just structured context.

---

## The Gap

This mechanism already exists in products today — Claude has project knowledge and custom instructions, ChatGPT has memory and custom instructions, Hermes has skills and profile files. The technical capability is there.

What doesn't exist is a UI onboarding flow around it. Users find these settings buried in menus, or never discover them at all. The personalisation is treated as configuration, something you visit once and forget.

This project explores the opposite: making personalisation the first thing a user experiences, not the last thing they find.

---

## Project Structure

```
├── README.md
├── LICENSE
├── .gitignore
├── prototype/              # Interactive HTML prototype
│   ├── index.html
│   ├── styles.css
│   └── script.js
└── docs/
    ├── project-page.md     # Concept overview
    ├── soul.md             # SOUL.md research — how agent identity is stored
    └── research.md         # Research sources
```

---

## License

MIT — see [LICENSE](LICENSE).

Design by **Jarret Ho** ([jarretho.com](https://jarretho.com))
