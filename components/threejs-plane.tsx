"use client"

import React, {useState} from 'react'
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
import Image from "next/image";

let globalMaterialRef: any

const PresetFunction: any = (index: number) => {
  const materialRef = globalMaterialRef
  const texture = useLoader(TextureLoader, '/aitest.jfif')
  const displacementMap = useLoader(TextureLoader, '/depth1.png')

  const presetTexture2 = useLoader(TextureLoader, '/rainbowface.jfif')
  const presetDisplacement2 = useLoader(TextureLoader, '/rainbowfacedepthmap.jpg')

  const presetTexture3 = useLoader(TextureLoader, '/skullsstilllife.jfif')
  const presetDisplacement3 = useLoader(TextureLoader, '/skullsdepthmap.jpg')

  const presetTexture4 = useLoader(TextureLoader, '/cow.jfif')
  const presetDisplacement4 = useLoader(TextureLoader, '/cowdepthmap.jpg')

  if (materialRef && materialRef.current) {
    switch (index) {
      case 1:
        materialRef.current.map = texture
        materialRef.current.displacementMap = displacementMap
        materialRef.current.displacementScale = 2.5
        materialRef.current.needsUpdate = true
        break;
      case 2:
        materialRef.current.map = presetTexture2
        materialRef.current.displacementMap = presetDisplacement2
        materialRef.current.displacementScale = 2.6
        materialRef.current.needsUpdate = true
        break;
      case 3:
        materialRef.current.map = presetTexture3
        materialRef.current.displacementMap = presetDisplacement3
        materialRef.current.displacementScale = 2.5
        materialRef.current.needsUpdate = true
        break;
      case 4:
        materialRef.current.map = presetTexture4
        materialRef.current.displacementMap = presetDisplacement4
        materialRef.current.displacementScale = 0.2
        materialRef.current.needsUpdate = true
        break;
    }
  }
}

let time = 0

setInterval(() => {
  if (!globalMaterialRef?.current || !globalMaterialRef?.animate) {
    // clearInterval(animate)
    return
  }
  globalMaterialRef.current.displacementScale = (Math.sin(time) + 1.);
  time += 0.01
}, 24)

function EnvironmentMap() {
  const { scene } = useThree()
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

  // preload textures for the presets now

  const presetTexture2 = useLoader(TextureLoader, '/rainbowface.jfif')
  const presetDisplacement2 = useLoader(TextureLoader, '/rainbowfacedepthmap.jpg')

  const presetTexture3 = useLoader(TextureLoader, '/skullsstilllife.jfif')
  const presetDisplacement3 = useLoader(TextureLoader, '/skullsdepthmap.jpg')

  const presetTexture4 = useLoader(TextureLoader, '/cow.jfif')
  const presetDisplacement4 = useLoader(TextureLoader, '/cowdepthmap.jpg')

  console.log(presetTexture2, presetDisplacement2)
  console.log(presetTexture3, presetDisplacement3)
  console.log(presetTexture4, presetDisplacement4)
  console.log("Preset Textures Loaded")

  const materialRef = useRef<MeshStandardMaterial>(null)
  globalMaterialRef = materialRef

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
    animate: false
  })

  globalMaterialRef.animate = material.animate;

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

interface ModalProps {
  open: boolean
}

const Modal: React.FC<ModalProps> = ({open}) => {
  const ref = useRef<HTMLDivElement>(null)
  if (open && ref?.current) {
    ref.current.style.opacity = '1';
    (ref.current.children as HTMLCollectionOf<HTMLElement>)[0].style.pointerEvents = 'all'
  } else if (ref?.current) {
    ref.current.style.opacity = '0';
    (ref.current.children as HTMLCollectionOf<HTMLElement>)[0].style.pointerEvents = 'none'
  }
  return (
    <div ref={ref} className="absolute flex flex-col w-full h-screen justify-center items-center" style={{
      top: 0,
      margin: '0 auto',
      backdropFilter: 'blur(9px)',
      transition: 'opacity 0.2s ease-out',
      pointerEvents: 'none',
      opacity:'0'
    }}>
      <div style={{
        width: '500px',
        maxHeight: '100dvh',
        background: '#0C0C0C',
        borderRadius: '20px',
        padding: '24px',
        textAlign: 'justify',
        overflowY: 'auto',
        pointerEvents: 'none'
      }}>
        Click and drag to move the camera around the scene. You can also use a scroll wheel to zoom and right click to pan the camera. Use the gui at the top right to add your own image and depth map to be applied to the plane. You can also change the intensity of the environment map and the environment map blur. And check out the preset buttons to see ai generated images combined with their ai generated depth maps.<br /><br />
        To generate the images I used in the "presets", I played around with Dall-E and the Bing AI image generator. For the first prompt I tried to create something with a video game feel, and used key words such as "unreal engine 4K render scenic" I think the Bing AI is really good at this specific aesthetic. The second preset I used the prompt "hyper realistic human face painted with rainbow colors, close up nikon photo 4k". The third prompt was "Still life dark fantasy bright colors and fruits in the foreground" and finally for the fourth I wanted to do something I bit ridiculous: "a caravaggio oil painting of a cow being abducted by aliens. Realistic 4k render"
        <br /><br />To get the depth images I tried out a few different free online services such as Midas which is a google colab available for free. ZoeDepth and Artificial Studio are two free services that you can upload an image to and it will give you back a depth map. I settled on using Artifial Studio.
        <br /><br />You can check out the code and additional info on <a href="https://github.com/EvanDElia/testing-nextjs-with-v0/" target="_blank">Github</a> 
      </div>
    </div>
  )
}

export function ThreejsPlane() {
  const [openModal, setOpenModal] = useState(false)
  const light = useControls({lightIntensity: { value: 7, min: 0, max: 50, step: 0.5 }})
  return (
    <div className="w-full h-screen absolute" style={{
      top: 0,
      left: 0
    }}>
      <Canvas camera={{ position: [0, 2, 8], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[2, 2, 2]} intensity={light.lightIntensity} color={'#f0f'} />
        <Plane />
        <EnvironmentMap />
        <OrbitControls target={new Vector3(0,-1,-1)}/>
      </Canvas>

      <Stats />
      <SpeedInsights />

      <GradientButtons presets={PresetFunction}/>

      <Modal open={openModal}></Modal>
      <footer className="row-start-3 flex gap-6 flex-wrap items-end justify-end">
        <button
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          style={{
            paddingRight: '20px'
          }} 
          onClick = {() => {console.log('test'); setOpenModal(!openModal)}}
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/file.svg"
            alt="File icon"
            width={16}
            height={16}
            className="file-icon"
          />
          About
        </button>

      </footer>
    </div>
  )
}