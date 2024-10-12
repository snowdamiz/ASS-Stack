import { defineConfig } from 'astro/config'
import vue from '@astrojs/vue'
import tailwind from '@astrojs/tailwind'
import node from '@astrojs/node'

export default defineConfig({
	output: 'server',
	integrations: [
		vue(),
		tailwind()
	],
	adapter: node({
		mode: 'standalone'
	}),
	devToolbar: {
		enabled: false
	},
	experimental: {
		serverIslands: true,
	}
})


