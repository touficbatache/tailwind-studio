# Tailwind Studio

A visual page builder for Tailwind CSS. Add elements, nest them, style them with Tailwind classes, and export clean HTML.

Built with Next.js 15, React 19, Tailwind CSS v4 and shadcn/ui.

## Features

- **Elements:** container, text, button, image, link, list, input and select.
- **Layers panel:** see the element tree, drag to reorder or nest, delete.
- **Properties panel:** edit content, links, images and options, with Tailwind class suggestions as you type.
- **Live HTML output:** formatted, highlighted, one click to copy.
- **Import / export:** save or load a design as JSON, export it as HTML, or import existing HTML.
- Your work in progress is kept for the browser session.

## Run it

```sh
npm install
npm run dev
```

Then open http://localhost:3000.

## Project layout

- `elements/`: one definition file per element type, registered in `elements/index.ts`. Add a new element here.
- `editable-props/`: the editors shown in the properties panel.
- `context/builder-context.tsx`: the design state (add, move, delete, import, export).
- `components/`: canvas, sidebars, toolbar and HTML output.
- `data/tailwind-classes.ts`: the class list used for suggestions.

## License

MIT, see [LICENSE](LICENSE).
