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
	integrations: [swup({
		theme: false,
		animationClass: "vh-animation-",
		containers: [".main-inner>.main-inner-content", '.vh-header>.main'],
		// smoothScrolling: true,       已经在 CSS 里实现了原生的，JS 的平滑滚动只会浪费性能）。
		animateHistoryBrowsing: true,    // 让前进后退也带动画
        progress: true,  
		cache: true,

		preload: {
	      hover: true,           // 保留 hover 预载（大多数人想要的）
		  visible: true,      // 视口内自动预载（可选，关掉可进一步省流量）
	    },
		
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
