import { useEffect, useMemo, useRef, useState } from "react"
import { Canvas, extend, useFrame, type ThreeElement, type ThreeEvent } from "@react-three/fiber"
import { useGLTF, useTexture, Environment, Lightformer } from "@react-three/drei"
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
} from "@react-three/rapier"
import { MeshLineGeometry, MeshLineMaterial } from "meshline"

// replace with your own imports, see the usage snippet for details
import cardGLB from "./card.glb"
import lanyard from "./lanyard.png"

import * as THREE from "three"
import "./Lanyard.css"

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>
    meshLineMaterial: ThreeElement<typeof MeshLineMaterial>
  }
}

extend({ MeshLineGeometry, MeshLineMaterial })

// 1x1 transparent pixel — lets useTexture be called unconditionally when a
// front/back image isn't supplied.
const BLANK_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

// The card model's front face is UV-mapped to the LEFT half of the texture
// atlas and the back face to the RIGHT half (measured from card.glb). Each
// custom image is composited into its own half so the two faces render
// independently, aspect-preserving (no stretching).
const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 }
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 }

type ImageFit = "cover" | "contain"

interface LanyardProps {
  position?: [number, number, number]
  gravity?: [number, number, number]
  fov?: number
  transparent?: boolean
  frontImage?: string | null
  backImage?: string | null
  imageFit?: ImageFit
  lanyardImage?: string | null
  lanyardWidth?: number
  // While false, the whole rope+card chain is held fixed in its initial
  // (unsettled) pose instead of immediately falling under gravity — flip it
  // to true to let go, so it visibly drops/swings into its resting hang the
  // same way it does after a drag is released, rather than already being
  // settled the moment it becomes visible.
  dropTrigger?: boolean
}

// The container this component renders into is deliberately much taller than
// the card's resting frame — see Skills.tsx, which sizes and positions it so
// the extra height is mostly usable drag room below the card, and gives the
// card somewhere to go when dragged instead of being clipped by its own box
// edge. REFERENCE_HEIGHT is the container height (px) `position`'s z was
// originally tuned against; as the real container grows past that, camera
// distance is scaled up by the same ratio so the resting card keeps the
// exact same on-screen size instead of growing to fill the bigger box.
// (Vertical *position* is compensated separately, via CSS in Skills.tsx —
// R3F's default camera auto-aims at the world origin, which makes its own
// vertical position an unreliable lever for this: moving it re-pitches the
// whole view around that fixed origin rather than simply panning the frame.)
const REFERENCE_HEIGHT = 320

export default function Lanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  frontImage = null,
  backImage = null,
  imageFit = "cover",
  lanyardImage = null,
  lanyardWidth = 1,
  dropTrigger = true,
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 768)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [cameraZ, setCameraZ] = useState(position[2])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const observer = new ResizeObserver(([entry]) => {
      const height = entry.contentRect.height
      if (height > 0) setCameraZ(position[2] * (height / REFERENCE_HEIGHT))
    })
    observer.observe(wrapper)
    return () => observer.disconnect()
  }, [position])

  return (
    <div className="lanyard-wrapper" ref={wrapperRef}>
      <Canvas
        camera={{ position: [position[0], position[1], cameraZ], fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
        // The container now spans a much bigger area than the card's resting
        // frame (to give it room to be dragged), which would otherwise block
        // clicks/hovers on whatever sits underneath across that whole area.
        // Forward anything that doesn't actually hit the card to the real
        // element below it, so links like the tech-spiral cards still work.
        onPointerMissed={(event) => {
          const canvasEl = event.target as HTMLElement
          const previous = canvasEl.style.pointerEvents
          canvasEl.style.pointerEvents = "none"
          const under = document.elementFromPoint(event.clientX, event.clientY)
          canvasEl.style.pointerEvents = previous
          if (under) under.dispatchEvent(new MouseEvent(event.type, event))
        }}
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band
            isMobile={isMobile}
            frontImage={frontImage}
            backImage={backImage}
            imageFit={imageFit}
            lanyardImage={lanyardImage}
            lanyardWidth={lanyardWidth}
            dropTrigger={dropTrigger}
          />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  )
}

interface BandProps {
  maxSpeed?: number
  minSpeed?: number
  isMobile?: boolean
  frontImage?: string | null
  backImage?: string | null
  imageFit?: ImageFit
  lanyardImage?: string | null
  lanyardWidth?: number
  dropTrigger?: boolean
}

// The model ships without per-node/material types, so useGLTF's generic
// result is asserted into the exact shape card.glb actually has (see
// scripts used to generate it): three named nodes, two named materials.
interface CardGLTFResult {
  nodes: {
    card: THREE.Mesh
    clip: THREE.Mesh
    clamp: THREE.Mesh
  }
  materials: {
    base: THREE.MeshPhysicalMaterial
    metal: THREE.MeshStandardMaterial
  }
}

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  frontImage = null,
  backImage = null,
  imageFit = "cover",
  lanyardImage = null,
  lanyardWidth = 1,
  dropTrigger = true,
}: BandProps) {
  const band = useRef<THREE.Mesh<MeshLineGeometry>>(null!)
  const fixed = useRef<RapierRigidBody>(null!)
  const j1 = useRef<RapierRigidBody>(null!)
  const j2 = useRef<RapierRigidBody>(null!)
  const j3 = useRef<RapierRigidBody>(null!)
  const card = useRef<RapierRigidBody>(null!)
  const vec = new THREE.Vector3()
  const ang = new THREE.Vector3()
  const rot = new THREE.Vector3()
  const dir = new THREE.Vector3()
  // Held "kinematicPosition" (immovable, in the plain spread-out pose the
  // segments are authored at below) until dropTrigger flips true, at which
  // point they become "dynamic" and gravity takes over — the same
  // mechanism already used for drag release (see the card's own type
  // below), just applied to the whole chain instead of triggered by a
  // pointer event. "fixed" looks equivalent at rest but doesn't reliably
  // wake into a properly-simulated dynamic body on release — it left j1/j2
  // stuck at their frozen spots indefinitely while the rest of the chain
  // fell. "kinematicPosition" uses the same fixed→dynamic-on-release path
  // already proven to work for the card during drag.
  const restType: "dynamic" | "kinematicPosition" = dropTrigger ? "dynamic" : "kinematicPosition"
  const segmentProps = {
    type: restType,
    canSleep: true,
    colliders: false as const,
    angularDamping: 4,
    linearDamping: 4,
  }
  const { nodes, materials } = useGLTF(cardGLB) as unknown as CardGLTFResult
  const texture = useTexture(lanyardImage || lanyard)
  // useTexture must be called unconditionally; use a blank pixel when an image
  // isn't supplied for a given face, then skip compositing it below.
  const frontTex = useTexture(frontImage || BLANK_PIXEL)
  const backTex = useTexture(backImage || BLANK_PIXEL)

  // Composite the front/back images into the card's texture atlas (front = left
  // half, back = right half). Each image is drawn aspect-preserving (no stretch).
  const cardMap = useMemo(() => {
    // Non-null: the shipped card.glb's "base" material always carries its
    // own embedded texture (confirmed on the actual asset).
    const baseMap = materials.base.map!
    if (!frontImage && !backImage) return baseMap

    // three's Texture.image is generically typed (unknown by default); this
    // texture and frontTex/backTex below are always loaded from a 2D image
    // source, so this narrows it to what the canvas APIs actually need.
    type HTMLImageLike = CanvasImageSource & { width: number; height: number }
    const baseImg = baseMap.image as HTMLImageLike

    const W = baseImg.width
    const H = baseImg.height
    const canvas = document.createElement("canvas")
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext("2d")
    if (!ctx) return baseMap
    // Keep the original baked atlas for the card edges and any untouched face.
    ctx.drawImage(baseImg, 0, 0, W, H)

    const drawFitted = (img: HTMLImageLike, rect: typeof FRONT_UV_RECT) => {
      const rx = rect.x * W
      const ry = rect.y * H
      const rw = rect.w * W
      const rh = rect.h * H
      const pick = imageFit === "contain" ? Math.min : Math.max
      const scale = pick(rw / img.width, rh / img.height)
      const dw = img.width * scale
      const dh = img.height * scale
      const dx = rx + (rw - dw) / 2
      const dy = ry + (rh - dh) / 2
      ctx.save()
      ctx.beginPath()
      ctx.rect(rx, ry, rw, rh)
      ctx.clip()
      ctx.drawImage(img, dx, dy, dw, dh)
      ctx.restore()
    }

    const frontImg = frontTex.image as HTMLImageLike | undefined
    const backImg = backTex.image as HTMLImageLike | undefined
    if (frontImage && frontImg) drawFitted(frontImg, FRONT_UV_RECT)
    if (backImage && backImg) drawFitted(backImg, BACK_UV_RECT)

    const composite = new THREE.CanvasTexture(canvas)
    composite.colorSpace = THREE.SRGBColorSpace
    composite.flipY = baseMap.flipY
    composite.anisotropy = 16
    composite.needsUpdate = true
    return composite
  }, [frontImage, backImage, imageFit, frontTex, backTex, materials.base.map])
  const [curve] = useState(() => {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ])
    // Set once at construction rather than every render (mutating a value
    // returned from useState during render isn't allowed) — curveType never
    // changes again, so this is exactly equivalent to the original.
    c.curveType = "chordal"
    return c
  })
  const [dragged, drag] = useState<THREE.Vector3 | false>(false)
  const [hovered, hover] = useState(false)

  useRopeJoint(fixed, j1, [
    [0, 0, 0],
    [0, 0, 0],
    1,
  ])
  useRopeJoint(j1, j2, [
    [0, 0, 0],
    [0, 0, 0],
    1,
  ])
  useRopeJoint(j2, j3, [
    [0, 0, 0],
    [0, 0, 0],
    1,
  ])
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.5, 0],
  ])

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab"
      return () => void (document.body.style.cursor = "auto")
    }
  }, [hovered, dragged])

  // Switching a body's type from "fixed" to "dynamic" doesn't necessarily
  // wake it — same as the drag-start code below waking every ref before
  // moving the card, these need an explicit nudge or they can sit inert
  // (still "dynamic", just never actually simulated) instead of falling.
  useEffect(() => {
    if (!dropTrigger) return
    ;[j1, j2, j3, card].forEach((ref) => ref.current?.wakeUp())
  }, [dropTrigger])

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      dir.copy(vec).sub(state.camera.position).normalize()
      vec.add(dir.multiplyScalar(state.camera.position.length()))
      ;[card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp())
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      })
    }
    if (fixed.current) {
      type Lerped = RapierRigidBody & { lerped?: THREE.Vector3 }
      ;[j1, j2].forEach((ref) => {
        const body = ref.current as Lerped
        if (!body.lerped) body.lerped = new THREE.Vector3().copy(body.translation())
        const clampedDistance = Math.max(0.1, Math.min(1, body.lerped.distanceTo(body.translation())))
        body.lerped.lerp(body.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)))
      })
      curve.points[0].copy(j3.current.translation())
      curve.points[1].copy((j2.current as Lerped).lerped!)
      curve.points[2].copy((j1.current as Lerped).lerped!)
      curve.points[3].copy(fixed.current.translation())
      band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32))
      ang.copy(card.current.angvel())
      rot.copy(card.current.rotation() as unknown as THREE.Vector3)
      // wakeUp is a required arg in the installed rapier version (the
      // source component's version apparently had it optional) — true
      // matches the implicit default that version relied on.
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true)
    }
  })

  // react-hooks/immutability flags this even inside an effect — it treats
  // any mutation of any hook-returned value as suspect, with no carve-out
  // for imperative three.js object configuration (as opposed to React
  // state). Setting these after loading is the standard, necessary way to
  // configure a THREE.Texture; it's not React state, and nothing else
  // references this particular texture instance, so it's safe here.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    // The band is only a few screen pixels wide, so the GPU's default
    // mipmapped minification collapses most band textures down to one
    // blurred, averaged texel — confirmed by sampling actual rendered
    // pixels: a patterned image came out as a single flat near-white color,
    // not the pattern. minFilter alone doesn't stop this (the mip chain is
    // still what's sampled); generateMipmaps=false removes the mip chain so
    // there's nothing to average into, and needsUpdate=true is required for
    // that change to actually take effect after the texture's first upload.
    // There's some shimmer on fine detail while the band moves as a result,
    // worth it here since the point of a custom lanyardImage is to actually
    // be visible.
    texture.minFilter = THREE.LinearFilter
    texture.generateMipmaps = false
    texture.needsUpdate = true
  }, [texture])

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : restType}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: ThreeEvent<PointerEvent>) => {
              ;(e.target as Element).releasePointerCapture(e.pointerId)
              drag(false)
            }}
            onPointerDown={(e: ThreeEvent<PointerEvent>) => {
              ;(e.target as Element).setPointerCapture(e.pointerId)
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current!.translation())))
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardMap}
                map-anisotropy={16}
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          // MeshLineMaterial's constructor requires a `resolution` field
          // (TS-only requirement — the original plain-JS component never
          // passes constructor args here at all). This placeholder is
          // immediately overwritten by the `resolution` prop below, which
          // is the value that actually matters.
          args={[{ resolution: new THREE.Vector2(1, 1) }]}
          color="white"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap={1}
          map={texture}
          repeat={[-4, 1]}
          lineWidth={lanyardWidth}
        />
      </mesh>
    </>
  )
}
