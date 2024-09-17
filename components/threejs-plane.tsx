"use client"

import { Canvas, useLoader } from "@react-three/fiber"
import { OrbitControls, Plane } from "@react-three/drei"
import { TextureLoader, MeshStandardMaterial } from 'three'
import { useControls } from 'leva'
import { filePicker } from "leva-file-picker"
import {
  useRef,
} from 'react'
import { SpeedInsights } from "@vercel/speed-insights/next"


export function ThreejsPlane() {

  const displacementMap = useLoader(TextureLoader, '/depth1.png');
  const diffuseMap = useLoader(TextureLoader, '/aitest.jfif');

  const materialRef = useRef<MeshStandardMaterial>()

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
    displacementScale: { value: 1, min: 0, max: 5, step: 0.1 },
    diffuse: filePicker({ onChange, accept }),
    displacement: filePicker({ onChange: onChangeDisplacement, accept })
  })

  return (
    <div className="w-full h-screen" style={{
      position: 'absolute',
      top: 0,
      left:0
    }}>
      <Canvas camera={{ position: [0, 2, 9], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[2, 2, 2]} intensity={6.5} />
        
        <Plane args={[10, 10, 100, 100]}>
          <meshStandardMaterial
            ref={materialRef}
            wireframe={material.wireframe}
            displacementMap={displacementMap}
            displacementScale={material.displacementScale}
            map={diffuseMap}
            color="#8c8c8c" />
        </Plane>
        
        <OrbitControls/>
      </Canvas>
      <SpeedInsights />
    </div>
  )
}