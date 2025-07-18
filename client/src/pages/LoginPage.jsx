import React, { useState, useContext } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext.jsx'

const LoginPage = () => {

  const [currState, setCurrState] = useState("Sign Up")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const {login} = useContext(AuthContext)

  const onSubmitHandler = (event)=> {
      event.preventDefault();

      if(currState === 'Sign Up' && !isDataSubmitted){
        setIsDataSubmitted(true)
        return;
      }

      login(currState==="Sign Up" ? 'signup' : 'login', {fullName, email, password, bio})
  }

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center
    justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-md'>
        
        {/*--- left ---*/}
        <img src={assets.logo_new} alt="" className='w-[min(30vw,400px)] transition-transform duration-200 transform hover:scale-130' />

        {/*--- right ---*/}
        <form onSubmit={onSubmitHandler} className='border-2 bg-white/8 text-black border-blue-950 p-6 flex
        flex-col gap-6 rounded-lg shadow-lg'>
          <h2 className='font-medium text-2xl flex justify-between items-center'>
            {currState}

            {isDataSubmitted && <img onClick={()=>setIsDataSubmitted(false)} src={assets.arrow_icon} alt="" 
            className='w-5 cursor-pointer' />}
          </h2>

          {currState === "Sign Up" && !isDataSubmitted && (
            <input onChange={(e)=>setFullName(e.target.value)} value={fullName}
            type="text" className='bg-orange-50 p-2 border border-blue-950 rounded-md
            focus:outline-none focus:ring-2 focus:ring-amber-500' placeholder='Full Name' required/>
          )}

          {!isDataSubmitted && (
            <>
              <input onChange={(e)=>setEmail(e.target.value)} value={email} 
              type="email" placeholder='Email Address' required className='bg-orange-50 p-2
              border border-blue-950 rounded-md focus:outline-none focus:ring-2
              focus:ring-amber-500' />

              <input onChange={(e)=>setPassword(e.target.value)} value={password} 
              type="password" placeholder='Password' required className='bg-orange-50 p-2
              border border-blue-950 rounded-md focus:outline-none focus:ring-2
              focus:ring-amber-500' />
            </>
          )}

          {
            currState === "Sign Up" && isDataSubmitted && (
              <textarea onChange={(e)=>setBio(e.target.value)} value={bio}
              rows={4} className='bg-orange-50 p-2 border border-gray-500 rounded-md
              focus:outline-none focus:ring-2 focus:ring-amber-500'
              placeholder='write a short bio here...' required>
              </textarea>
            )
          }

          <button className='transition-transform duration-200 hover:scale-110
          bg-gradient-to-r from-yellow-400 to-orange-600 text-black font-bold border-2 text-md py-1 px-20 
          rounded-full cursor-pointer hover:bg-white hover:from-white hover:to-orange-50 hover:text-black'>
            {currState === "Sign Up" ? "Create Account" : "Login Now"}
          </button>

          <div className='flex items-center gap-2 text-sm text-black'>
            <input type="checkbox" />
            <p>Agree to the terms of use & privacy policy</p>
          </div>

          <div className='flex flex-col gap-2'>
            {currState === "Sign Up" ? (
              <p className='text-sm text-black'>Already have an account ? 
              <span onClick={()=>{setCurrState("Login"); setIsDataSubmitted(false)}} 
              className='font-bold text-red-600 cursor-pointer px-2'>  Login here</span></p>
            ) : (
              <p className='text-sm text-black'>Create an account ?
              <span onClick={()=>setCurrState("Sign Up")}
              className='font-bold text-red-600 cursor-pointer px-2'> Click here</span></p>
            )}
          </div>

        </form>
    </div>
  )
}

export default LoginPage