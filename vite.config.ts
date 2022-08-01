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
					home01: path.resolve(__dirname, './src/01/index.html'),
					home02: path.resolve(__dirname, './src/02/index.html'),
					home03: path.resolve(__dirname, './src/03/index.html'),
					home04: path.resolve(__dirname, './src/04/index.html')
				}
			},
			outDir: '../dist'
		}
	}
})
