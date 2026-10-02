// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';
import { satteri } from '@astrojs/markdown-satteri';
import { katex } from '@nullpinter/satteri-katex';


// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [mdx()],
   markdown: {
    processor: satteri({
      features: {
        math: true,
        rawHtml: true
      },
      mdastPlugins: [
        katex()
      ]
    })
  }
});