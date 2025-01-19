import axios from "axios";
import { useEffect, useState } from "react";
import { FiCalendar, FiCheck, FiMail, FiUser, FiWatch, FiX } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { formatDateSchedule } from "../../utils/formateDate";


export default function Search(){
    const [search, setSearch] = useState('');
    const [schedules, setSchedules] = useState([]);
    const navigate = useNavigate();

    const handleDetail = (id) => {
        navigate(`/schedule/${id}`);
    }

    useEffect(() => {
        handleSearch();
    }, []);

    useEffect(() => {
        if(search.length < 3 && search!=='') return;
        const delayDebounceFn = setTimeout(() => {
            handleSearch();
        }, 500)
        return () => clearTimeout(delayDebounceFn)
    }, [search]);

    const handleSearch = async () => {
        try{
            let { data } = await axios.get(`http://localhost:5000/api/v1/schedule/search?search=${search}`);
            setSchedules(data);
        }
        catch(err){
            console.log(err);
        }
    }

    return(
        <div className='col-md-9 col-lg-6 mx-auto mt-5 px-md-0 px-3 mb-md-0'>

            <h2 className="mb-3 fw-semibold">Search schedules</h2>

            <div className="d-flex mb-5">
                <input className="form-control" type="search" placeholder="e-mail" onChange={(e) => setSearch(e.target.value)} />
                <button className="btn btn-dark px-5 ms-3" onClick={handleSearch}>Search</button>
            </div>

            <div className="mt-5 mb-5">
                {
                    schedules.map((schedule, index) => {
                        return(
                            <div key={index} className="search-result px-3 mt-4" onClick={() => handleDetail(schedule._id)}>
                                <h3 className='mt-3 fs-5 fw-semibold'>{schedule.description}</h3>

                                <div className="d-flex justify-content-between align-items-center py-3">
                                    <div>
                                        <p><FiUser/>{schedule.name}</p>
                                        <p><FiMail/>{schedule.email}</p>
                                    </div>
                                    <div>
                                        <p>{schedule.finished ?
                                            <><FiCheck/> Finished</> :
                                            <><FiX/> Not finished</>}
                                        </p>
                                    </div>
                                    <div>
                                        <h5><FiCalendar/>{formatDateSchedule(schedule.date)}</h5>
                                        <p><FiWatch/>{schedule.time}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}