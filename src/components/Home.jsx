import React from 'react'
import HeroSection from './HeroSection'
import MarqueeEvents from '../pages/MarqueeEvents'
import AboutSection from './AboutSection'
import EventSection from './EventSection'
import MemberSection from './MemberSection'
import WhyJoinSection from './WhyJoinSection'
import GallerySection from './GallerySection'

const Home = () => {
  return (
    <>
      <div className='w-full'>
        <MarqueeEvents/>
      </div>
      <HeroSection />
      <AboutSection />
      <EventSection />
      <MemberSection/>
      <GallerySection/>
      <WhyJoinSection/>
    </>
  )
}

export default Home
