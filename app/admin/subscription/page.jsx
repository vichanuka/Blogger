'use client'
import React from 'react'
import SubsTableItem from '@/Components/AdminComponents/SubsTableItem'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const Page = () => {
  const [emails, setEmails] = useState([]);

  const fetchEmails = async () => {
    const response = await axios.get('/api/email');
    setEmails(response.data.emails);
  }

const deleteEmail = async (mongoId) => {
  try {
    const response = await axios.delete('/api/email', {
      params: { id: mongoId }
    })
    toast.success(response.data.message)
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to delete subscription")
  } finally {
    await fetchEmails()
  }
}

  useEffect(() => {
    fetchEmails();
  }, []);

  return (
    <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16'>
      <h1>All Subscriptions</h1>
      <div className='relative max-w-[600px] h-[80vh] overflow-x-auto mt-4 border border-gray-400 scrollbar-hide'>
      <table className='w-full text-sm text-gray-500'>
        <thead className='text-xs text-left text-gray-700 uppercase bg-gray-50'>
          <tr>
            <th scope='col' className='px-6 py-3'>
              Email Subscriptions
            </th>

            <th scope='col' className='hidden sm:block px-6 py-3'>
              Date
            </th>

            <th scope='col' className='px-6 py-3'>
              Action
            </th>
          </tr>

        </thead>
        <tbody>
          {emails.map((item) => (
            <SubsTableItem key={item._id} mongoId={item._id} deleteEmail={deleteEmail} email={item.email} date={item.date}/>
          
          ))}
        </tbody>

      </table>

      </div>
    </div>
  )
}

export default Page