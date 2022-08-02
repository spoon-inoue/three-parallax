import path from 'path'
import { defineConfig } from 'vite'
import glsl from 'vite-plugin-glsl'

export default defineConfig(({ mode }) => {
	console.log('⚓ ' + mode)
	return {
		root: './src',
		base: mode === 'development' ? '/' : '/three-parallax/',
		plugins: [glsl()],
		build: {
			rollupOptions: {
				input: {
					home: path.resolve(__dirname, './src/index.html'),
					scene01: path.resolve(__dirname, './src/01/index.html'),
					scene02: path.resolve(__dirname, './src/02/index.html'),
					scene03: path.resolve(__dirname, './src/03/index.html'),
					scene04: path.resolve(__dirname, './src/04/index.html')
				}
			},
			outDir: '../dist'
		}
	}
})
