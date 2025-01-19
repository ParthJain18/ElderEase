
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'


export default function Home(){
  const [schedules, setSchedules] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    getSchedules();
  }, []);

  const getSchedules = async () => {
    let { data } = await axios.get('http://localhost:5000/api/v1/schedule');
    setSchedules(data);
  }

  const handleDetail = (id) => {
    navigate(`/schedule/${id}`);
  }

  return (
    
    <div className='col-md-7 mx-auto mt-4 px-md-0 px-3 mb-md-0'>
      <style>
        {`
         .fc-direction-ltr{
          // padding:20px;
          margin:20px;
          margin-bottom: 30px;
          }
       ` }
      </style>
      <div className='flex justify-center items-center'>
      <button   className="btn btn-primary py-2 m-8 "
          style={{
            fontWeight: 'bold',
            borderRadius: '8px',
            backgroundColor: '#6c757d',
            border: 'none',
          }} ><Link to='/createSchedule'>New Schedule</Link></button>
      </div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={'en'}
        height={600}
        themeSystem='standard'
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
           className="custom-calendar"
        events={schedules}
        eventClick={(info) => { handleDetail(info.event.id) }}
      />
    </div>
  )
}