# React / TS / Redux toolkit (a.k.a RTK) / React Router Todo front-end app

This document explains in detail how the Todo app front end was structured

## Setup

In this section we will describe the project setup and dependencies

### ESLint and Prettier

Before diving into development, it's important to set up ESLint and Prettier. This setup will provide long-term benefits by enforcing consistency and preventing common mistakes.

- ESLint helps catch potential issues early, such as missing dependencies in `useEffect` through rules like exhaustive-deps and much more.

- Prettier automatically formats your code whenever you save (e.g., using `Ctrl+S` in your IDE), making development smoother and more efficient.

For this to work you need to install the following *dev dependencies:*

```bash
npm i -D @eslint/js @types/eslint__js @typescript-eslint/eslint-plugin@typescript-eslint/parser eslint eslint-config-prettier eslint-plugin-jsx-a11y eslint-plugin-prettier eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh prettier typescript-eslint
```

For VS Code: make sure you have ESLint and Prettier plugins installed, as well as enabling these settings:

```json
"editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
},
"eslint.format.enable": true,
"editor.formatOnPaste": true
```

You also need a `.prettierrc` and a `eslint.config.js` files.


### Redux toolkit (RTK)

We’ll use Redux Toolkit (RTK) for data querying and caching. RTK is the modern, recommended approach to using Redux, offering a simplified and more efficient developer experience.

**Note**: For such a simple app, you don't really need RTK, but this is a great opportunity to demonstrate its capabilities and highlight real-world use cases.

Let's install the required dependencies

```bash
npm i @reduxjs/toolkit react-redux qs axios
npm i --save-dev @types/qs
```

The first two are RTK related.

[qs](https://www.npmjs.com/package/qs) is a querystring parsing and stringifying library. `@types/qs` provides TS bindings.

[axios](https://github.com/axios/axios) is a feature-rich HTTP client that is commonly used with RTK.

The setup requires 3 main parts

1. `utils/makeApi.ts` This is where we configure `qs`, `axios`, as well as the success and error response objects

2. `utils/store.ts` Basic store setup

3. `store/todos/api.ts` Is the api endpoints definitions