import { useState } from 'react';
import caretaker from '../../assets/images/care3.jpg';
// import { auth, db } from '../../firebase.js';
// import { setDoc, doc } from 'firebase/firestore';

const CareTakerForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    resume: '',
    aadhaar: '',
    gender: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
  
    const errorMessageElement = document.getElementById("error-message");
    errorMessageElement.style.display = "none"; 

    try {
      // Destructuring the formData for cleaner usage
      const { name, email, phone, age, gender, resume, aadhaar } = formData;
  
      // MongoDB API endpoint (Update this with your actual backend endpoint)
      const apiUrl = "http://localhost:5000/api/careTakerForm";
  

      // Data to be sent to the MongoDB collection
      const applicationData = {
        name,
        email,
        phone,
        age,
        gender,
        resume,
        aadhaar,
        timestamp: new Date(), // Optional: Add timestamp for tracking
      };
  
      // Making a POST request to save the data
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(applicationData),
      });
  
      if (!response.ok) {
        
        errorMessageElement.innerText = "Failed to save application data. Please try again.";
       
      }
  
      // Resetting the form data after successful submission
    
      console.log("Application data saved successfully!");
      alert("Application Saved Successfully!");

      // Resetting the form data after successful submission
      setFormData({
        name: "",
        email: "",
        phone: "",
        age: "",
        resume: "",
        aadhaar: "",
        gender: "",
      });
  
      // Redirecting to the review page after saving the data
      window.location.href = "/underReview";
    } catch (error) {
      console.error("Error saving application data:", error);
      // Display error message below the form
      const errorMessageElement = document.getElementById("error-message");
      errorMessageElement.style.display = "block";
      errorMessageElement.innerText = "Error: " + error.message;
    }
  };
  
  

  return (
    <section className="px-5 xl:px-0">
      <div className="max-w-[1170px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* img box */}
          <div className="hidden lg:block bg-primaryColor rounded-l-lg">
            <figure className="rounded-l-lg">
              <img src={caretaker} alt="" className="w-full rounded-l-lg" />
            </figure>
          </div>

          {/* application form */}
          <div className="rounded-l-lg lg:pl-16 py-10">
            <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10">
              Apply for <span className="text-primaryColor">Care Taker📝</span>
            </h3>

            <form onSubmit={submitHandler} className="grid grid-cols-1 gap-3">
              <div className="mb-5">
                <input
                  type="text"
                  placeholder="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full relative py-3 px-4 border border-solid peer border-gray-300 bg-gray-50 focus:bg-white focus:outline-none outline-none focus:border-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor/90 dark:bg-generalBackgroundColorDark/90 rounded-md transition-all duration-300 ease-in-out shadow-sm hover:shadow-md focus:shadow-lg dark:border-gray-600 cursor-pointer"
                  required
                />
              </div>

              <div className="mb-5">
                <input
                  type="email"
                  placeholder="Enter your Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full relative py-3 px-4 border border-solid peer border-gray-300 bg-gray-50 focus:bg-white focus:outline-none outline-none focus:border-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor/90 dark:bg-generalBackgroundColorDark/90 rounded-md transition-all duration-300 ease-in-out shadow-sm hover:shadow-md focus:shadow-lg dark:border-gray-600 cursor-pointer"
                  required
                />
              </div>

              <div className="mb-5">
                <input
                  type="tel"
                  placeholder="Enter your Mobile Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full relative py-3 px-4 border border-solid peer border-gray-300 bg-gray-50 focus:bg-white focus:outline-none outline-none focus:border-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor/90 dark:bg-generalBackgroundColorDark/90 rounded-md transition-all duration-300 ease-in-out shadow-sm hover:shadow-md focus:shadow-lg dark:border-gray-600 cursor-pointer"
                  required
                />
              </div>

              <div className="mb-6">
                <div className="flex items-start justify-between flex-col  mb-6">
                  <h6 className="text-headingColor text-[16px] inline-block font-bold leading-7 mb-2">
                    Gender:
                  </h6>
                  <div>
                    <label className="pr-4 text-textColor text-sm ">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        onChange={handleInputChange}
                        checked={formData.gender === "male"}
                        className="mr-3"
                      />
                      Male
                    </label>
                    <label className="pr-4 text-textColor text-sm">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        onChange={handleInputChange}
                        checked={formData.gender === "female"}
                        className="mr-3"
                      />
                      Female
                    </label>
                  </div>
                </div>

                <input
                  type="number"
                  placeholder="Enter your Age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full relative py-3 px-4 border border-solid peer border-gray-300 bg-gray-50 focus:bg-white focus:outline-none outline-none focus:border-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor/90 dark:bg-generalBackgroundColorDark/90 rounded-md transition-all duration-300 ease-in-out shadow-sm hover:shadow-md focus:shadow-lg dark:border-gray-600 cursor-pointer"
                  required
                />
              </div>

              <div className="mb-5">
                <input
                  type="text"
                  placeholder="Enter your Aadhaar Number"
                  name="aadhaar"
                  value={formData.aadhaar}
                  onChange={handleInputChange}
                  className="w-full relative py-3 px-4 border border-solid peer border-gray-300 bg-gray-50 focus:bg-white focus:outline-none outline-none focus:border-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor/90 dark:bg-generalBackgroundColorDark/90 rounded-md transition-all duration-300 ease-in-out shadow-sm hover:shadow-md focus:shadow-lg dark:border-gray-600 cursor-pointer"
                  required
                />
              </div>

              <div className="mb-5">
                <input
                  type="url"
                  placeholder="Your resume link"
                  name="resume"
                  value={formData.resume}
                  onChange={handleInputChange}
                  className="w-full relative py-3 px-4 border border-solid peer border-gray-300 bg-gray-50 focus:bg-white focus:outline-none outline-none focus:border-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor/90 dark:bg-generalBackgroundColorDark/90 rounded-md transition-all duration-300 ease-in-out shadow-sm hover:shadow-md focus:shadow-lg dark:border-gray-600 cursor-pointer"
                  required
                />
                 <p id="error-message" className="text-red-500 font-bold"></p>
              </div>

              <div className="mt-7">
                <button
                  type="submit"
                  className="w-full relative py-3 px-4 border border-solid peer border-gray-300 focus:outline-none outline-none bg-primaryColor hover:bg-transparent hover:border-primaryColor text-[16px] leading-7 text-white hover:text-textColor placeholder:text-textColor/90 rounded-md transition-all duration-300 ease-in-out shadow-sm hover:shadow-md focus:shadow-lg dark:border-gray-600 active:scale-95"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareTakerForm;