const config = {
  "*.{js,ts,jsx,tsx,mjs,cjs}": ["prettier --write", "eslint --fix"],
  "*.{json,css,md,yml,yaml}": ["prettier --write"],
};

export default config;
