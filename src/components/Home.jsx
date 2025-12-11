import React from 'react'
import HeroSection from './HeroSection'
import MarqueeEvents from '../pages/MarqueeEvents'
import AboutSection from './AboutSection'
import EventSection from './EventSection'

const Home = () => {
  return (
    <>
      <div className='w-full'>
        <MarqueeEvents/>
      </div>
      <HeroSection />
      <AboutSection />
      <EventSection />
    </>
  )
}

export default Home
