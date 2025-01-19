import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import axios from "axios";
import toast from "react-hot-toast";
import { formatDateSchedule } from "../../utils/formateDate";


export default function ScheduleDetail(){
    const [schedule, setSchedule] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getSchedule();
    }, []);

    const getSchedule = async () =>{
        try{
            console.log("Hello");
            let { data } = await axios.get(`http://localhost:5000/api/v1/schedule/${id}`);
            
            setSchedule(data);
            console.log(data);
        }
        catch(err){
            toast.error(err.response.data.message);
            console.log(err);
        }
    }

    const finishSchedule = async () => {
        try{
            let { data } = await axios.post(`http://localhost:5000/api/v1/schedule/finish`, { id: schedule._id });
            setSchedule(data.schedule);
            toast.success(data.message);
            console.log(data);
            navigate('/schedule');
        }
        catch(err){
            console.log(err);
        }
    }

    return (
        <div className="col-md-6 mx-auto mt-5 px-md-0 px-20 mb-md-0 bg-purple-50 border border-purple-200 rounded-lg p-6">
  {/* Schedule Details */}
  <div className="bg-white p-5 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md border border-purple-100">
  <div className="mb-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
      <p className="text-purple-600 font-semibold mb-1">Name:</p>
      <p className="text-gray-900">{schedule.name}</p>
    </div>

    {/* Email Box */}
    <div className="mb-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
      <p className="text-purple-600 font-semibold mb-1">Email:</p>
      <p className="text-gray-900">{schedule.email}</p>
    </div>

    {/* Date Box */}
    <div className="mb-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
      <p className="text-purple-600 font-semibold mb-1">Date:</p>
      <p className="text-gray-900">{formatDateSchedule(schedule.date)}</p>
    </div>

    {/* Time Box */}
    <div className="mb-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
      <p className="text-purple-600 font-semibold mb-1">Time:</p>
      <p className="text-gray-900">{schedule.time}</p>
    </div>

    {/* Description Box */}
    <div className="mb-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
      <p className="text-purple-600 font-semibold mb-1">Description:</p>
      <p className="text-gray-900">{schedule.description}</p>
    </div>

    {/* Buttons */}
    <div className="d-flex justify-content-between">
      <div>
        {!schedule.finished ? (
          <button
            className="btn bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 fw-semibold transition-all duration-300 hover:from-purple-600 hover:to-blue-600 hover:scale-105"
            onClick={finishSchedule}
          >
            Finish Schedule
          </button>
        ) : (
          <button
            className="btn bg-gradient-to-r from-purple-300 to-blue-300 text-white px-4 py-2 fw-semibold opacity-75 cursor-not-allowed"
            disabled
          >
            Continue
          </button>
        )}
      </div>

      <div>
        <button
          className="btn bg-gradient-to-r from-pink-500 to-orange-500 text-white px-4 py-2 fw-semibold transition-all duration-300 hover:from-pink-600 hover:to-orange-600 hover:scale-105"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
    </div>
  </div>

  {/* Event Information */}
  <p className="text-center text-gray-600 mt-4">Event Information: {id}</p>
</div>
    )
    }