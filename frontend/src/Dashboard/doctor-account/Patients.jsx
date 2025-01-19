import { Link } from "react-router-dom";

const patientsData = [
    { name:  'Anikesh Kulal', tags: ['Diabetes', 'Hypertension'], description: 'Regular check-up required' },
    { name: 'Harsh Thapa', tags: ['Asthma'], description: 'Monthly follow-up' },
    { name: 'Parth Jain', tags: ['Cardiac'], description: 'Needs medication adjustment' },
];

const Patients = () => {
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Patients</h1>
            <ul>
                {patientsData.map((patient, index) => (
                    <li key={index} className="bg-white p-4 rounded-lg shadow-md mb-4 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-semibold">{patient.name}</h2>
                            <p className="text-gray-600">Tags: {patient.tags.join(', ')}</p>
                            <p className="text-gray-600">Description: {patient.description}</p>
                        </div>
                       <Link to='/patientProfile'> <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300">View Details</button></Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Patients;
