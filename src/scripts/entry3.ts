import { TCanvas } from './three/TCanvas'
import { TCanvas2 } from './three/TCanvas2'
import gsap from 'gsap'

class App {
	private canvas: TCanvas
	private canvas2: TCanvas2

	constructor() {
		const parentNode = document.querySelector('.three-container-wrapper--01')!
		const parentNode2 = document.querySelector('.three-container-wrapper--02')!
		this.canvas = new TCanvas(parentNode)
		this.canvas2 = new TCanvas2(parentNode2)
		this.addEvents()
		gsap.set(parentNode2, {
			autoAlpha: 0,
			scale: 1.02
		})
		parentNode.addEventListener('click', () => {
			gsap.timeline()
			.to(parentNode2, {
				autoAlpha: 1,
				duration: 1,
				scale: 1,
				ease: 'power3.in',
			}, 'fade')
			.to(parentNode, {
				autoAlpha: 0,
				duration: 1,
				scale: 1.02,
				ease: 'power3.in',
			}, 'fade')
		})
		parentNode2.addEventListener('click', () => {
			gsap.timeline()
			.to(parentNode, {
				autoAlpha: 1,
				duration: 1,
				scale: 1,
				ease: 'power3.in',
			}, 'fade2')
			.to(parentNode2, {
				autoAlpha: 0,
				duration: 1,
				scale: 1.02,
				ease: 'power3.in',
			}, 'fade2')
		})
	}

	private addEvents = () => {
		window.addEventListener('beforeunload', () => {
			this.dispose()
		})
	}

	private dispose = () => {
		this.canvas.dispose()
		this.canvas2.dispose()
	}
}

new App()
