import {useState} from 'react'
import Loader from '../../components/Loader/Loading'
import Error from '../../components/Error/Error'
import useGetProfile from '../../hooks/useFetchData.jsx'
import {BASE_URL} from '../../config'
import Tabs from './Tabs.jsx'
import starIcon from '../../assets/images/Star.png'
import DoctorAbout from '../../pages/Doctors/DoctorAbout.jsx'
import Profile from './Profile.jsx'
import Appointments from './Appointments.jsx'
import Patients from './Patients.jsx'


const Dashboard = () => {

  const {data, loading, error}= useGetProfile(`${BASE_URL}/doctors/profile/me`)

  const [tab,setTab] = useState('overview')

  return (
    <section>
    <div className="max-w-[1170px] px-5 mx-auto">
      {loading && !error && <Loader />}
      {error && !loading && <Error error={error} />}

      {!loading && !error && <div className="grid lg:grid-cols-3 gap-[30px] lg:gap-[50px]">
        <Tabs tab={tab} setTab={setTab}/>
        <div className="lg:col-span-2">
          {data.isApproved ==='pending' && ( <div className="flex p-4 mb-4 text-green-800 bg-green-50 rounded-lg">
            <div className='ml-3 text-sm font-medium'>
            Your account has been approved. Welcome to ElderEase.
            </div>
            </div>)}

           <div className='mt-8'>
              
            {tab === 'overview' &&  <div>
              <div className='flex items-center gap-4 mb-10'>
                <figure className='max-w-[200px] max-h-[200px]'><img src={data?.photo} alt='' className='w-full'/>
                </figure>

                <div>
                  <span className='bg-[#CCF0F3] text-irisBlueColor py-1 px-4 lg:py-2 lg:px-6 rounded 
                  text-[12px] leading-4 lg:text-[16px] lg:leading-6 font-semibold'>
                   Surgeon</span>

                   <h3 className='text-[24px] leading-9 font-bold text-headingColor mt-3'>
                    Krishna Jatav
                    </h3>
 
              <div className='flex items-center gap-[6px]'>
             <span className='flex items-center gap-[5px] text-headingColor text-[14px]
             leading-5 lg:text-[16px] lg:leading-6 font-semibold'><img src={starIcon} alt=''/>
             4.5
             </span>
             <span className=' text-textColor text-[14px]
             leading-5 lg:text-[16px] lg:leading-6 font-semibold'>
              (233)
             </span>
              </div>
               <p className='text__para font-[15px] lg:max-w-[390px] leading-6
               '>doctor bio
               </p>
               </div>
              </div>
             <DoctorAbout 
             name={data.name} 
             about={data.about} 
             qualifications={data.qualifications}
             experience={data.experience}/>
              </div>}
            {tab === 'appointments' && <Appointments appointments={data.appointments}/>}
            {tab === 'settings' && <Profile DoctorAbout={data} />}
            {tab === 'patients' && <Patients DoctorAbout={data.patients} />}

            </div> 
        </div>
      </div>
}
 
    </div>
    </section>
  )
}

export default Dashboard