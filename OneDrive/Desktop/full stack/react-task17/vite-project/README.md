# Nightjar

Nightjar is a responsive sky-watching companion built with React. Browse a beginner-friendly field guide, check observing conditions for a location, plan a night, and keep a personal observation log.

## Run locally

```sh
npm install
npm run dev
```

Use `npm run build` to create a production build and `npm run lint` to run ESLint.

## Pages

- **Home** — tonight's highlights and a live local sky snapshot.
- **Sky guide** — filter and search celestial objects; each object opens a nested detail route.
- **Forecast** — look up a city and view current cloud cover, wind, and a stargazing score.
- **Logbook** — create, search, edit, and delete observations; entries persist in local storage.
- **My plans** — build an observing list that persists on the current device.
- **About** — app philosophy and stargazing FAQs.

Weather and city lookup use the public Open-Meteo forecast and geocoding APIs. The forecast needs an internet connection.

## React concepts demonstrated

Reusable components and props, React Router and nested routes, route parameters and search parameters, `useState`, `useEffect`, `useRef`, `useContext`, `useReducer`, Redux Toolkit, conditional and list rendering, a custom forecast hook, form validation, API integration, local persistence, and responsive CSS.
