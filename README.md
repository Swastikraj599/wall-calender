# Wall Calendar — Interactive React Component

A polished, interactive wall calendar component built with Next.js, inspired by the aesthetic of a physical wall calendar.

## Live Demo

[View Live →](https://wall-calender-kappa.vercel.app/)

## Preview

The calendar features a full-width hero photograph that changes every month, a date range selector, an integrated notes section, and a physical wall calendar aesthetic complete with spiral binding.

## Features

- **Wall Calendar Aesthetic** — Spiral binding detail, full-width monthly hero photography, and a clean segmented layout that mirrors a physical wall calendar
- **Dynamic Monthly Themes** — Each month has a unique hero image and accent color that adapts the entire UI
- **Date Range Selector** — Click a start date and an end date; clear visual states distinguish the start, end, and in-between days. Hover preview shows the range before confirming
- **Integrated Notes** — Attach notes to any single date or date range; notes persist across sessions via localStorage
- **Holiday Markers** — Key holidays are marked with colored dots directly on the calendar grid; hover to see the holiday name
- **Page Flip Animation** — Smooth fade and tilt transition when navigating between months
- **Fully Responsive** — Desktop shows a side-by-side panel layout; mobile collapses to a clean stacked vertical layout

## Tech Stack

- **Next.js 14** (App Router)
- **React** (hooks only — useState, useEffect, useCallback)
- **Pure inline CSS** — no external UI library or CSS framework
- **localStorage** for note persistence — no backend required

## Getting Started

```bash
# Clone the repository
git clone https://github.com/Swastikraj599/wall-calender.git
cd wall-calender

# Install dependencies
npm install

# Run locally
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure
wall-calender/
├── app/
│   ├── page.js          # Entry point — renders the calendar
│   └── globals.css      # Global reset styles
├── components/
│   └── WallCalendar.jsx # Main calendar component (self-contained)
└── README.md

## Design Decisions

- **No external component libraries** — everything is built from scratch to demonstrate full control over layout, state, and styling
- **Monday-first grid** — matches the international wall calendar standard shown in the reference design
- **Unsplash photography** — royalty-free images loaded directly via URL, no asset bundling needed
- **localStorage over a backend** — the brief explicitly required frontend-only; localStorage gives genuine persistence without overengineering
- **Inline styles over CSS modules** — keeps the component fully self-contained and portable; drop `WallCalendar.jsx` into any React project and it works immediately
