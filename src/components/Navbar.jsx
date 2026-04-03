import React, { useState } from 'react';
import { Icon,CircleUserRound, Heart, House, HouseHeart, X, Menu, Search } from "lucide-react";
import {Link , useLocation} from "react-router-dom";
const Navbar = () => {
    const location = useLocation();
    const pathname = location.pathname;
    const [menuOpen, setMenuOpen] = useState(false)
     const navLinks =[
        {href: "/", label:"Home" , icon: HouseHeart},
        {href:"/favorite", label:"Favorite", icon: Heart},
        {href:"/decouverte" , label:"Discovery" , icon: Search},
        {href:"/profile", label:"Profil", icon:CircleUserRound}

     ]

      const renderLinks = (baseClass) => (
        <>
            {navLinks.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href
                const activeClass = isActive ? 'btn-primary' : 'btn-ghost'
                return (
                    <Link
                        to={href}
                        key={href}
                        onClick={() => setMenuOpen(false)}
                        className={`${baseClass} ${activeClass} btn-sm flex gap-2 items-center`}
                    >
                        <Icon className='w-4 h-4' />
                        {label}
                    </Link>
                )

            })}
        </>
        )
    return(
        <div className='border-b border-base-300 px-5 md:px-[10%] py-4 relative'>
            <div className='flex justify-between items-center'>
                <div className='flex items-center p-2 '>
                        <House className='w-6 h-6 text-primary' />
                        <span className='font-bold  text-xl ml-2'>
                            DreamHouse
                         </span>
                    
                    </div>

                    <button
                        className='btn w-fit sm:hidden btn-sm'
                        onClick={() => setMenuOpen(!menuOpen)}
                     >
                    <Menu className='w-4 h-4' />
                </button>

                <div className='hidden space-x-2 sm:flex items-center'>
                    {renderLinks("btn")}
                    
                </div>
            </div>

            <div className={`absolute top-0 w-full bg-base-100 h-screen flex flex-col gap-2 p-4 
                transition-all duration-300 sm:hidden z-50 ${menuOpen ? "left-0" : "-left-full"} `}>
                <div className='flex justify-between'>
                   
                    <button
                        className='btn w-fit sm:hidden btn-sm'
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <X className='w-4 h-4' />
                    </button>
                </div>
                {renderLinks("btn")}
            </div>

        </div>
    )
}
export default Navbar;