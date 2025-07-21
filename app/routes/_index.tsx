import type { MetaFunction } from "@remix-run/node"
import { Canvas } from "~/components/Canvas"
import { Canvas2 } from "~/components/Canvas2"

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ]
}

export default function Index() {
  return (
    <div>
      {/* <div className="flex h-screen items-center justify-center"> */}
      {/* <Canvas /> */}
      <Canvas2 />
    </div>
  )
}
