'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(prevState: any, formData: FormData) {
  const username = formData.get('username')
  const password = formData.get('password')

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1/admin";
  
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email: username, password })
    });

    if (res.ok) {
      const data = await res.json();
      const cookieStore = await cookies();
      
      cookieStore.set('admin_session', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      });

      cookieStore.set('admin_user_id', data.user.id.toString(), {
        httpOnly: false, // allow Client components to read user_id
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });
      
      cookieStore.set('admin_user_name', data.user.name, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });

      cookieStore.set('admin_user_roles', JSON.stringify(data.user.roles || []), {
         httpOnly: false, path: '/'
      });
      
      redirect('/')
    } else {
      const err = await res.json().catch(() => ({}));
      return { error: err.message || 'Tên đăng nhập hoặc mật khẩu không chính xác.' }
    }
  } catch (err) {
    if (err instanceof Error && err.message === 'NEXT_REDIRECT') {
      throw err; // Let Next.js handle redirect
    }
    return { error: 'Lỗi kết nối máy chủ.' }
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  redirect('/login');
}
