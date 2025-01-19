import { useState, useEffect } from 'react';
import patient from '../../assets/images/elder-icon.png';

const PatientProfile = () => {
    const [reports, setReports] = useState(() => {
        const savedReports = localStorage.getItem('reports');
        return savedReports ? JSON.parse(savedReports) : [];
    });
    const [reportFile, setReportFile] = useState(null);
    const [chatHistory, setChatHistory] = useState([
        { prompt: "What is the patient's current condition?", response: "The patient is stable and showing signs of improvement." },
        { prompt: "Are there any side effects from the medication?", response: "No significant side effects have been observed." },
        { prompt: "What is the next step in the treatment plan?", response: "Continue with the current medication and schedule a follow-up in two weeks." }
    ]);

    useEffect(() => {
        localStorage.setItem('reports', JSON.stringify(reports));
    }, [reports]);

    const handleFileChange = (e) => {
        setReportFile(e.target.files[0]);
    };

    const handleUpload = () => {
        if (reportFile) {
            const newReport = {
                file: reportFile,
                date: new Date().toLocaleString(),
                url: URL.createObjectURL(reportFile),
            };
            setReports([...reports, newReport]);
            setReportFile(null);
        }
    };

    const handleChatSubmit = (e) => {
        e.preventDefault();
        const prompt = e.target.elements.prompt.value;
        const response = "This is a sample response from the chatbot."; // Replace with actual chatbot response logic
        setChatHistory([...chatHistory, { prompt, response }]);
        e.target.reset();
    };

    return (
        <div className="patient-profile p-6 bg-gray-100 min-h-screen flex">
            <div className="w-3/4">
                <h1 className="text-3xl font-bold mb-6">Patient Profile</h1>
                <div className="patient-details mb-6 p-4 bg-white shadow rounded">
                    <h2 className="text-2xl font-semibold">Anikesh Kulal</h2>
                    <p className="text-lg">Age: 22</p>
                    <p className="text-lg">Gender: Male</p>
                    <p className="text-lg">Condition: Hypertension</p>
                </div>
                <div className="upload-section mb-6 p-4 bg-white shadow rounded">
                    <h3 className="text-xl font-semibold mb-4">Upload Patient Report</h3>
                    <input type="file" onChange={handleFileChange} className="mb-4 p-2 border rounded" />
                    <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Upload</button>
                </div>
                <div className="reports-table p-4 bg-white shadow rounded mb-6">
                    <h3 className="text-xl font-semibold mb-4">Reports</h3>
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Report</th>
                                <th className="py-2 px-4 border-b">Date & Time</th>
                                <th className="py-2 px-4 border-b">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((report, index) => (
                                <tr key={index}>
                                    <td className="py-2 px-4 border-b">{report.file.name}</td>
                                    <td className="py-2 px-4 border-b">{report.date}</td>
                                    <td className="py-2 px-4 border-b">
                                        <a href={report.url} target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">View Report</a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="chatbot-section p-4 bg-white shadow rounded">
                    <h3 className="text-xl font-semibold mb-4">Chatbot Verification</h3>
                    <form onSubmit={handleChatSubmit} className="mb-4">
                        <input type="text" name="prompt" placeholder="Enter your prompt" className="mb-4 p-2 border rounded w-full" />
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Send</button>
                    </form>
                    <div className="chat-history">
                        {chatHistory.map((chat, index) => (
                            <div key={index} className="mb-4 p-2 border rounded bg-gray-50 flex justify-between items-center">
                                <div>
                                    <p><strong>Prompt:</strong> {chat.prompt}</p>
                                    <p><strong>Response:</strong> {chat.response}</p>
                                </div>
                                <div className="text-right">
                                    <input type="checkbox" className="mr-2" /> Verified
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="w-1/4 pl-6">
                <img src={patient} alt="Patient" className="w-full h-auto rounded " />
            </div>
        </div>
    );
};

export default PatientProfile;
