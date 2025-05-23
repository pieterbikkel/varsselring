# Varsselring Nuxt Project

This is a Nuxt-based web application for the Varsselring project. It uses Vue 3, TypeScript, and Vuetify for UI components.

![Varsselring Application Screenshot](/applicatie.png)

## Features
- Nuxt 3 application structure
- Vuetify integration for Material Design UI
- Docker support for containerized deployment
- Mock data and static JSON files for development

## Project Structure
- `components/` — Vue components (e.g., HeaderBar)
- `pages/` — Nuxt pages (e.g., index, rijders, schema)
- `plugins/` — Nuxt plugins (e.g., Vuetify setup)
- `public/` — Static assets and JSON data
- `server/` — Server-side code (if any)
- `types.ts` — TypeScript types
- `riders.mock.ts` — Mock data for development

## Getting Started

### Prerequisites
- Node.js (v21 recommended)
- npm or yarn
- Docker (optional, for containerized deployment)

### Installation
```bash
npm install
# or
yarn install
```

### Development
```bash
npm run dev
# or
yarn dev
```
The app will be available at `http://localhost:3000` by default.

### Linting
```bash
npm run lint
```

### Building for Production
```bash
npm run build
npm run start
```

### Docker
To build and run the app with Docker:
```bash
docker buildx build --platform linux/amd64 -t varsselring-nuxt:latest .
docker save -o varsselring-nuxt-latest.tar varsselring-nuxt:latest
```
Or use `docker-compose`:
```bash
docker-compose up --build
```

Load image on server
```bash
docker load -i varsselring-nuxt-latest.tar
```

## Static Data
Static JSON files are located in the `public/` directory (e.g., `rijschema.json`, `deelnemers_hamove_2025.json`).

## License
MIT
