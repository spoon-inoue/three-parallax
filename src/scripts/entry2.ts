import { TCanvas2 } from './three/TCanvas2'

class App {
	private canvas: TCanvas2

	constructor() {
		const parentNode = document.querySelector('body')!
		this.canvas = new TCanvas2(parentNode)
		this.addEvents()
	}

	private addEvents = () => {
		window.addEventListener('beforeunload', () => {
			this.dispose()
		})
	}

	private dispose = () => {
		this.canvas.dispose()
	}
}

new App()
