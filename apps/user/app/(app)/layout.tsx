'use client';
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { useState } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { data: session } = useSession();

  return (
    <>
      <nav className='fixed top-0 left-0 z-50 w-full bg-white border-b border-gray-200'>
        <div className='px-3 py-3 lg:px-5 lg:pl-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center justify-start'>
              <Link href='/dashboard' className='flex ml-2 md:mr-24'>
                <span className='self-center text-xl font-semibold sm:text-2xl'>
                  Project
                </span>
              </Link>
            </div>
            <div className='flex items-center sm:hidden'>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className='text-gray-900 focus:outline-none'>
                {isMenuOpen ? <FaTimes className='h-6 w-6' /> : <FaBars className='h-6 w-6' />}
              </button>
            </div>
            <div className='hidden sm:flex gap-4 mr-7'>
              <Link href="/dashboard" className="font-semibold text-gray-900 hover:text-cyan-600 transition duration-300 ease-in-out">Dashboard</Link>
              <Link href="/addProject" className="font-semibold text-gray-900 hover:text-cyan-600 transition duration-300 ease-in-out">Add Project</Link>
              <Link href="/messages" className="font-semibold text-gray-900 hover:text-cyan-600 transition duration-300 ease-in-out">Messages</Link>
            </div>
            <div className='flex items-center'>
              <div className='relative items-center ml-3'>
                <div>
                  <button
                    onClick={() => setShowDropdown(prevState => !prevState)}
                    type='button'
                    className='flex'
                  >
                    <span className='sr-only'>Open user menu</span>
                    <FaUserCircle className='h-5 w-5' />
                  </button>
                </div>
                {showDropdown && session && (
                  <div className='z-50 right-0 absolute my-4 text-base bg-white divide-y divide-gray-100 rounded shadow'>
                    <div className='px-4 py-3'>
                      <p className='text-sm text-gray-900'>
                        {session.user?.name}
                      </p>
                      <p className='text-sm text-gray-900 font-medium truncate'>
                        {session.user?.email}
                      </p>
                    </div>
                    <button
                      onClick={() => signOut()}
                      className='block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className='sm:hidden'>
            <div className='flex flex-col items-start px-3 py-2'>
              <Link href="/dashboard" className="block mt-2 font-semibold text-gray-900 hover:text-cyan-600 transition duration-300 ease-in-out">Dashboard</Link>
              <Link href="/addProject" className="block mt-2 font-semibold text-gray-900 hover:text-cyan-600 transition duration-300 ease-in-out">Add Project</Link>
              <Link href="/integrations" className="block mt-2 font-semibold text-gray-900 hover:text-cyan-600 transition duration-300 ease-in-out">Integrations</Link>
            </div>
          </div>
        )}
      </nav>
      {children}
    </>
  );
}
