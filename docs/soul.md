# SOUL.md — Agent Identity Files

How personality is stored and injected into AI agents.

---

## What It Is

SOUL.md is a markdown file that defines an agent's identity, personality, tone, boundaries, and operating principles. It sits alongside the agent's other configuration files and gets loaded into the system prompt on every session.

The idea is simple: instead of hardcoding an agent's personality in the system prompt or relying on a user to describe their preferences each time, you write it once into a structured file that travels with the agent.

---

## How It Works

```
SOUL.md → loaded as system prompt context → agent reads identity on every turn
```

The file contains structured sections covering:

| Section | What It Defines |
|---------|----------------|
| **Identity** | Name, role, pronouns, core purpose |
| **Tone** | Communication style — formal, direct, warm, playful |
| **Boundaries** | Hard rules the agent must never violate |
| **Priorities** | What matters most in decision-making |
| **Tool Protocol** | Which tools the agent can use and how |

Because it's a markdown file, it's human-readable and editable. Users can open it, see exactly what defines their agent, and make changes without touching any code.

---

## Example SOUL.md Files

A SOUL.md file can define any type of agent. Here are two examples:

### Coding Agent

Defines a precise, execution-focused coding specialist:

- **Identity:** "Highly focused and meticulous Coding Agent"
- **Boundaries:** No external access, no deployment without approval
- **Priorities:** Precision, clarity, verification
- **Tool scope:** Local execution only — no web search

### Security Agent

Defines a vigilant monitoring specialist:

- **Identity:** "Security Guardian Agent"
- **Priority:** System integrity, threat detection, auditability
- **Boundary:** Never modify system files without documented human approval
- **Protocol:** Daily review of operational logs, violation flagging

---

## The Pattern

The SOUL.md pattern follows a consistent structure:

1. **Name and role** come first — establishes identity
2. **Priorities** — what matters most when decisions need to be made
3. **Boundaries** — non-negotiable rules that prevent mistakes
4. **Tool scope** — which parts of the system the agent can touch
5. **Communication style** — how the agent sounds

This is the same structure that a personalisation flow would produce. A guided onboarding (name, avatar, tone, memory) writes to a SOUL.md file, which the agent then reads on every turn.

---

## Why It Matters for Personalisation

The SOUL.md pattern already exists in production agents today. Claude has project knowledge and custom instructions. ChatGPT has memory and custom instructions. Hermes Agent has SOUL.md files. The mechanism is proven.

What's missing is a UI onboarding flow that writes to this file. Users currently edit these settings through configuration panels, documentation, or raw markdown files. This project explores making that process the first thing a user experiences — turning a configuration file into a conversation.

```
Guided onboarding → writes SOUL.md → agent reads identity → personalised interaction
```

The three choices in the prototype (name, avatar, tone) map directly to sections in a SOUL.md file:

- **Name** → Identity section
- **Avatar** → Identity section (visual representation)
- **Tone** → Communication style section

---

## References

1. [Hermes Agent documentation](https://hermes-agent.nousresearch.com/docs/guides/use-soul-with-hermes) — SOUL.md concept and agent configuration
2. [SOUL.md](https://soul.md) — SOUL.md specification
---

*This file is a living reference. Last updated: July 6, 2026.*
