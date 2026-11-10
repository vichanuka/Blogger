'use client'
import React, { useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '@/Assets/assets';

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin/addProduct';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', formData);

      if (response.data.success) {
        toast.success(response.data.message || 'Login successful');
        router.push(callbackUrl);
        router.refresh();
      } else {
        toast.error(response.data.message || 'Login failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full max-w-[420px] bg-white border border-black shadow-[-8px_8px_0px_#000000] p-6 sm:p-8'>
      <div className='text-center mb-6'>
        <Link href='/' className='inline-block mb-4'>
          <Image src={assets.logo} alt='Blogger' width={140} priority />
        </Link>
        <h1 className='text-2xl font-bold text-gray-900'>Admin Portal</h1>
        <p className='text-sm text-gray-600 mt-1'>
          Log in to manage your blog and subscriptions
        </p>
      </div>

      <form onSubmit={onSubmitHandler} className='flex flex-col gap-4'>
        <div>
          <label className='block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1'>
            Admin Email
          </label>
          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={onChangeHandler}
            required
            placeholder='admin@example.com'
            className='w-full border border-black px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black'
          />
        </div>

        <div>
          <div className='flex justify-between items-center mb-1'>
            <label className='block text-xs font-semibold text-gray-700 uppercase tracking-wider'>
              Password
            </label>
            <button
              type='button'
              onClick={() => setShowPassword((prev) => !prev)}
              className='text-xs text-gray-500 hover:text-black cursor-pointer'
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            name='password'
            value={formData.password}
            onChange={onChangeHandler}
            required
            placeholder='••••••••'
            className='w-full border border-black px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black'
          />
        </div>

        <div className='bg-gray-50 border border-gray-200 p-3 text-xs text-gray-600 rounded'>
          <p className='font-medium text-gray-800 mb-0.5'>First-time admin setup?</p>
          Enter your desired email and password; your initial admin account will be created automatically.
        </div>

        <button
          type='submit'
          disabled={loading}
          className='w-full mt-2 bg-black text-white py-3 font-medium border border-black shadow-[-4px_4px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-60 cursor-pointer'
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className='mt-6 pt-4 border-t border-gray-200 text-center'>
        <Link
          href='/'
          className='text-xs font-medium text-gray-600 hover:text-black inline-flex items-center gap-1'
        >
          <span>&larr;</span> Back to Blog Home
        </Link>
      </div>
    </div>
  );
};

const LoginPage = () => {
  return (
    <div className='min-h-screen bg-slate-100 flex flex-col justify-center items-center px-4 py-12'>
      <Suspense fallback={<div className='p-8 text-center text-sm text-gray-600'>Loading portal...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
};

export default LoginPage;
