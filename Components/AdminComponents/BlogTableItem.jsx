import { assets } from '@/Assets/assets'
import Image from 'next/image'
import React from 'react'

const BlogTableItem = ({authorImg,title,author,date}) => {
    const BlogDate = new Date(date);
  return (
    <tr className='border-b bg-white'>
        <th scope='row' className='items-center gap-3 hidden sm:flex px-6 py-4 font-medium text-gray-900 whitespace-nowrap'>
            <Image src={authorImg?authorImg:assets.profile_icon} alt='author' width={40} height={40} />
            <p>{author}</p>
        </th>
        <td className='px-6 py-4'>
            {title?title:"No title"}
        </td>
        <td className='px-6 py-4'>
            {BlogDate.toDateString()}
        </td>
        <td className='px-12 py-4 cursor-pointer'>
             X
        </td>
    </tr>
  )
}

export default BlogTableItem