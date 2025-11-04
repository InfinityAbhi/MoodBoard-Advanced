import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import './Background3D.css'

function FloatingParticles({ count = 2000 }) {
  const ref = useRef()
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10
    }
    return positions
  }, [count])

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10
      ref.current.rotation.y -= delta / 15
    }
  })

  return (
    <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#667eea"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  )
}

const Background3D = () => {
  return (
    <div className="background-3d">
      <Canvas camera={{ position: [0, 0, 1], fov: 75 }}>
        <FloatingParticles />
      </Canvas>
      <div className="gradient-overlay" />
    </div>
  )
}

export default Background3D
