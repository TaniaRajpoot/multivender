import React, { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios"
import { server } from '../../server';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${server}/user/login-user`, {
      email,
      password,
    }, { withCredentials: true }).then(() => {
      toast.success("Login Success!")
      navigate("/");
      window.location.reload();
    }).catch((err) => {
      toast.error(err.response.data.message);
    })
  }

  return (
    <div className='min-h-screen bg-[#EDE7E3] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden'>
      {/* Abstract Background Decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#16697A]/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FFA62B]/5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

      <div className='sm:mx-auto sm:w-full sm:max-w-md relative z-10'>
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-white rounded-3xl shadow-soft flex items-center justify-center group hover:rotate-12 transition-transform duration-500">
            <svg className="w-12 h-12 text-[#16697A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#FFA62B] rounded-lg shadow-lg border-4 border-white group-hover:scale-125 transition-transform" />
          </div>
        </div>
        <h2 className='text-center text-2xl font-[700] text-[#16697A] tracking-tight font-display italic'>
          Login to your account
        </h2>
      </div>

      <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-[440px] relative z-10'>
        <div className='bg-white/70 backdrop-blur-xl py-12 px-8 shadow-3xl sm:rounded-[40px] border border-white'>
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className='block text-xs font-black text-[#16697A] uppercase tracking-widest mb-3 ml-1'>
                Email Address
              </label>
              <div className='relative'>
                <input
                  type="email"
                  name="email"
                  autoComplete='email'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='appearance-none block w-full px-6 py-4 bg-[#EDE7E3]/50 border border-transparent rounded-2xl placeholder-[#9CA3AF] text-[#16697A] font-[500] focus:outline-none focus:ring-1 focus:ring-[#16697A]/20 focus:bg-white transition-all shadow-inner font-sans'
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3 ml-1">
                <label htmlFor="password" className='block text-xs font-black text-[#16697A] uppercase tracking-widest'>
                  Password
                </label>
                <a href="#" className='text-xs font-bold text-[#489FB5] hover:text-[#FFA62B] transition-colors'>
                  Forgot?
                </a>
              </div>
              <div className='relative'>
                <input
                  type={visible ? "text" : "password"}
                  name="password"
                  autoComplete='current-password'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='appearance-none block w-full px-6 py-4 bg-[#EDE7E3]/50 border border-transparent rounded-2xl placeholder-[#9CA3AF] text-[#16697A] font-[500] focus:outline-none focus:ring-1 focus:ring-[#16697A]/20 focus:bg-white transition-all shadow-inner font-sans'
                  placeholder="••••••••"
                />
                <div className='absolute inset-y-0 right-0 pr-6 flex items-center'>
                  {visible ? (
                    <AiOutlineEye
                      className='cursor-pointer text-[#489FB5] hover:text-[#16697A] transition-colors'
                      size={22}
                      onClick={() => setVisible(false)}
                    />
                  ) : (
                    <AiOutlineEyeInvisible
                      className='cursor-pointer text-[#489FB5] hover:text-[#16697A] transition-colors'
                      size={22}
                      onClick={() => setVisible(true)}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className='flex items-center'>
              <input type="checkbox" name='remember-me' id="remember-me"
                className='h-5 w-5 text-[#16697A] focus:ring-[#16697A] border-[#EDE7E3] rounded-lg transition-all cursor-pointer'
              />
              <label htmlFor="remember-me" className='ml-3 block text-sm text-[#6B7280] font-[500] cursor-pointer font-sans'>
                Remember me
              </label>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full h-16 flex justify-center items-center py-4 px-8 bg-[#16697A] text-[#EDE7E3] text-[13px] uppercase tracking-[0.2em] font-[700] rounded-2xl hover:bg-[#FFA62B] transition-all duration-500 shadow-xl font-sans">
                Submit
              </button>
            </div>

            <div className="pt-6 border-t border-[#EDE7E3] text-center">
              <span className="text-[#6B7280] font-[500] text-sm font-sans">Not have any account?</span>
              <Link to="/sign-up" className='text-[#489FB5] font-[700] hover:text-[#16697A] transition-colors ml-1 border-b-2 border-transparent hover:border-[#16697A] pb-1 font-sans'>
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login