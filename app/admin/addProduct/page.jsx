'use client'
import Image from 'next/image'
import React from 'react'
import { assets } from '@/Assets/assets'
import { useState } from 'react'

const page = () => {
  const [image, setImage] = useState(false)
  return (
    <>
    <form className='pt-5 px-5 sm:pt-12 sm:pl-16'>
      <p className='text-xl'>Upload thumbnail</p>
      <label htmlFor="image">
        <Image src={!image ? assets.upload_area : URL.createObjectURL(image)} alt='' width={140} height={700} className='mt-4'  />
      </label>
      <input type="file" name="" id="image" hidden required onChange={(e) => setImage(e.target.files[0])} />
      </form>
    </>
  )
}

export default page