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
      <div className='w-full flex flex-col sm:flex-row relative h-290 sm:h-screen'>
        <div className='w-full sm:w-1/2 h-auto sm:h-screen sm:bg-white z-1 py-4 p-2 sm:pl-10'>
          <h2 className='text-center text-3xl font-semibold text-[#336EAA] sm:mt-10'>About Us</h2>
          <p className='text-justify mt-5 sm:mt-10 mb-10'>
            The Odisha Society of Oncology (OSO) is a registered professional body that brings together
specialists from all disciplines involved in cancer care across the state of Odisha. Established in the
year 2008, the society was founded at a time when cancer treatment facilities in the state were
limited and access to comprehensive oncology care was a significant challenge, especially for the
underprivileged population. A small group of dedicated and visionary oncologists, who were then
serving the people of Odisha with limited resources and infrastructure, recognized the urgent need
for a unified platform to collaborate, share knowledge, and collectively improve cancer care in the
state. Their commitment and foresight led to the formation of OSO. <br /> <br />
From its inception, OSO has served as a common forum for oncologists and allied specialists to
exchange clinical experience, academic insights, and emerging advancements in the field of
oncology. The founding members worked tirelessly to nurture the society in its early years, fostering
a spirit of collaboration and professional excellence. Through regular interactions and shared
learning, OSO gradually evolved into a strong academic and professional organization. <br /><br />
Over the years, the oncology landscape in Odisha has undergone remarkable transformation. Several
new cancer centers have been established across the state, significantly improving access to
diagnostic and therapeutic services. In parallel, many oncology professionals with national and
international training have returned to Odisha, contributing their expertise to serve the local
population. This collective growth has strengthened OSO, both in terms of membership and
academic stature, enabling it to play a pivotal role in advancing cancer care in the region. <br /> <br />
          </p>
          <Link to="/about-us" className='text-lg font-semibold p-2 sm:p-3 px-8 border rounded-lg shadow-md shadow-[#326EAC] text-[#326EAC] hover:bg-[#326EAC] hover:text-white transition-all duration-300 cursor-pointer'>Read more</Link>
        </div>
        <div className='w-1/2 flex flex-col items-center justify-center p-8 h-full z-1'>
          {/* <img src="https://res.cloudinary.com/dxvovx7s2/image/upload/v1766749268/Firefly_20251226165350_rdsb3h.jpg" alt="about image" className='rounded-2xl h-full' /> */}
          <img src="https://res.cloudinary.com/dxvovx7s2/image/upload/v1766734411/osoo_carousel/z1ghbnq0h3f2y7tpwi1h.jpg" alt="about image" className='rounded-tl-2xl rounded-tr-2xl' />
          <img src="https://res.cloudinary.com/dxvovx7s2/image/upload/v1766734411/osoo_carousel/z1ghbnq0h3f2y7tpwi1h.jpg" alt="about image" className='rounded-bl-2xl rounded-br-2xl'/>
        </div>
        <div className='absolute top-0 right-0 w-2xl h-178 backdrop-blur-sm z-0'></div>
      </div>
    </div>
  )
}

export default AboutSection
