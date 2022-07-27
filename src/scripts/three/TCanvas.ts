import * as THREE from 'three'
import { publicPath } from '../utils'
import { Assets, ExOrthographicCamera, TCanvasBase } from './TCanvasBase'

export class TCanvas extends TCanvasBase {
	private assets: Assets = {
		butterflies: { path: publicPath('/assets/butterflies.png'), encoding: true },
		flowers: { path: publicPath('/assets/flowers.png'), encoding: true },
		forest: { path: publicPath('/assets/forest.png'), encoding: true },
		grass: { path: publicPath('/assets/grass.png'), encoding: true },
		house3: { path: publicPath('/assets/house3.png'), encoding: true },
		logo: { path: publicPath('/assets/logo.png'), encoding: true },
		moutain: { path: publicPath('/assets/moutain.png'), encoding: true },
		sky: { path: publicPath('/assets/sky.png'), encoding: true },
		tree: { path: publicPath('/assets/tree.png'), encoding: true }
	}

	private imageGroup = new THREE.Group()
	private target = new THREE.Vector2()

	private datas = {
		moveScaleX: 10,
		moveScaleY: 5
	}

	constructor(parentNode: ParentNode) {
		super(parentNode)

		this.loadAssets(this.assets).then(() => {
			this.setScene()
			this.setModel()
			this.addEvent()
			this.animate(this.update)
		})
	}

	private setScene = () => {
		this.camera = new ExOrthographicCamera(1, 0, 10, this.size.aspect)
		this.camera.position.z = 1
		this.scene.background = new THREE.Color('#500')

		const folder = this.gui.addFolder('move scale')
		folder.add(this.datas, 'moveScaleX', 0, 10, 0.1).name('x')
		folder.add(this.datas, 'moveScaleY', 0, 10, 0.1).name('y')
	}

	private setModel = () => {
		const textures = {
			butterflies: this.assets.butterflies.data as THREE.Texture,
			flowers: this.assets.flowers.data as THREE.Texture,
			forest: this.assets.forest.data as THREE.Texture,
			grass: this.assets.grass.data as THREE.Texture,
			house3: this.assets.house3.data as THREE.Texture,
			logo: this.assets.logo.data as THREE.Texture,
			moutain: this.assets.moutain.data as THREE.Texture,
			sky: this.assets.sky.data as THREE.Texture,
			tree: this.assets.tree.data as THREE.Texture
		}

		const createMesh = (texture: THREE.Texture, scale = 1) => {
			const aspect = texture.image.width / texture.image.height
			const geometry = new THREE.PlaneGeometry(aspect * scale, scale)
			const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true })
			return new THREE.Mesh(geometry, material)
		}

		const sky = createMesh(textures.sky, 1)
		sky.position.set(0, 0.45, 0)
		this.imageGroup.add(sky)

		const moutain = createMesh(textures.moutain, 0.32)
		moutain.position.set(0, 0, 0.001)
		this.imageGroup.add(moutain)

		const forest = createMesh(textures.forest, 0.14)
		forest.position.set(0, -0.08, 0.002)
		this.imageGroup.add(forest)

		const grass = createMesh(textures.grass, 0.5)
		grass.position.set(-0.05, -0.32, 0.003)
		this.imageGroup.add(grass)

		const tree = createMesh(textures.tree, 0.6)
		tree.position.set(0.13, -0.09, 0.004)
		this.imageGroup.add(tree)

		const house3 = createMesh(textures.house3, 0.8)
		house3.position.set(0.45, -0.1, 0.005)
		this.imageGroup.add(house3)

		const flowers = createMesh(textures.flowers, 0.6)
		flowers.position.set(0, -0.4, 0.006)
		this.imageGroup.add(flowers)

		const butterflies = createMesh(textures.butterflies, 0.2)
		butterflies.position.set(0.45, -0.4, 0.007)
		this.imageGroup.add(butterflies)

		this.imageGroup.scale.multiplyScalar(2)

		this.imageGroup.children.forEach((child) => {
			child.userData.position = child.position.clone()
		})

		this.scene.add(this.imageGroup)
	}

	private addEvent = () => {
		window.addEventListener('mousemove', this.handleMousemove)
	}

	private handleMousemove = (e: MouseEvent) => {
		const { width, height } = this.size
		const x = (e.clientX / width) * 2 - 1
		const y = -(e.clientY / height) * 2 + 1

		this.target.set(x, y)
	}

	private update = () => {
		this.imageGroup.children.forEach((child) => {
			const pos = child.userData.position as THREE.Vector3
			let x = pos.x + this.target.x * pos.z * this.datas.moveScaleX
			let y = pos.y + this.target.y * pos.z * this.datas.moveScaleY
			x = THREE.MathUtils.lerp(child.position.x, x, 0.1)
			y = THREE.MathUtils.lerp(child.position.y, y, 0.1)

			child.position.set(x, y, child.position.z)
		})
	}
}
