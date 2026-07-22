---
name: portfolio-discovery
description: Discover Mattia Curri's public profile, projects, publications, and course notes.
---

# Portfolio Discovery

Use this skill to retrieve public information from Mattia Curri's portfolio.

## Browser agents

When WebMCP is available, call `get_portfolio_profile` for structured profile data or
`get_portfolio_page` to locate the home and notes pages.

## HTTP agents

1. Read `/robots.txt` before crawling.
2. Use `/sitemap.xml` to discover canonical public pages.
3. Treat the portfolio as read-only public information.
4. Follow the `Content-Signal` preferences declared in `/robots.txt`.
