'use client'
import Image from 'next/image';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '@/Assets/assets';

const Page = () => {
  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    title: '',
    description: '',
    category: 'Startup',
    author: 'Unknown',
    authorImg: '/author_img.png',
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error('Please upload a blog thumbnail');
      return;
    }

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('author', data.author);
    formData.append('author_img', data.authorImg);
    formData.append('image', image);

    try {
      const response = await axios.post('/api/blog', formData);

      if (response.data.success) {
        toast.success(response.data.message);
        setImage(false);
        setData({
          title: '',
          description: '',
          category: 'Startup',
          author: 'Unknown',
          authorImg: '/author_img.png',
        });
        
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <>
    <form onSubmit={onSubmitHandler} className='pt-5 px-5 sm:pt-12 sm:pl-16'>
      <p className='text-xl'>Upload thumbnail</p>
      <label htmlFor="image">
        <Image src={!image ? assets.upload_area : URL.createObjectURL(image)} alt='' width={140} height={700} className='mt-4'  />
      </label>
      <input type="file" name="" id="image" hidden required onChange={(e) => setImage(e.target.files[0])} />
      <p className='text-xl mt-4'>Blog Title</p>
      <input type="text" name="title" onChange={onChangeHandler} value={data.title} placeholder='Enter blog title' className='border w-full sm:w-[500px] mt-4 px-4 py-3' required />

      <p className='text-xl mt-4'>Blog Description</p>
      <textarea name="description" onChange={onChangeHandler} value={data.description} placeholder='Enter blog content here.' className='border w-full sm:w-[500px] mt-4 px-4 py-3' rows={6} required ></textarea>

      <p className='text-xl mt-4'>Blog Category</p>
      <select  name="category" onChange={onChangeHandler} value={data.category} className='w-40 mt-4 px-4 py3 border text-gray-500'>
        <option value="Startup">Startup</option>
        <option value="technology">Technology</option>
        <option value="lifestyle">Lifestyle</option>
      </select>
      <br></br>
    
      <button type="submit" className=' h-12 bg-black text-white mt-8 w-40 flex items-center justify-center '>ADD</button>
    </form>
  </>
  )
}

export default Page