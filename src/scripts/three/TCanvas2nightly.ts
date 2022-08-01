import * as THREE from 'three'
import { publicPath } from '../utils'
import { Assets, ExOrthographicCamera, TCanvasBase } from './TCanvasBase'
// import swayVert from './shader/swayVert.glsl'
// import swayFrag from './shader/swayFrag.glsl'

export class TCanvas2nightly extends TCanvasBase {
	private assets: Assets = {
		// butterflies: { path: publicPath('/assets/butterflies.png'), encoding: true },
		// flowers: { path: publicPath('/assets/flowers.png') },
		forest: { path: publicPath('/assets/nightly/forest.png'), encoding: true },
		grass: { path: publicPath('/assets/nightly/grass.png'), encoding: true },
		house3: { path: publicPath('/assets/nightly/02/house3.png'), encoding: true },
		// mountain: { path: publicPath('/assets/mountain.png'), encoding: true },
		// tree: { path: publicPath('/assets/tree.png'), encoding: true },
		// sky
		sky: { path: publicPath('/assets/nightly/sky.jpg'), encoding: true },
		// additional assets via 02
		forest2: { path: publicPath('/assets/nightly/02/forest.png'), encoding: true },
		grass2: { path: publicPath('/assets/nightly/02/grass_02.png'), encoding: true },
		// man: { path: publicPath('/assets/02/man.png'), encoding: true },
		trees: { path: publicPath('/assets/nightly/02/trees.png'), encoding: true },
		// movie
		smoke: { path: publicPath('/assets/smoke.webm') },
		// moveButterflies: { path: publicPath('/assets/butterflies.webm'), encoding: true },
		firefly: { path: publicPath('/assets/nightly/02/firefly.webm'), encoding: true },
		stars: { path: publicPath('/assets/nightly/02/stars.webm'), encoding: true }
	}

	private imageGroup = new THREE.Group()
	private target = new THREE.Vector2()
	// private movingForest2Material?: THREE.ShaderMaterials
	private cloudMeshes: THREE.Mesh[] = []
	private skyWidth = 0

	private datas = {
		moveScaleX: 0.42,
		moveScaleY: 0.27,
		cloudSpeed: 0.007
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
		this.camera.position.z = 10
		this.scene.background = new THREE.Color('#500')

		const folder = this.gui.addFolder('all move scale')
		folder.add(this.datas, 'moveScaleX', 0, 1, 0.01).name('x')
		folder.add(this.datas, 'moveScaleY', 0, 1, 0.01).name('y')

		this.gui.open(false)
	}

	private createModel = () => {
		const createMesh = (name: string, scale = 1, useAlphaMap = false) => {
			const texture = this.assets[name].data as THREE.Texture
			const geometry = new THREE.PlaneGeometry(texture.userData.aspect * scale, scale)
			const material = new THREE.MeshBasicMaterial({
				map: texture,
				alphaMap: useAlphaMap ? texture : undefined,
				transparent: true
			})
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

		// const setCloudMesh = (mesh: THREE.Mesh, position: [number, number, number], speed: number) => {
		// 	mesh.position.set(position[0], position[1], position[2])
		// 	mesh.userData.position = mesh.position.clone()
		// 	mesh.userData.speed = speed
		// 	this.cloudMeshes.push(mesh)

		// 	const folder = this.gui.folders.find((v) => v._title === 'cloud')
		// 	folder && folder.add(mesh.userData, 'speed', 0, 1, 0.01).name(mesh.name)
		// }

		const createVideoMesh = (name: string, scale = 1, opacityValue = 1) => {
			const texture = this.assets[name].data as THREE.VideoTexture
			const geometry = new THREE.PlaneGeometry(texture.userData.aspect * scale, scale)
			const material = new THREE.MeshBasicMaterial({ map: texture, alphaMap: texture, transparent: true, opacity: opacityValue })
			const mesh = new THREE.Mesh(geometry, material)
			mesh.name = name
			return mesh
		}

		// const createSwayMesh = (name: string, scale = 1) => {
		// 	const texture = this.assets[name].data as THREE.Texture
		// 	const geometry = new THREE.PlaneGeometry(texture.userData.aspect * scale, scale, texture.userData.aspect * 50, 50)
		// 	const material = new THREE.ShaderMaterial({
		// 		uniforms: {
		// 			u_texture: { value: texture },
		// 			u_time: { value: 0 }
		// 		},
		// 		vertexShader: swayVert,
		// 		fragmentShader: swayFrag,
		// 		transparent: true
		// 		// wireframe: true
		// 	})
		// 	const mesh = new THREE.Mesh(geometry, material)
		// 	mesh.name = name
		// 	return mesh
		// }

		const sky = createMesh('sky', 1)
		setMesh(sky, { x: 0, y: 0, z: 0 }, { mx: 0.009, my: 0 })
		this.skyWidth = sky.geometry.parameters.width

		// const mountain = createMesh('mountain', 0.32)
		// setMesh(mountain, { x: 0, y: 0, z: 0.1 }, { mx: 0.01, my: 0 })

		const forest = createMesh('forest', 0.14)
		setMesh(forest, { x: 0, y: -0.08, z: 0.2 }, { mx: 0.01, my: 0 })

		const forest2 = createMesh('forest2', 1.3)
		setMesh(forest2, { x: 0, y: 0.05, z: 0.32 }, { mx: 0.0075, my: 0 })

		// const movingForest2 = createSwayMesh('forest2', 1.3)
		// setMesh(movingForest2, { x: 0, y: 0.05, z: 0.31 }, { mx: 0.0075, my: 0 })
		// this.movingForest2Material = movingForest2.material

		const grass = createMesh('grass', 0.45)
		setMesh(grass, { x: -0.05, y: -0.32, z: 0.3 }, { mx: 0.006, my: 0.003 })

		const grass2 = createMesh('grass2', 0.4)
		setMesh(grass2, { x: 0.35, y: -0.42, z: 0.31 }, { mx: 0.008, my: 0.003 })

		// const tree = createMesh('tree', 0.6)
		// setMesh(tree, { x: 0.13, y: -0.09, z: 0.4 }, { mx: 0.007, my: 0 })

		const trees = createMesh('trees', 1.2)
		setMesh(trees, { x: 0.13, y: -0.09, z: 1.4 }, { mx: 0.01, my: 0.01 })

		const house3 = createMesh('house3', 0.7)
		setMesh(house3, { x: 0.4, y: -0.1, z: 0.7 }, { mx: 0.007, my: 0 })

		// const man = createMesh('man', 0.22)
		// setMesh(man, { x: 0.2, y: -0.25, z: 0.65 }, { mx: 0.005, my: 0 })

		// const flowers = createSwayMesh('flowers', 0.65)
		// setMesh(flowers, { x: 0, y: -0.45, z: 0.6 }, { mx: 0.01, my: 0.067 })
		// this.flowersMaterial = flowers.material

		// const butterflies = createMesh('butterflies', 0.2)
		// setMesh(butterflies, { x: 0.45, y: -0.4, z: 0.7 }, { mx: 0.071, my: 0.036 })

		// movie
		const smoke = createVideoMesh('smoke', 0.5, 0.3)
		smoke.position.set(0.155, 0.585, 0.01)
		house3.add(smoke)

		const stars = createVideoMesh('stars', 1)
		const stars2 = createVideoMesh('stars', 0.68)
		stars.position.set(0, 0.75, 0.1)
		stars2.position.set(-0.8, 0.7, 0.1)
		sky.add(stars, stars2)

		// const moveButterflies = createVideoMesh('moveButterflies', 0.25)
		// moveButterflies.position.set(-0.1, -0.2, 0.01)
		// house3.add(moveButterflies)

		const firefly = createVideoMesh('firefly', 0.3)
		const firefly2 = createVideoMesh('firefly', 0.4)
		const firefly3 = createVideoMesh('firefly', 0.2)
		firefly.position.set(0, -0.2, 0.1)
		firefly2.position.set(-0.5, -0.2, 0.1)
		firefly3.position.set(-1, -0.2, 0.1)
		house3.add(firefly, firefly2, firefly3)

		// clouds
		// const folder = this.gui.addFolder('cloud').open(false)
		// folder.add(this.datas, 'cloudSpeed', 0, 0.1, 0.001).name('all speed')

		// const cloud1 = createMesh('cloud1', 0.2)
		// setCloudMesh(cloud1, [-1, -0.15, 0.06], 6 / 6)
		// sky.add(cloud1)

		// const cloud2 = createMesh('cloud2', 0.3)
		// setCloudMesh(cloud2, [0.8, -0.2, 0.05], 5 / 6)
		// sky.add(cloud2)

		// const cloud3 = createMesh('cloud3', 0.3)
		// setCloudMesh(cloud3, [0.9, -0.18, 0.04], 4 / 6)
		// sky.add(cloud3)

		// const cloud4 = createMesh('cloud4', 0.25)
		// setCloudMesh(cloud4, [0.5, 0, 0.03], 3 / 6)
		// sky.add(cloud4)

		// const cloud5 = createMesh('cloud5', 0.35)
		// setCloudMesh(cloud5, [-0.6, -0.05, 0.02], 2 / 6)
		// sky.add(cloud5)

		// const cloud6 = createMesh('cloud6', 0.4)
		// setCloudMesh(cloud6, [-0.55, -0.35, 0.01], 1 / 6)
		// sky.add(cloud6)

		// const test = createMesh('test', 1, true)
		// setMesh(test, { x: 0, y: 0, z: 2 }, { mx: 0.008, my: 0 })

		// const test3 = createMesh('test3', 1)
		// setMesh(test3, { x: 0, y: 0, z: 2 }, { mx: 0.008, my: 0 })

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
		const dt = this.clock.getDelta()

		// parallax
		this.imageGroup.children.forEach((child) => {
			const pos = child.userData.position as THREE.Vector3
			const moveScale = child.userData.moveScale

			let x = pos.x - this.target.x * moveScale.x * this.datas.moveScaleX
			let y = pos.y + this.target.y * moveScale.y * this.datas.moveScaleY

			child.position.x = THREE.MathUtils.lerp(child.position.x, x, 0.1)
			child.position.y = THREE.MathUtils.lerp(child.position.y, y, 0.1)
		})
		// forest sway
		// this.movingForest2Material!.uniforms.u_time.value += dt

		// clouds
		this.cloudMeshes.forEach((cloud) => {
			cloud.position.x += dt * cloud.userData.speed * this.datas.cloudSpeed
			const halfWidth = (cloud.geometry as THREE.PlaneGeometry).parameters.width / 2

			if (this.skyWidth / 2 < cloud.position.x - halfWidth) {
				cloud.position.x = -(this.skyWidth / 2 + halfWidth)
			}
		})
	}
}
