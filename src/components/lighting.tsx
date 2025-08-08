export function Lighting() {
  return (
    <group>
      <directionalLight position={[1, 5, 3]} color="white" intensity={3.0} />
      <ambientLight intensity={1.0} />
    </group>
  )
}
