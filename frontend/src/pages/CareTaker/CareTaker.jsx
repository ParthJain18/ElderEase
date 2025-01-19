import { useNavigate } from 'react-router-dom';
import care1 from '../../assets/images/care1.jpg';
import care2 from '../../assets/images/care2.jpg';
import care3 from '../../assets/images/care3.jpg';


const CareTaker = () => {
  const navigate = useNavigate();
  return (
    <>
    
    <section className='hero__section pt-[50px] 2xl:h-[800px] bg-gradient-to-r from-purple-50 to-purple-50'>
  <div className="container mx-auto px-12">
    <div className="flex flex-col lg:flex-row gap-[60px] items-center justify-between">
      {/* Hero Content */}
      <div className="lg:w-[50%] flex gap-[30px] justify-end">
        <div className="flex flex-col gap-[30px]">
          <img className='w-full rounded-lg shadow-lg' src={care1} alt="Care Image 1" />
          <img className='w-full rounded-lg shadow-lg' src={care3} alt="Care Image 3" />
        </div>
        <div className="mt-[60px]">
          <img className='w-full rounded-lg shadow-lg' src={care2} alt="Care Image 2" />
        </div>
      </div>

      {/* Hero Images */}
      <div className="lg:w-[%]">
        <div className='lg:w-[510px] '>
          <h1 className='text-[36px] leading-[46px] text-headingColor font-[800] md:text-[48px] md:leading-[70px] mb-6'>
            We Help Elders Live a Healthy, Longer Life.
          </h1>
          <p className='text__para text-gray-600 mb-8'>
          We provide compassionate and professional care services to ensure elders live a healthy, longer life. Our dedicated team is here to support you every step of the way. </p>
          <button onClick={() => navigate('/caretakerform')} className='btn bg-purple-500 text-white py-3 px-10 rounded-lg hover:bg-purple-800 transition duration-300'>
            Apply for Care Taker
          </button>
        </div>

        {/* Hero Counter */}
        <div className="mt-[50px] flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-[50px]">
          <div className="text-center">
            <h2 className='text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor'>30+</h2>
            <span className='w-[100px] h-2 bg-yellowColor rounded-full block mt-[-14px] mx-auto'></span>
            <p className='text__para text-gray-600 mt-2'>Services</p>
          </div>
          <div className="text-center">
            <h2 className='text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor'>15+</h2>
            <span className='w-[100px] h-2 bg-purpleColor rounded-full block mt-[-14px] mx-auto'></span>
            <p className='text__para text-gray-600 mt-2'>Clinic Locations</p>
          </div>
          <div className="text-center">
            <h2 className='text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor'>100%</h2>
            <span className='w-[100px] h-2 bg-irispurpleColor rounded-full block mt-[-14px] mx-auto'></span>
            <p className='text__para text-gray-600 mt-2'>Elder Satisfaction</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
          
      
  </>
  )
} 

export default CareTaker;