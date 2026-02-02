import path from "path";
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import Compress from "@playform/compress";
import Compressor from "astro-compressor";
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Markdown 配置================
import remarkMath from "remark-math";
import rehypeSlug from "rehype-slug";
import rehypeKatex from "rehype-katex";
import remarkDirective from "remark-directive";
import { remarkNote, addClassNames } from './src/plugins/markdown.custom'
// Markdown 配置================
import SITE_INFO from './src/config';

// 1. 删除或注释掉顶部的 import
// import swup from '@swup/astro';

// https://astro.build/config
export default defineConfig({
    site: SITE_INFO.Site,
    build: { assets: 'vh_static' },
    
    // 新增：开启 Astro 原生预取，这能解决你说的“等待感”
    prefetch: {
        prefetchAll: true,
        defaultStrategy: 'viewport' 
    },

    integrations: [
        // 2. 将原来的 swup({...}) 整个替换掉
        // 如果你现在不需要特别的集成逻辑，直接删掉那一大块即可
        
        Compress({ Image: false, Action: { Passed: async () => true } }),
        sitemap({
            serialize: (item) => ({ ...item, url: item.url.endsWith('/') ? item.url.slice(0, -1) : item.url })
        }),
        mdx({ extendMarkdownConfig: false }),
        Compressor({ gzip: false, brotli: true, fileExtensions: [".html", ".css", ".js"] })
    ],
    
    // 以下部分完全保持不动
    markdown: {
        remarkPlugins: [remarkMath, remarkDirective, remarkNote,],
        rehypePlugins: [[
            rehypeKatex, {
                output: 'mathml',
                trust: true,
                strict: false
            }
        ], rehypeSlug, addClassNames],
        syntaxHighlight: 'shiki',
        shikiConfig: { theme: 'github-light' },
    },
    vite: { resolve: { alias: { "@": path.resolve(__dirname, "./src") } } },
    server: { host: '0.0.0.0' }
});
