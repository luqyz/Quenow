# QueNow 🍲

A real-time queue-checker web app for shabu-shabu and yakiniku outlets, built to help diners check current queue status before leaving home.

**Live Demo:** [https://quenow.vercel.app/]

## Problem

Popular buffet-style restaurants (shabu-shabu, yakiniku) often have long queues, especially during peak hours. Since these outlets don't provide public APIs for their queue systems, diners have no way to check wait times before arriving — leading to wasted trips and long waits.

## Solution

QueNow uses a crowd-sourced approach: diners who are currently at an outlet can report the queue status, which updates in real-time for all other users viewing the app — similar to how Waze crowdsources traffic data.

## Features

- 📍 **Multi-outlet support** — browse outlets across multiple brands (Shabuyaki, Sukiya, Samurai Yakiniku, BBQ Town)
- 🔴🟡🟢 **Real-time queue status** — color-coded badges (low/medium/high/no data)
- 📊 **Crowd-sourced reporting** — users report queue count, with auto-calculated wait time estimates
- ⏱️ **Queue decay simulation** — estimated queue count decreases automatically over time to reflect real-world flow
- 🗺️ **Map view** — see outlet locations on an interactive map
- 🔍 **Filtering & sorting** — filter by brand, queue status, or open-now; sort by shortest queue or nearest distance
- ⚡ **Live sync** — updates propagate to all connected users instantly via Supabase Realtime

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router
- **Backend:** Supabase (PostgreSQL, Row Level Security, Realtime subscriptions)
- **Maps:** Leaflet + React-Leaflet (OpenStreetMap)
- **Charts:** Recharts
- **Deployment:** Vercel (CI/CD via GitHub)

## Architecture
Frontend (React)
↕
Supabase Client (JS SDK)
↕
Supabase (PostgreSQL + Realtime + RLS)

## Challenges & Learnings

- Handling timezone inconsistencies between Supabase timestamps and local display
- Designing a queue-count "decay" algorithm to simulate live updates without needing direct integration with restaurant POS systems
- Setting up Row Level Security policies to allow public read/write access safely for an MVP without authentication

## Future Improvements

- Restaurant/staff-facing dashboard for more accurate updates
- Rate-limiting to prevent spam reports
- User authentication for report accountability
- Push notifications when a favorite outlet's queue drops

## Author

Built by Luqman — (https://www.linkedin.com/in/luqman-amzari)

