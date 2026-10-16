# Чекор — arrival sequence and article registry

Use this file to set `sequenceStep` in frontmatter and to link related articles.

## The 9-step arrival sequence

| Step | Slug | Title (Macedonian) | Status |
|------|------|--------------------|--------|
| 1 | anmeldung | Пријава на адреса | Published |
| 2 | steuer-id | Даночен број | To write |
| 3 | bankovna-smetka | Банкарска сметка | To write |
| 4 | krankenkasse | Здравствено осигурување | To write |
| 5 | vozacka-dozvola | Возачка дозвола | To write |
| 6 | anerkennung | Признавање на диплома | To write |
| 7 | steuerklasse | Даночна класа | To write |
| 8 | kindergeld | Детски додаток | To write |
| 9 | pari-doma | Испраќање пари дома | To write |

File name pattern: `<slug>.mdx` (e.g. `anmeldung.mdx`).

## Dependencies already stated in published articles

- Step 1 (Anmeldung) comes first. Without it there is no Steuer-ID, bank account, health insurance or driving licence exchange.
- The Meldebescheinigung from step 1 is needed for the bank, the insurance and the driving licence.
- The Steuer-ID (step 2) arrives by post, automatically, at the registered address after step 1.

## Callout variants in use

- `важно` — reassurance or protective advice (e.g. keep proof of your attempt).
- `внимание` — serious warnings: fines, scams, irreversible mistakes. One or two per article at most.

Add any new variant here before using it.

## Published articles

| Step | Slug | Last updated |
|------|------|--------------|
| 1 | anmeldung | 2026-10-02 |

Update this table after each article is published.

## Open items (fill in)

- Default geographic scope for articles: [Germany-wide / Berlin]
- URL pattern for internal links: [e.g. /articles/<slug>]
