'use client';

import { useActionState } from 'react';
import { login } from './actions';

export default function LoginPage() {
  const [state, action, isPending] = useActionState(login, null)

  return (
    <div className="absolute inset-0 bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')" }}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
      
      <div className="relative sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white py-12 px-8 shadow-2xl rounded-[8px] sm:px-10 border border-slate-100/20">
          <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
            <div className="w-16 h-16 bg-primary rounded-[8px] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
              <span className="material-symbols-outlined text-white text-3xl">real_estate_agent</span>
            </div>
            <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-800 tracking-tight">
              Đăng nhập hệ thống
            </h2>
            <p className="mt-2 text-center text-sm text-slate-500">
              Dashboard - CMS Xây Dựng & BĐS
            </p>
          </div>

          <form action={action} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700">
                Tên đăng nhập
              </label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 text-lg">person</span>
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-[8px] shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors duration-200"
                  placeholder="Nhập tên đăng nhập"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Mật khẩu
              </label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 text-lg">lock</span>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-[8px] shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors duration-200"
                  placeholder="Nhập mật khẩu"
                />
              </div>
            </div>

            {state?.error && (
              <div className="bg-red-50 p-4 rounded-[8px] flex items-start">
                <span className="material-symbols-outlined text-red-400 mr-2 text-xl">error</span>
                <p className="text-sm text-red-600 font-medium">{state.error}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-[8px] shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
              >
                <div className="absolute inset-0 w-full h-full bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out"></div>
                <span className="relative flex items-center">
                  {isPending ? 'Đang xác thực...' : 'Đăng nhập'}
                  {!isPending && <span className="material-symbols-outlined ml-2 text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
