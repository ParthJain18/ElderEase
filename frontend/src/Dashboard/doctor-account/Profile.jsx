import {useState} from 'react'

function Profile() {

  const [formData,setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    gender: '',
    specialization:'',
    ticketPrice:0,
    qualifications:[],
    experiences:[],
    timeSlots:[]
  })
   
  const handleInputChange = (e) => {
    const {name,value} = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  return (
    <div>
      <h2 className="text-headingColor font-bold text-[24px] leading-9 mb-10">
        Profile Information</h2>

        <form>
            <div className="mb-5"></div>
            <p className="form__label">Name</p>
            <input type="text"  name="name" value={formData.name} onChange={handleInputChange}
            placeholder='Full name' className='form__input'/>

            <div className="mb-5"></div>
            <p className="form__label">Email</p>
            <input type="email"  name="email" value={formData.email} onChange={handleInputChange}
            placeholder='Email' className='form__input'
            readOnly
            aria-readonly
            disabled="true"
            />

            <div className="mb-5"></div>
            <p className="form__label">Phone</p>
            <input type="number"  name="phone" value={formData.phone} onChange={handleInputChange}
            placeholder='Phone number' className='form__input'
            />
            
            <div className="mb-5"></div>
            <p className="form__label">Bio</p>
            <input type="text"  name="bio" value={formData.bio} onChange={handleInputChange}
            placeholder='Bio' className='form__input'
            maxLength={100}
            />

            <div className="mb-5">
                <div className="grid grid-cols-3 gap-5 mb-[30px]">
                    <div>
                        <p className="form__label">Gender*</p>
                        <select 
                        name='gender' 
                        value={formData.gender} 
                        onChange={handleInputChange}
                        className='form__input py-3.5'
                        >
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>

                    <div>
                        <p className="form__label">Specialization*</p>
                        <select 
                        name='specialization' 
                        value={formData.specialization} 
                        onChange={handleInputChange}
                        className='form__input py-3.5'
                        >
                            <option value="">Select</option>
                            <option value="Surgeon">Surgeon</option>
                            <option value="Neurologist">Neurologist</option>
                            <option value="Dermatologist">Dermatologist</option>
                        </select>
                    </div>

                    <div>
                         <p className='form__label'>Ticket Price*</p>
                         <input type='number' placeholder='100' name='ticketprice' value={formData.ticketPrice}
                        className='form__input'/>
                    </div>
                </div>
            </div>
           
           {/* test */}

        {/* test */}

        </form>
    </div>
  )
}

export default Profile