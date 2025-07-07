import React, { useContext, useEffect, useState } from 'react'
import assets from "../assets/assets"
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContext'
import { useDelete } from "../../context/DeleteContext";



const Sidebar = () => {
    
  const {getUsers, users, selectedUser, setSelectedUser,
    unseenMessages, setUnseenMessages} = useContext(ChatContext)

  const {logout, onlineUser} = useContext(AuthContext)

  const { handleDeleteClick, showConfirmDelete, setShowConfirmDelete, confirmDelete } = useDelete();

  const [input, setInput] = useState("")
    
  const navigate = useNavigate();

  const filteredUsers = input ? users.filter((user)=>user.fullName.toLowerCase().includes(input.toLowerCase())) : users;

  useEffect(()=>{
    getUsers();
  },[onlineUser])

  return (
    <div className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll
         text-white ${selectedUser ? "max-md:hidden" : ''}`}>
        <div className='pb-5'>
          <div className='flex justify-between items-center'>
            <img src={assets.logo_new} alt="logo" className='max-w-20' />
            <div className='relative py-2 group'>
                <img src={assets.menu_icon} alt="logo" className='max-h-5 cursor-pointer' />
                <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md
                bg-[#282142]/60 backdrop-blur-md border border-gray-600 text-gray-100 hidden group-hover:block shadow-xl'>
                    <p className="cursor-pointer hover:text-sm" onClick={()=>navigate('/profile')}>Edit Profile</p>
                    <hr className='my-2 border-t border-gray-500' />
                    <p onClick={handleDeleteClick} className='cursor-pointer hover:text-sm text-gray-100'>Delete Account</p>
                    <hr className='my-2 border-t border-gray-500' />
                    <p onClick={()=> logout()} className='cursor-pointer hover:text-sm'>Logout</p>
                </div>
            </div>
          </div>  

          <div className='bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5'>
            <img src={assets.search_icon} alt="Search" className='w-3'/>
            <input onChange={(e)=>setInput(e.target.value)} type="text" className='bg-transparent border-none outline-none
            text-white text-xs placeholder-[#c8c8c8] flex-1' placeholder='Search User...' />
          </div>
        </div>

        <div className='flex flex-col gap-y-2'>
            {filteredUsers.map((user, index)=>(
                <div onClick={()=>{setSelectedUser(user); setUnseenMessages(prev=>({...prev, [user._id]:0}))}} key={index} className={`relative flex items-center gap-2 p-2 pl-4 rounded-xl border border-gray-400
                cursor-pointer max-sm:text-sm hover:bg-[#282142]/50 transition duration-150 ${selectedUser?._id === user._id ? 'bg-[#282142]/50' : 'bg-transparent'}`}>
                    <img src={user?.profilePic || assets.avatar_icon} alt="" className='w-[35px] aspect-[1/1] rounded-full' />
                    <div className='flex flex-col leading-5'>
                        <p>{user.fullName}</p>
                        {
                            onlineUser?.includes(user._id)
                            ? <span className='text-green-400 text-xs'>Online</span>
                            : <span className='text-neutral-400 text-xs'>Offline</span>
                        }
                    </div>
                    {unseenMessages[user._id] > 0 && <p className='absolute top-4 right-4 text-xs h-5 w-5
                    flex justify-center items-center rounded-full bg-violet-500/50'>
                    {unseenMessages[user._id]}</p>}
                </div>
            ) )}
        </div>

        {/* confirmation dialog */}
        {showConfirmDelete && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-xl z-50 flex justify-center items-center">
            <div className="bg-[#282142] p-6 rounded-xl shadow-xl border border-gray-600 max-w-xs text-center">
              <p className="text-white mb-4">Are you sure you want to delete your account?</p>
              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white text-sm"
                >
                  Yes, Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(false)}
                  className="bg-gray-400 hover:bg-gray-500 px-4 py-2 rounded text-white text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}

export default Sidebar