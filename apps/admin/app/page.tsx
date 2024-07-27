"use client"
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from '@mui/material/Button';
import { FiAlignLeft } from "react-icons/fi";


export default function Home() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { data: session } = useSession();
  const menuItems = [
    "Log In",
    "Log Out",
    "USER",
  ];
 
  const handleMenuClick = (item: string) => {
    if (item === "Log Out") {
      signOut({ callbackUrl: `${process.env.ADMIN_URL}`});
    } else if (item === "Log In") {
      signIn();
    }
    else if(item==="USER"){
      router.push(`${process.env.NEXT_PUBLIC_USER_URL}`);
    }
  }
  const handleClick = () => {
    router.push(`${process.env.NEXT_PUBLIC_USER_URL}`);
  };
  return (
    <div>
<nav className="flex flex-wrap items-center justify-between p-3 bg-[#eeeee9]">
  <div className="flex items-center justify-between w-full sm:w-auto">
    <button
      aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      className="sm:hidden focus:outline-none"
      onClick={() => setIsMenuOpen(!isMenuOpen)}
    >
      <FiAlignLeft className="w-6 h-6 text-gray-800" />
    </button>
    <div className="flex items-center">
      <p className="font-bold text-gray-900 ml-2">GDSC</p>
    </div>
  </div>

  <div className={`sm:flex gap-4 ${isMenuOpen ? 'block' : 'hidden'}`}>
    <a href="#" className="block mt-4 sm:inline-block font-semibold justify-between sm:mt-0 text-gray-900  hover:text-cyan-600 transition duration-300 ease-in-out">To be added</a>
    <a href="#" aria-current="page" className="block mt-4 font-semibold sm:inline-block sm:mt-0 text-gray-900  hover:text-cyan-600 transition duration-300 ease-in-out">To be added</a>
  </div>

  <div className="hidden sm:flex items-center justify-end mx-2 ">
  <Button variant="contained" className="px-4 mx-2 py-2 bg-[#de8cde] text-white"  onClick={handleClick}>User Login</Button>
  {session ? (
          <Button variant="contained" className="px-4 py-2 bg-[#de8cde] text-white" onClick={async () => { signOut({ callbackUrl: `${process.env.NEXT_PUBLIC_ADMIN_URL}`}) }}>Sign-Out</Button>
        ) : (
          <Button variant="contained" className="px-4 py-2 mx-2 bg-[#de8cde] text-white" onClick={async () => { signIn() }}>Sign-In</Button>
        )}
  <Button variant="contained" className="px-4 py-2 bg-[#de8cde] 500 text-white" onClick={async()=>{router.push("/sign-up")}}>Sign-Up</Button>
  </div>
 

  <div className={`w-full sm:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>

    {menuItems.map((item, index) => (
      <a
        key={`${item}-${index}`}
        href="#"
        onClick={() => handleMenuClick(item)}
        className={`block w-full px-4 py-2 text-lg ${
          index === 2 ? "text-blue-600" : index === menuItems.length - 1 ? "text-red-600" : "text-gray-900"
        } hover:bg-gray-100`}
      >
        {item}
      </a>
    ))}
  </div>
</nav>
<h1>This is ADMIN Page</h1>
</div>
  );

}
