import React, { useState, useEffect } from 'react'

const slideImages = [
  "https://aroi.org/images/slider-pic/1.jpg",
  "https://aroi.org/images/slider-pic/2.jpg",
  "https://aroi.org/images/slider-pic/3.jpg",
  "https://aroi.org/images/slider-pic/4.jpg",
  "https://aroi.org/images/slider-pic/5.jpg",
  "https://aroi.org/images/slider-pic/6.jpg",
  "https://aroi.org/images/slider-pic/7.jpg",
  "https://aroi.org/images/slider-pic/8.jpg",
]

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slideImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-[70vh] overflow-hidden">
      {/* Using CSS grid for better control */}
      <div 
        className="grid grid-flow-col h-full transition-transform duration-1000 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          gridTemplateColumns: `repeat(${slideImages.length}, 100vw)`
        }}
      >
        {slideImages.map((image, index) => (
          <div
            key={index}
            className="w-screen h-full"
          >
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Hero