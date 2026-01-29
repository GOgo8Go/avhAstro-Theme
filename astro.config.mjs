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
// 1. 删除 import swup from '@swup/astro';
// https://astro.build/config
export default defineConfig({
	site: SITE_INFO.Site,
	build: { assets: 'vh_static' },
	prefetch: {
        prefetchAll: true, // 开启全局预加载，让切换达到“瞬移”效果
        defaultStrategy: 'hover' // 鼠标悬停在链接上时就开始加载
    },
	integrations: [
	        // ❌ 这里原本的 swup({...}) 整个删掉
	        // ✅ 保留其他的插件，比如：
	        // icon(), 
	        // sitemap(),
	        // tailwind(),
	    ], // 注意保留这个方括号和逗号
	}),
	Compress({ Image: false, Action: { Passed: async () => true } }),
	sitemap({
		// 处理末尾带 / 的 url
		serialize: (item) => ({ ...item, url: item.url.endsWith('/') ? item.url.slice(0, -1) : item.url })
	}),
	mdx({ extendMarkdownConfig: false }),
	Compressor({ gzip: false, brotli: true, fileExtensions: [".html", ".css", ".js"] })
	],
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
