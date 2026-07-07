# Personalising Agents

Exploring how AI agents can feel personal, not generic.

---

## The Concept

Every AI assistant onboards the same way: sign in, then a blank "How can I help you?" This project explores what happens when you replace that empty greeting with a moment of personalisation.

The core idea is simple:

> Collect a user's choices into a markdown profile that gets injected into the LLM's system prompt on every turn.

The agent doesn't just know your name — it has a persistent identity shaped by those choices. Name, avatar, tone. Three inputs that turn a generic text box into something that feels like a presence.

---

## How It Works

The mechanism is already in use by products like Claude (project knowledge, custom instructions) and ChatGPT (memory, custom instructions). These systems store user preferences and inject them into the context window at inference time. The profile is just a markdown file, no fine-tuning, no model changes, just structured context that loads on every session.

```
User choices → structured profile.md → injected into system prompt → persistent identity
```

This pattern is already formalised as a SOUL.md file. A structured markdown document that defines an agent's identity, tone, boundaries, and tool scope. The three choices in this prototype map directly to SOUL.md sections:

- **Name** → Identity section
- **Avatar** → Identity section (visual representation)
- **Tone** → Communication style section

The difference is framing. Most products treat this as configuration — a settings panel you visit once and forget. Users find these options buried in menus or through raw markdown documentation, not through the product itself. The personalisation layer is treated as an advanced feature when it should be the front door.

This project explores the missing piece: not the technology, but a guided onboarding moment that sets the relationship from the first interaction.

---

## What's Here

| Asset | Description |
|-------|-------------|
| Interactive prototype | HTML/CSS/JS walkthrough of the personalisation flow in a windowed interface |
| Screen captures | Visual references of the key screens (welcome, name, avatar, tone, chat) |
| Research notes | Competitive analysis of how ChatGPT, Claude, Gemini, and Hermes handle personalisation |
| Design system | Colour palette, typography, and component tokens used in the prototype |

The interactive prototype is the main deliverable. Everything else supports the thinking behind it.

---

## The Three Choices

1. **Name** — Give the agent a name so it feels like yours
2. **Avatar** — Pick a face that represents the agent
3. **Tone** — Set how the agent communicates (formal, warm, direct, or balanced)

Each choice maps to a field in the profile file. The combination of all three creates the sense of a distinct personality. More complex choices like memory can be added later, but this project keeps it to three.

---

## Context

Three observations motivated this exploration:

- AI fatigue. Generic AI features are becoming noise. Users are tired of the same interface everywhere.
- The memory divide. Tools that don't remember you get abandoned. Personalisation is part of memory.
- Commoditised UI. Design systems made interfaces cheap to produce. The differentiator is personality.

This project started as a research brief and evolved into a design exploration. Not a finished product, but a study of what the first moment with an AI agent could feel like.

---

## Interactive Prototype 

Open [`prototype/index.html`](../prototype/index.html) in a browser to walk through the flow. Built with plain HTML, CSS, and JavaScript — no dependencies, no build step.
