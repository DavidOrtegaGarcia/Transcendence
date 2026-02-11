# React + TypeScript + Vite + Tailwind + i18n

## Environtment install

### Node Instalation
```bash
nvm install 20
nvm use 20
```

### Docker Instalation
```bash
docker pull node:24-alpine
docker run -it --rm --entrypoint sh node:24-alpine
```
### Verify the Node.js version:
```bash
node -v
```
Should print "v24.12.0". or similar

### Verify the NPM version:
```bash
npm -v
```
Should print "11.6.2".


### FrameFork + Environtment install
React + Vite
```bash
cd E:\42_Cursus\Trascendence
npm create vite@latest frontend -- --template react-ts
cd frontend
```

Selected language: TypeScript.

Reason: TypeScript helps us prevent errors, document data, and keep code scalable. It avoids misplaced props, silent undefineds, and bugs you notice too late. The error appears while you're writing code, that is, at edit time, not at runtime or compilation time.

✔️ Errors are avoided if the backend changes something.
✔️ You're forced to rethink the data model.

Example:
An endpoint is changed in the backend, but the frontend continues using the old format:
In JavaScript:
💥 Runtime error

💥 You find out too late.
In TypeScript:
❌ Immediate error in VSCode.

✔️ You can fix it in minutes.
Furthermore, TypeScript is more professional and a standard for businesses. It allows for better management of large projects because they are more scalable.


### Tailwind Instalation
```bash
npm install tailwindcss @tailwindcss/vite
```

Change vite.config.ts file, should be:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
})
```

Add at the begining of src/index.css:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### i18n Sistem Instalation
```bash
npm install i18next react-i18next
```

### More Info About React + Vite
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
