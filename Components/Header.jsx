'use client'

import { assets } from "@/Assets/assets";
import Image from "next/image";
import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";

const Header = () => {
const[email,setEmail] = useState("");
const onSubmitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('email', email);
    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || data.error || 'Unable to subscribe');
      }

      toast.success(data.message);
      setEmail("");
    } catch (error) {
      toast.error(error.message || 'Unable to subscribe');
    }
  }

  return (
    <div className="py-5 px-5 md:px-12 lg:px-28">
      <div className="flex justify-between items-center">
        <Image
          src={assets.logo}
          alt=""
          width={180}
          className="w-[130px] sm:w-auto"
        />
        <button
          className="flex items-center gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-solid
            border black shadow-[-7px_7px_0px_#000000]"
        >
          Get Started <Image src={assets.arrow} alt="" />
        </button>
      </div>
      <div className="text-center my-8">
        <h1 className="text-3xl sm:test-5xl font-medium">Latest Blogs</h1>
        <p className=" mt-10 max-w-[740px] m-auto text-xs sm:test-base">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Earum quod necessitatibus et, autem aut alias rem velit, corrupti nobis voluptatibus beatae. Sit, blanditiis. A ipsa perspiciatis iusto eligendi libero iure?</p>
        <form onSubmit={onSubmitHandler} className="flex justify-between max-w-[500px] scale-75 sm:scale-100 mx-auto mt-10
        border border-black shadow-[-7px_7px_0px_#000000]">
            <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder="Enter your email" className="pl-4 outline-none"/>
            <button type="submit" className="border-l border-black py-4 px-4 sm:px-8 active:bg-gray-600 active:text-white">Subscribe</button>
        </form>
      </div>
    </div>
  );
};

export default Header;
