import React, { useContext, useEffect, useRef, useState } from 'react'
import assets, { messagesDummyData } from '../assets/assets'
import { formatMessageTime } from '../lib/utils.js'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import EmojiPicker from 'emoji-picker-react';


const ChatContainer = () => {
  
    const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } = useContext(ChatContext)
    const { authUser, onlineUser } = useContext(AuthContext)

    const scrollEnd = useRef()
    const emojiPickerRef = useRef(null);

    const [input, setInput] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [loadingImage, setLoadingImage] = useState(false);


    // Handle emoji picker in chat
    const handleEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
    };

    // Handle sending a message
    const handleSendMessage = async (e)=>{
        e.preventDefault();
        if(input.trim() === "") return null
        await sendMessage({text: input.trim()});
        setInput("")
    }

    // Handle sending an image
    const handleSendImage = async (e) =>{
        const file = e.target.files[0];
        if(!file || !file.type.startsWith("image/")){
            toast.error("Select an image file")
            return;
        }

        setLoadingImage(true);

        setTimeout(async () => {
        const imageUrl = await uploadImage(selectedFile); // your upload function

        await sendMessage({
            type: 'image',
            image: imageUrl,
        });

        setLoadingImage(false); // Remove shimmer after delay
        }, 1000);

        const reader = new FileReader();
        reader.onloadend = async ()=>{
            await sendMessage({image: reader.result})
            setLoadingImage(false);
            e.target.value = ""
        }
        reader.readAsDataURL(file)
    }


    useEffect(()=>{
        if(selectedUser){
            getMessages(selectedUser._id)
        }
    },[selectedUser])

    useEffect(()=>{
        if(scrollEnd.current && messages){
            scrollEnd.current.scrollIntoView({ behavior: "smooth" })
        }
    },[messages])

    
    useEffect(() => {
    const handleClickOutside = (e) => {
        if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
    }, []);


    useEffect(() => {
    if (loadingImage && scrollEnd.current) {
        scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
    }, [loadingImage]);
  
    return selectedUser ? (
    <div className='h-full overflow-scroll relative backdrop-blur-lg'>
        {/* --- header --- */}
        <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
            <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className='w-8 rounded-full' />
            <p className='text-lg text-white font-bold bg-gradient-to-r from-cyan-900 to-blue-950 px-4 py-1 rounded-full inline-flex items-center gap-2'>
                {selectedUser.fullName}
                {onlineUser.includes(selectedUser._id) && (
                    <span className='w-2 h-2 rounded-full bg-green-500'></span>
                )}
            </p>
            <img onClick={()=> setSelectedUser(null)}src={assets.arrow_icon} alt="" className='md:hidden max-w-7'/>
            <img src={assets.verified_icon} alt="" className='max-md:hidden max-w-5' />
        </div>
        {/*--- chat area ---*/}
        <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>

            {messages.map((msg, index)=>(
                <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId !== authUser._id && 'flex-row-reverse'}`}>
                    {msg.image ? (
                        <img src={msg.image} alt=""className='max-w-[230px] border
                        border-gray-700 rounded-lg overflow-hidden mb-8'/>
                    ) : (
                        <p className={`p-2 max-w-[200px] md:text-base font-light cursor-pointer transition-transform duration-200 transform hover:scale-110
                            rounded-lg mb-8 break-all bg-gradient-to-r from-cyan-900 to-blue-950 text-white ${msg.senderId === authUser._id
                            ? 'rounded-br-none' : 'rounded-bl-none'}`}>{msg.text}</p>
                    )}
                    <div className='text-center text-xs'>
                        <img src={msg.senderId === authUser._id ? authUser?.
                        profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon} 
                        alt="" className='w-7 rounded-full' />
                        <p className='text-black'>{formatMessageTime(msg.createdAt)}</p>
                    </div>
                </div>
            ))}

            {loadingImage && (
            <div className="flex items-end gap-2 justify-end mb-8">
                {/* Fancy animated image shimmer with floating loader */}
                <div className="relative w-[230px] h-[140px] rounded-xl border border-gray-600 overflow-hidden shadow-lg bg-gray-900">
                {/* Floating animated blobs */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-900 via-cyan-950 to-blue-950 animate-pulse opacity-70"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                    {/* Outer pulsating ring */}
                    <span className="absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75 animate-ping"></span>
                    {/* Central glowing dot */}
                    <span className="relative inline-flex rounded-full h-6 w-6 bg-orange-400 animate-bounce shadow-lg"></span>
                    </div>
                </div>
                </div>

                {/* Profile + sending label */}
                <div className="text-center text-xs">
                <img
                    src={authUser?.profilePic || assets.avatar_icon}
                    alt="Sending"
                    className="w-7 rounded-full"
                />
                <p className="text-white font-semibold animate-pulse">Sending...</p>
                </div>
            </div>
            )}

            <div ref={scrollEnd}></div>
        </div>

        {/*--- bottom area ---*/}
        <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>

            {/* Emoji Picker Dropdown */}
            {showEmojiPicker && (
                <div ref={emojiPickerRef} className="absolute bottom-14 left-3 z-50" onMouseLeave={() => setShowEmojiPicker(false)}>
                    <EmojiPicker onEmojiClick={handleEmojiClick} theme='dark' emojiStyle="native" customEmojiSize={32} />
                </div>
            )}

            <div className='flex-1 flex items-center bg-gradient-to-r from-cyan-900 to-blue-950 px-3 rounded-full'>
                <input onChange={(e)=> setInput(e.target.value)} value={input} onKeyDown={(e)=>e.key === "Enter" ? handleSendMessage(e) : null} 
                type="text" placeholder='Send a message' className='flex-1 text-sm p-3 border-none rounded-lg outline-none
                text-white placeholder-white'/>

                <div className="flex items-center gap-2">
                    <img src={assets.emoji_icon} alt="emoji" onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className='w-6 h-6 mr-2 cursor-pointer transition-transform duration-200 transform hover:scale-130'/>
                    <input onChange={handleSendImage} type="file" id='image' accept='image/png, image/jpeg, image/gif' hidden/>
                    <label htmlFor="image">
                        <img src={assets.gallery_icon} alt="" className='w-6 h-6 mr-2 cursor-pointer transition-transform duration-200 
                        transform hover:scale-130' />
                    </label>
                </div>

            </div>
            <img onClick={handleSendMessage} src={assets.send_button} alt="" className='w-8 h-8 cursor-pointer 
            transition-transform duration-200 transform hover:scale-130' />
        </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500
    bg-white/10 max-md:hidden'>
        <img src={assets.logo_new} className='w-[min(30vw,300px)] cursor-pointer 
        transition-transform duration-200 transform hover:scale-115' alt="" />
        <p className='text-lg font-medium text-white bg-gradient-to-r from-cyan-900 to-blue-950 px-3 rounded-full'>
        Chat Anytime, anywhere
        </p>
    </div>
  )
}

export default ChatContainer