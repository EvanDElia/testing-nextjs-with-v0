"use client"

import React from 'react'
import { Canvas, useLoader, useThree } from "@react-three/fiber"
import { OrbitControls, Stats } from "@react-three/drei"
import { TextureLoader, MeshStandardMaterial, EquirectangularReflectionMapping, Vector3 } from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { useControls } from 'leva'
import { filePicker } from "leva-file-picker"
import {
  useRef,
} from 'react'
import { SpeedInsights } from "@vercel/speed-insights/next"
import GradientButtons from './gradient-buttons'

function EnvironmentMap() {
  const { scene } = useThree()
  // const envMap = useLoader(TextureLoader, '/aitest.jfif')
  const hdrTexture = useLoader(RGBELoader, '/2k.hdr')

  const envMap = useControls({
    environmentIntensity: { value: 1, min: 0, max: 5, step: 0.1 },
    backgroundBlurriness: { value: 0.05, min: 0, max: 5, step: 0.01 },
    backgroundIntensity: { value: 1, min: 0, max: 5, step: 0.1 }
  })

  scene.environmentIntensity = envMap.environmentIntensity
  scene.backgroundBlurriness = envMap.backgroundBlurriness
  scene.backgroundIntensity = envMap.backgroundIntensity
  
  React.useEffect(() => {
    hdrTexture.mapping = EquirectangularReflectionMapping
    scene.background = hdrTexture
    scene.environment = hdrTexture
  }, [hdrTexture, scene])

  return null
}

function Plane() {
  const texture = useLoader(TextureLoader, '/aitest.jfif')
  const displacementMap = useLoader(TextureLoader, '/depth1.png')

  const materialRef = useRef<MeshStandardMaterial>(null)

  async function onChange(file: File) {
    if (!file || !file.type) return;
    const { type } = file
    const buffer = await file.arrayBuffer()
    const blob = new Blob([buffer], { type })
    const urlCreator = window.URL || window.webkitURL
    const imageUrl = urlCreator.createObjectURL(blob)

    const textureLoader = new TextureLoader()
    textureLoader.load(imageUrl, (t) => {
      if (!materialRef.current) return;
      materialRef.current.map = t
      materialRef.current.needsUpdate = true
    })
  }

  async function onChangeDisplacement(file: File) {
    if (!file || !file.type) return;
    const { type } = file
    const buffer = await file.arrayBuffer()
    const blob = new Blob([buffer], { type })
    const urlCreator = window.URL || window.webkitURL
    const imageUrl = urlCreator.createObjectURL(blob)

    const textureLoader = new TextureLoader()
      textureLoader.load(imageUrl, (t) => {
        if (!materialRef.current) return;
        materialRef.current.displacementMap = t
        materialRef.current.needsUpdate = true
      })
  }
  
  const accept = {
      "image/png": [".png"],
      "image/jpeg": [".jfif", ".jpg", ".jpeg"]
  };

  const material = useControls({
    wireframe: false,
    displacementScale: { value: 2.5, min: 0, max: 5, step: 0.1 },
    diffuse: filePicker({ onChange, accept }),
    displacement: filePicker({ onChange: onChangeDisplacement, accept }),
  })

  return (
    <mesh rotation={[0, 0, 0]}>
      <planeGeometry args={[10, 10, 128, 128]} />
      <meshStandardMaterial 
        map={texture} 
        displacementMap={displacementMap}
        displacementScale={material.displacementScale}
        ref={materialRef}
        wireframe={material.wireframe}
      />
    </mesh>
  )
}


export function ThreejsPlane() {

  const light = useControls({lightIntensity: { value: 7, min: 0, max: 50, step: 0.5 }})
  return (
    <div className="w-full h-screen" style={{
      position: 'absolute',
      top: 0,
      left:0
    }}>
      <Canvas camera={{ position: [0, 2, 9], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[2, 2, 2]} intensity={light.lightIntensity} color={'#f0f'} />
        <Plane />
        <EnvironmentMap />
        <OrbitControls target={new Vector3(0,-1,-1)}/>
      </Canvas>

      <Stats />
      <SpeedInsights />

      <GradientButtons />
    </div>
  )
}