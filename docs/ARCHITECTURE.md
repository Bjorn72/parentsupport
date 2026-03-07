# Support – Architecture

## Purpose

This project is a very simple static website designed to help non-technical users solve common problems on their iPhone and Mac.

The goal is to make it possible for someone with very little technical experience to follow short step-by-step guides and solve problems without needing passwords, logins, or complex navigation.

The website must be extremely easy to use on both:

- iPhone
- Mac
- Desktop computers

The site should work as a static website with no backend and be easy to deploy on platforms such as GitHub Pages, Netlify, or Cloudflare Pages.

---

# Language Rules

This project intentionally uses two languages.

## Architecture and Code

All of the following must be written in **English**:

- architecture documentation
- code comments
- variable names
- file names
- developer documentation

## User-Facing Content

All **actual guide content** that appears on the website must be written in **Swedish**, because the end users are Swedish speakers.

Examples of Swedish user content:

- "Öppna Inställningar"
- "Tryck på Wi-Fi"
- "Starta om telefonen"

In short:

Developer / system content → **English**  
User interface and guides → **Swedish**

---

# Core Design Principles

The website must follow these principles:

- Extremely simple navigation
- Very large touch targets
- Short guides
- Minimal text
- Clear visual hierarchy
- Mobile-first layout

Guides should ideally contain **no more than 3–5 steps**.

If a guide becomes too long, it should be split into multiple guides.

---

# Technical Architecture

The website must be implemented using only:

- HTML
- CSS
- Vanilla JavaScript

There should be:

- no backend
- no database
- no authentication
- no build pipeline

The site should work as a fully static project.

---

# Project Structure

Runtime website files live in the **repository root**.

Project documentation lives in **`/docs` only**.

Recommended file structure:

```text
/
    index.html
    styles.css
    app.js

    /assets
        /images
        /icons

    /guides

/docs
    ARCHITECTURE.md
    M01-basic-setup.md
    M02.md
    M03.md
    M04.md
    M05.md
    M06.md
    M07.md
    M08.md
```

Guides may be embedded directly in `index.html` and shown or hidden with JavaScript.

---

# Layout

## Desktop Layout

On desktop devices the site uses a two-column layout.

```text
+----------------------+---------------------------+
|                      |                           |
|      Sidebar         |        Content            |
|                      |                           |
|  Topics              |  Active guide             |
|  Quick access        |  Device toggle            |
|                      |  Guide content            |
|                      |                           |
+----------------------+---------------------------+
```

The sidebar remains visible at all times.

## Mobile Layout

On mobile devices the sidebar is replaced with a hamburger menu.

```text
+-----------------------------------+
| ☰   Hjälp för iPhone och Mac      |
+-----------------------------------+
|                                   |
|   Device toggle                   |
|   Guide content                   |
|                                   |
+-----------------------------------+
```

When the hamburger menu is opened, the user can choose a topic. When a topic is selected:

- the guide is displayed
- the mobile menu automatically closes

---

# Navigation Model

The preferred approach is a **single-page application style navigation** using JavaScript.

All guides exist in the page but are shown or hidden dynamically.

Example:

```js
showSection("wifi");
```

The site also supports a simple device filter:

- iPhone
- Mac

The selected device controls which device-specific blocks and topics should be visible.

Local browser storage may be used for simple preferences such as:

- selected device
- pinned topics

Advantages:

- faster interaction
- no page reloads
- easier navigation for non-technical users

---

# Start Page

The start page should work as a simple overview page.

It may include:

- a short intro
- quick access to common topics
- pinned topics
- a small disclaimer that the site is not affiliated with Apple

The start page should help the user reach common tasks without needing to scan the entire menu.

---

# Guide Format

Each guide should follow a very consistent format.

Example structure:

Title

```text
Wi-Fi fungerar inte
```

Steps

```text
1. Öppna Inställningar
2. Tryck på Wi-Fi
3. Välj ditt nätverk
```

Optional additions:

- short note
- image or screenshot
- device-specific variant for iPhone or Mac

Guides should always prioritize:

- clarity
- minimal steps
- strong visual cues

---

# Device-Specific Content

Some guides apply only to iPhone, some only to Mac, and some to both.

The UI should make this obvious.

Preferred behavior:

- iPhone-only topics should not be shown when Mac is selected
- Mac-only topics should not be shown when iPhone is selected
- shared topics may contain separate iPhone and Mac instruction blocks

Examples of shared topics:

- sound
- search
- contacts
- notes

---

# Accessibility Considerations

The target users may have limited technical ability and possibly reduced vision.

Recommended UI rules:

- large buttons
- large text
- high contrast
- lots of whitespace
- easy-to-scan labels
- simple icons next to topics

Suggested sizes:

```text
button min-height: 60px
font-size: 20px
```

---

# Icons

The interface may use small topic icons to make navigation easier to scan.

Recommended approach:

- simple inline SVG icons
- no external icon library required
- keep icons visually small and secondary to the text label

---

# Useful Features

Useful features for this project include:

- quick access to common topics
- pinned topics stored locally in the browser
- device toggle for iPhone and Mac
- optional direct links to iOS settings when supported

Example:

```text
App-Prefs:root=WIFI
```

Note: Support for direct iOS settings links may vary between iOS versions.

---

# Hosting

The project should be deployable on any static hosting platform.

Recommended options:

- GitHub Pages
- Netlify
- Cloudflare Pages

---

# Future Improvements

Possible future additions include:

- better topic grouping in navigation
- search function
- more screenshots and visual guides
- dark mode
- larger accessibility mode

---

# Core Principle

If something requires explanation, the guide is probably too complicated.

The goal is that a user should be able to solve a problem in **under 30 seconds**.
