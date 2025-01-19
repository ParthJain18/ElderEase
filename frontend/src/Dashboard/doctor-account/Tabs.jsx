import { useContext } from 'react';
import { BiMenu } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { authContext } from '../../context/AuthContext';

function Tabs({ tab, setTab }) {

  const {dispatch} = useContext(authContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch({type:'LOGOUT'})
    navigate('/')
  }

  return (
    <div>
      {/* Mobile Menu Icon */}
      <span className="lg:hidden">
        <BiMenu className="w-6 h-6 cursor-pointer" />
      </span>

      {/* Tabs Container */}
      <div className="hidden lg:flex flex-col p-[30px] rounded-md bg-white shadow-panelShadow items-center h-max">
        {/* Overview Tab */}
        <button
          onClick={() => setTab('overview')}
          className={`${
            tab === 'overview'
              ? 'bg-indigo-100 text-primaryColor'
              : 'bg-transparent text-headingColor'
          } w-full btn mt-0 rounded-md`}
        >
          Overview
        </button>

        {/* Appointments Tab */}
        <button
          onClick={() => setTab('appointments')}
          className={`${
            tab === 'appointments'
              ? 'bg-indigo-100 text-primaryColor'
              : 'bg-transparent text-headingColor'
          } w-full btn mt-0 rounded-md`}
        >
          Appointments
        </button>

        {/* Settings Tab */}
        <button
          onClick={() => setTab('settings')}
          className={`${
            tab === 'settings'
              ? 'bg-indigo-100 text-primaryColor'
              : 'bg-transparent text-headingColor'
          } w-full btn mt-0 rounded-md`}
        >
          Profile
        </button>

        {/* Patients Tab */}
        <button
          onClick={() => setTab('patients')}
          className={`${
            tab === 'patients'
              ? 'bg-indigo-100 text-primaryColor'
              : 'bg-transparent text-headingColor'
          } w-full btn mt-0 rounded-md`}
        >
          Your Patients
        </button>
     
        <div className='mt-[50px] w-full'>
                    <button 
                    onClick={handleLogout} 
                    className='w-full bg-[#181A1E] p-3 text-[16px]  rounded-md text-white'
                    >Logout
                    </button>
                    <button className='w-full bg-red-600 mt-2 p-3 text-[16px] leading-7 rounded-md'>Delete Account</button>
                </div>
     

      </div>
    </div>
  );
}

export default Tabs;