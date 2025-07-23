import type { MetaFunction } from "@remix-run/node"
import React, { useState } from "react"
import { MapDimensions } from "~/types/canvas"
import { Canvas } from "~/components/Canvas"

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ]
}

export default function Index() {
  const [mapDimensions, setMapDimensions] = useState<MapDimensions>({
    width: 300,
    height: 300,
    numXGridSquares: 6,
    numYGridSquares: 6,
    gridSquareSize: 50,
  })

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputName = e.target.getAttribute("name")
    if (typeof inputName !== "string") return

    const value = parseInt(e.target.value)
    setMapDimensions((prev) => ({ ...prev, [inputName]: value }))
  }

  const properties = Object.keys(mapDimensions) as (keyof MapDimensions)[]

  return (
    <div className="flex flex-col items-center">
      {properties.map((property) => (
        <input
          key={property}
          type="number"
          className="h-10 w-20 border-2"
          placeholder={property}
          defaultValue={mapDimensions[property]}
          name={property}
          onChange={handleInput}
        />
      ))}
      <Canvas mapDimensions={mapDimensions} />
    </div>
  )
}
