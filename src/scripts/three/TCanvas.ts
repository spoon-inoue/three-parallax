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
		moutain: { path: publicPath('/assets/moutain.png'), encoding: true },
		sky: { path: publicPath('/assets/sky.png'), encoding: true },
		tree: { path: publicPath('/assets/tree.png'), encoding: true },
		smoke: { path: publicPath('/assets/smoke.webm') },
		moveButterflies: { path: publicPath('/assets/butterflies.webm'), encoding: true }
	}

	private imageGroup = new THREE.Group()
	private target = new THREE.Vector2()

	private datas = {
		moveScaleX: 0.42,
		moveScaleY: 0.27
	}

	constructor(parentNode: ParentNode) {
		super(parentNode)

		this.loadAssets(this.assets).then(() => {
			this.setScene()
			this.createModel()
			this.addEvent()
			this.animate(this.update)
			// this.animate()
		})
	}

	private setScene = () => {
		this.camera = new ExOrthographicCamera(1, 0, 10, this.size.aspect)
		this.camera.position.z = 1
		this.scene.background = new THREE.Color('#500')

		const folder = this.gui.addFolder('all move scale')
		folder.add(this.datas, 'moveScaleX', 0, 1, 0.01).name('x')
		folder.add(this.datas, 'moveScaleY', 0, 1, 0.01).name('y')

		this.gui.open(false)
	}

	private createModel = () => {
		const createMesh = (name: string, scale = 1) => {
			const texture = this.assets[name].data as THREE.Texture
			const geometry = new THREE.PlaneGeometry(texture.userData.aspect * scale, scale)
			const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true })
			const mesh = new THREE.Mesh(geometry, material)
			mesh.name = name
			return mesh
		}

		const setMesh = (
			mesh: THREE.Mesh,
			position: { x: number; y: number; z: number },
			moveScale: { mx: number; my: number }
		) => {
			mesh.position.set(position.x, position.y, position.z)
			mesh.userData.position = mesh.position.clone()
			mesh.userData.moveScale = { x: moveScale.mx, y: moveScale.my }
			this.imageGroup.add(mesh)

			const folder = this.gui.addFolder(mesh.name).open(false)
			folder.add(mesh.userData.moveScale, 'x', 0, 0.1, 0.001).name('move scale x')
			folder.add(mesh.userData.moveScale, 'y', 0, 0.1, 0.001).name('move scale y')
		}

		const createVideoMesh = (name: string, scale = 1) => {
			const texture = this.assets[name].data as THREE.VideoTexture
			const geometry = new THREE.PlaneGeometry(texture.userData.aspect * scale, scale)
			const material = new THREE.MeshBasicMaterial({ map: texture, alphaMap: texture, transparent: true })
			const mesh = new THREE.Mesh(geometry, material)
			mesh.name = name
			return mesh
		}

		const sky = createMesh('sky', 1)
		setMesh(sky, { x: 0, y: 0.45, z: 0 }, { mx: 0.009, my: 0 })

		const moutain = createMesh('moutain', 0.32)
		setMesh(moutain, { x: 0, y: 0, z: 0.001 }, { mx: 0.01, my: 0 })

		const forest = createMesh('forest', 0.14)
		setMesh(forest, { x: 0, y: -0.08, z: 0.002 }, { mx: 0.008, my: 0 })

		const grass = createMesh('grass', 0.5)
		setMesh(grass, { x: -0.05, y: -0.32, z: 0.003 }, { mx: 0.008, my: 0.003 })

		const tree = createMesh('tree', 0.6)
		setMesh(tree, { x: 0.13, y: -0.09, z: 0.004 }, { mx: 0.012, my: 0 })

		const house3 = createMesh('house3', 0.8)
		setMesh(house3, { x: 0.45, y: -0.1, z: 0.005 }, { mx: 0.009, my: 0 })

		const flowers = createMesh('flowers', 0.65)
		setMesh(flowers, { x: 0, y: -0.35, z: 0.006 }, { mx: 0.1, my: 0.067 })

		const butterflies = createMesh('butterflies', 0.2)
		setMesh(butterflies, { x: 0.45, y: -0.4, z: 0.007 }, { mx: 0.071, my: 0.036 })

		const smoke = createVideoMesh('smoke', 0.7)
		smoke.position.set(0.158, 0.725, 0)
		house3.add(smoke)

		const moveButterflies = createVideoMesh('moveButterflies', 0.8)
		moveButterflies.position.set(0, -0.05, 0)
		flowers.add(moveButterflies)

		this.imageGroup.scale.multiplyScalar(2)

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
			const moveScale = child.userData.moveScale

			let x = pos.x - this.target.x * moveScale.x * this.datas.moveScaleX
			let y = pos.y + this.target.y * moveScale.y * this.datas.moveScaleY

			child.position.x = THREE.MathUtils.lerp(child.position.x, x, 0.1)
			child.position.y = THREE.MathUtils.lerp(child.position.y, y, 0.1)
		})
	}
}
