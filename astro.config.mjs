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
import swup from '@swup/astro';
// https://astro.build/config
export default defineConfig({
	site: SITE_INFO.Site,
	build: { assets: 'vh_static' },
	prefetch: {
		prefetchAll: true,    // 用 Astro 官方的 prefetch 策略
		defaultStrategy: 'hover' // 或者用 'tap'，只有在移动端触摸或点击时才触发
	},
	integrations: [swup({
		theme: false,
		animationClass: "vh-animation-",
		containers: [".main-inner>.main-inner-content", '.vh-header>.main'],
		smoothScrolling: true,
        progress: false, // ❌ 改为 false，进度条就彻底消失了
		cache: true,
		preload: false, // 关掉悬停预下载
		accessibility: true,
		updateHead: true,
		updateBodyClass: false,
		globalInstance: true
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
