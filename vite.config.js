import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const page = (name) => fileURLToPath(new URL(`./${name}.html`, import.meta.url));

export default defineConfig({
  build: {
    rolldownOptions: {
      input: {
        home: page('index'),
        collection: page('collection'),
        heritage: page('heritage'),
        craftsmanship: page('craftsmanship'),
        journal: page('journal'),
        boutiques: page('boutiques'),
        materials: page('materials'),
        care: page('care'),
      },
    },
  },
});
