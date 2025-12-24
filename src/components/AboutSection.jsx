import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const AboutSection = () => {
  

  return (
    <div 
      className='w-full h-360 sm:h-screen py-2 lg:p-0 bg-linear-to-r from-blue-50 to-pink-50'
      style={{
        backgroundImage: `url("https://res.cloudinary.com/dxvovx7s2/image/upload/v1765972142/blob-scene-haikei_qidc0k.svg")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className='w-full relative h-290 sm:h-screen'>
        <div className='absolute top-0 left-0 w-full sm:w-1/2 h-auto sm:h-screen sm:bg-white z-1 py-4 p-2 sm:pl-10'>
          <h2 className='text-center text-3xl font-semibold text-[#336EAA] sm:mt-10'>About Us</h2>
          <p className='text-justify mt-5 sm:mt-10 mb-10'>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vel exercitationem, dicta esse velit quod aliquam labore ea aut debitis quae omnis, doloribus minima perferendis eaque reprehenderit odit nam neque fugiat!
            Perspiciatis, quaerat deleniti magni id consequatur quisquam facere repellendus unde ex totam placeat incidunt? Vitae soluta doloremque error voluptas alias ex recusandae. Dolor eligendi quasi unde non officia qui nisi.
            Vitae vel aspernatur mollitia recusandae. Praesentium nobis quas asperiores excepturi veritatis a sequi? Similique dolorem quaerat alias. Blanditiis, ea vel!
            Dignissimos nulla iusto asperiores repellendus, nobis assumenda necessitatibus qui provident amet incidunt voluptates cum ad sint accusamus vero eaque harum illo aperiam rem odit suscipit? <br /><br /> Architecto repudiandae maxime deserunt dicta.
            Quidem voluptatum aut suscipit earum quasi deserunt mollitia dignissimos molestias recusandae delectus a obcaecati repellendus ducimus esse voluptatibus similique facilis, sequi optio. Minima sequi vel ex, minus eum in magnam.
            Ducimus facilis est porro repellat velit. Itaque dicta sit alias eligendi, iure quasi? Dicta, modi quia. Non distinctio atque ipsum soluta labore laboriosam itaque explicabo molestias fuga quam, quisquam culpa!
          </p>
          <Link to="about-us" className='text-lg font-semibold p-2 sm:p-3 px-8 border rounded-lg shadow-md shadow-[#326EAC] text-[#326EAC] hover:bg-[#326EAC] hover:text-white transition-all duration-300 cursor-pointer'>Read more</Link>
        </div>
        <div className='absolute hidden lg:block top-50 right-25 w-60 h-45 border-6 rounded-2xl border-white shadow-2xl'></div>
        <div className='absolute hidden lg:block bottom-70 right-75 w-60 h-45 border-6 border-r-0 rounded-2xl border-[#326EAC]'></div>
        <img src="https://res.cloudinary.com/dxvovx7s2/image/upload/v1765975719/Screenshot_2025-12-17_181706_mmd8dk.png" alt="about image-1" className='absolute bottom-0 right-5 sm:top-35 lg:top-20 lg:right-75 w-[90%] h-55 sm:w-90 sm:h-65 border border-white rounded-md shadow-2xl z-1'/>
        <img src="https://res.cloudinary.com/dxvovx7s2/image/upload/v1765975719/Screenshot_2025-12-17_181807_rnxh9h.png" alt="about image-1" className='absolute -bottom-60 sm:bottom-100 lg:bottom-32 right-5 w-[90%] sm:w-90 h-55 border border-white rounded-md shadow-2xl z-1'/>
        <div className='absolute top-0 right-0 w-2xl h-178 backdrop-blur-sm z-0'></div>
      </div>
    </div>
  )
}

export default AboutSection
