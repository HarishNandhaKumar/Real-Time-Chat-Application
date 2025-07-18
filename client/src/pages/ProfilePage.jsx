import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext.jsx'

const ProfilePage = () => {

  const {authUser, updateProfile} = useContext(AuthContext)

  const [selectedImg, setSelectedImg] = useState(null)
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.fullName)
  const [bio, setBio] = useState(authUser.bio)

  const handleSubmit = async (e)=>{
    e.preventDefault();
    if(!selectedImg){
      await updateProfile({fullName: name, bio});
      navigate('/');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onload = async ()=>{
      const base64Image = reader.result;
      await updateProfile({profilePic: base64Image, fullName: name, bio})
      navigate('/');
    }
    
  }

  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center
    justify-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-xl text-gray text-black border-3
      border-black flex items-center justify-between max-sm:flex-col-reverse
      rounded-lg'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5 p-10 flex-1'>
          <h3 className='text-xl font-bold'>Profile Details</h3>
          <label htmlFor='avatar' className='flex items-center gap-3
          cursor-pointer'>
            <input onChange={(e)=>setSelectedImg(e.target.files[0])} type="file" 
            id='avatar' accept='.png, .jpg, .jpeg, .gif' hidden/>
            <img src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon} alt="" 
            className={`w-12 h-12 cursor-pointer transition-transform duration-200 transform hover:scale-110 ${selectedImg && 'rounded-full'}`}/>
            Click Icon to upload new profile image
          </label>
          <input onChange={(e)=>setName(e.target.value)} value={name}
          type="text" required placeholder='Your Name' className='p-2 bg-orange-50 border
          border-black rounded-md focus:outline-none focus:ring-2
          focus:ring-yellow-600' />
          <textarea onChange={(e)=>setBio(e.target.value)} value={bio}
          placeholder='Write your profile bio' required className='p-2 bg-orange-50 border
          border-gray-500 rounded-md focus:outline-none focus:ring-2
          focus:ring-yellow-600' rows={4}></textarea>
          
          <button type="submit"
          className='bg-gradient-to-r from-yellow-400 to-orange-600 text-white font-bold border-2 p-2
          rounded-full text-lg cursor-pointer transform hover:scale-105 transition duration-200 hover:bg-white
           hover:from-white hover:to-orange-50 hover:text-black'
          >Update</button>
        </form>
        <img className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 transition-transform transform hover:scale-120
          ${selectedImg && 'rounded-full'}`} src={authUser?.profilePic || assets.logo_icon} alt="" />
      </div>
        
    </div>
  )
}

export default ProfilePage