# SVOVA

A proof of concept to bring niceties from Laravel, particularly Laravel Nova, to the Svelte world.

## Features

- generate CRUD forms from chainable typescript definitions e.g. `createTextField(`email`, `Email Address`).max(100).isRequired()`
- generated table view
- user actions from simple typescript definitions get added automatically to CRUD and table views.

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```
