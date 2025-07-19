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
    <div className={`bg-[#8185B2]/40 h-full p-5 rounded-r-xl overflow-y-scroll
         text-white ${selectedUser ? "max-md:hidden" : ''}`}>
        <div className='pb-5'>
          <div className='flex justify-between items-center'>
            <img src={assets.logo_new} alt="logo" className='max-w-20' />
            <div className='relative py-2 group'>
                <img src={assets.menu_icon} alt="logo" className='max-h-5 cursor-pointer' />
                <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md
                bg-gradient-to-r from-cyan-900/70 to-blue-950/70 backdrop-blur-md border border-white text-gray-100 hidden group-hover:block shadow-xl'>
                    <p className="cursor-pointer hover:text-orange-400" onClick={()=>navigate('/profile')}>Edit Profile</p>
                    <hr className='my-2 border-t border-gray-500' />
                    <p onClick={handleDeleteClick} className='cursor-pointer hover:text-orange-400'>Delete Account</p>
                    <hr className='my-2 border-t border-gray-500' />
                    <p onClick={()=> logout()} className='cursor-pointer hover:text-orange-400'>Logout</p>
                </div>
            </div>
          </div>  

          <div className='bg-gradient-to-r from-cyan-900/70 to-blue-950/70 rounded-full flex items-center gap-2 py-3 px-4 mt-5'>
            <img src={assets.search_icon} alt="Search" className='w-3'/>
            <input onChange={(e)=>setInput(e.target.value)} type="text" className='bg-transparent border-none outline-none
            text-white text-xs placeholder-white flex-1' placeholder='Search User' />
          </div>
        </div>

        <div className='flex flex-col gap-y-2'>
            {filteredUsers.map((user, index)=>(
                <div onClick={()=>{
                  if (selectedUser?._id === user._id) {
                    setSelectedUser(null); // close chat area if same user is clicked
                  } else {
                    setSelectedUser(user); // open chat for new user
                    setUnseenMessages(prev => ({ ...prev, [user._id]: 0 }));
                  }
                }} 
                
                key={index} className={`relative flex items-center gap-2 p-2 pl-4 rounded-xl border-2 border-white
                cursor-pointer transition-transform duration-200 transform hover:scale-105 max-sm:text-sm hover:bg-[#282142]/50 
                ${selectedUser?._id === user._id ? 'bg-orange-900/70' : 'bg-gradient-to-r from-yellow-400 to-orange-600'}`}>
                    <img src={user?.profilePic || assets.avatar_icon} alt="" className='w-[35px] aspect-[1/1] rounded-full' />
                    <div className='flex flex-col leading-5 '>
                        <p className='text-black font-semibold mx-1'>{user.fullName}</p>
                        {
                            onlineUser?.includes(user._id)
                            ? <span className='text-green-500 text-xs bg-white/80 rounded-full px-2 my-0.5 mx-auto inline-flex'>Online</span>
                            : <span className='text-red-500 text-xs bg-white/80 rounded-full px-2 my-0.5 mx-auto inline-flex'>Offline</span>
                        }
                    </div>
                    {unseenMessages[user._id] > 0 && <p className='absolute top-4 right-4 text-xs h-5 w-5
                    flex justify-center items-center rounded-full bg-violet-500/50'>
                    {unseenMessages[user._id]}</p>}
                </div>
            ) )}
        </div>

        {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-r from-cyan-900/70 to-blue-950/70 border border-gray-600 p-6 rounded-xl w-[90%] max-w-sm shadow-xl text-white">
            <h2 className="text-lg font-semibold mb-4">Delete Account?</h2>
            <p className="text-sm mb-6">
              Are you sure you want to delete your account ? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md text-sm">
                Cancel
              </button>
              <button onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Sidebar