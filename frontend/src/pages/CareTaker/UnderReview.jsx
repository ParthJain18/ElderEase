import { Link } from 'react-router-dom';

const UnderReview = () => {
  return (
    <div className="text-center mt-[150px] mb-[300px]">
        <h1 className='heading text-[50px] '>Your Application is currently under review</h1>
        
        <Link to="/careTaker">
          <button className='btn bg-purple-500 text-white  rounded-lg hover:bg-purple-800 
          transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-190'>
            Explore More
          </button>
          </Link>
       
    </div>
  )
}

export default UnderReview