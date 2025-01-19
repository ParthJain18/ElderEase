
import MyAccount from '../Dashboard/user-account/MyAccount'
import Contact from '../pages/Contact'
import DoctorDetails from '../pages/Doctors/DoctorDetails'
import Doctors from '../pages/Doctors/Doctors'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Services from '../pages/Services'
import Signup from '../pages/Signup'
import { Route, Routes } from 'react-router-dom'
import Schedule from '../components/Schedule/Schedule'
import ScheduleDetail from '../components/Schedule/ScheduleDetail'
import Dashboard from '../Dashboard/doctor-account/Dashboard'
import Map from '../pages/Map/Map'
import Calendar from '../pages/Schedule/Calendar'
import ProtectedRoute from './ProtectedRoute'
import CareTaker from '../pages/CareTaker/CareTaker'
import CareTakerForm from '../pages/CareTaker/CareTakerForm'
import UnderReview from '../pages/CareTaker/UnderReview'
import PatientProfile from '../Dashboard/doctor-account/PatientProfile'


const Routers = () => {
  return <Routes>
    <Route path='/' element={<Home/>}></Route>
    <Route path='/home' element={<Home/>}></Route>
    <Route path='/doctors' element={<Doctors/>}></Route>
    <Route path='/doctors/:id' element={<DoctorDetails/>}></Route>
    <Route path='/login' element={<Login/>}></Route>
    <Route path='/register' element={<Signup/>}></Route>
    <Route path='/contact' element={<Contact/>}></Route>
    <Route path='/services' element={<Services/>}></Route>
    <Route path='/schedule' element={<Calendar/>}></Route>
    <Route path='/createSchedule' element={<Schedule/>}></Route>
    <Route path='/schedule/:id' element={<ScheduleDetail/>}></Route>
    <Route path='/map' element={<Map/>}></Route>
    <Route path='/careTaker' element={<CareTaker/>}></Route>
    <Route path='/careTakerForm' element={<CareTakerForm/>}></Route>
    <Route path='/underReview' element={<UnderReview/>}></Route>
    <Route path='/patientProfile' element={<PatientProfile/>}></Route>




    <Route path='/users/profile/me' element={<ProtectedRoute allowedRoles={['patient']}><MyAccount/></ProtectedRoute>}></Route>
    <Route path='/doctors/profile/me' element={<ProtectedRoute allowedRoles={['doctor']}><Dashboard/></ProtectedRoute>}></Route>



  </Routes>
  
}

export default Routers