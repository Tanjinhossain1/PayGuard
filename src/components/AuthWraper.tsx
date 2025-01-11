'use client'
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

export default function AuthWraper({children}:{
    children: React.ReactNode;
  }) {
    const router = useRouter()
    
      useEffect(() => {
        const fetchUser = async () => {
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
             console.log('user ', user)
          } else {
            router.push('/login')
          }
        }
        fetchUser()
      }, [router])
  return (
   children
  )
}
