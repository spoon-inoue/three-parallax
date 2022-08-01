import { TCanvas2 } from './three/TCanvas2'
import { TCanvas2nightly } from './three/TCanvas2nightly'
import gsap from 'gsap'

class App {
	private canvas2: TCanvas2
	private canvas2nightly: TCanvas2nightly

	constructor() {
		const parentNode = document.querySelector('.three-container-wrapper--01')!
		const parentNode2 = document.querySelector('.three-container-wrapper--02')!
		this.canvas2 = new TCanvas2(parentNode2)
		this.canvas2nightly = new TCanvas2nightly(parentNode)
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
		this.canvas2.dispose()
		this.canvas2nightly.dispose()
	}
}

new App()
