# Logic Pro Academy

Learn Logic Pro by finishing music—not by memorizing a manual.

[**Open the live academy →**](https://ganowacek.github.io/logic-pro-academy/)

Logic Pro Academy is an interactive, project-based learning experience for complete beginners. The curriculum guides learners through building an original emotional electronic track while introducing the practical parts of Logic Pro along the way.

> This is an independent educational project. It is not affiliated with, endorsed by, or sponsored by Apple or any artist. Logic Pro is a trademark of Apple Inc. The curriculum teaches general production techniques and does not reproduce copyrighted recordings.

## What works today

- A polished nine-module curriculum roadmap
- An interactive, Logic-inspired transport lesson
- A playable 16-step browser drum sequencer
- Persistent XP, lesson completion, and track progress
- A real-DAW practice checklist that bridges the simulator to Logic Pro
- Responsive layouts for desktop, tablet, and mobile
- Static deployment through GitHub Pages

The current release is a focused MVP. It demonstrates the complete learning loop with one guided lesson and one production lab; the remaining curriculum cards describe the planned path.

## Learning path

1. Getting comfortable in Logic
2. First sounds
3. Beat making
4. Emotional sampling
5. Chords and emotion
6. Building energy
7. Arrangement
8. Mixing
9. Export and sharing

Every stage contributes to the learner's persistent project: **My First Life Track**.

## Run locally

Requirements: Node.js 20 or newer and npm.

```bash
git clone https://github.com/ganowacek/logic-pro-academy.git
cd logic-pro-academy
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validate a change

```bash
npm run typecheck
npm run build
```

The production build is a static export written to `out/`. Browser progress is saved locally with Zustand persistence; no account or backend is required.

## Stack

- Next.js and TypeScript
- React
- Framer Motion
- Zustand
- Web Audio API
- Lucide icons

## Project structure

```text
app/
  globals.css    Visual system and responsive layouts
  layout.tsx     Metadata and application shell
  page.tsx       Roadmap, lesson simulator, and production lab
lib/
  store.ts       Persistent learner progress
.github/
  workflows/     GitHub Pages deployment
```

## Contributing

Ideas, lesson improvements, accessibility fixes, and new production exercises are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## License

Released under the [MIT License](LICENSE).
