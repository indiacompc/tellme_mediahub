'use client';
import Link from 'next/link';
import { FaEnvelope } from 'react-icons/fa';
import { Moon, Sun } from 'lucide-react';
import Image, { StaticImageData } from 'next/image';
import { cn } from '@/shadcn_data/lib/utils';
import { Suspense } from 'react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
// import MobileNavbar from './MobileNavbar';
// import MobileNavbar from "./MobileNavbar";
// import { Suspense } from "react";
// import dynamic from "next/dynamic";

// const MobileNavbar = dynamic(() => import('./MobileNavbar'), {
//   ssr: false
// })

const Navbar = ({ tellme_logo }: { tellme_logo: StaticImageData }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // const pathname = usePathname();
  return (
    <header
      className={cn(
        'w-full py-2 px-4 sm:px-20 text-white bg-transparent',
        // pathname === "/video_background"
        //   ? "absolute z-10 top-0 left-0"
        //   : undefined,
      )}
    >
      <div className="sm:container sm:mx-auto flex justify-between items-center gap-5">
        <Link href="/" className="flex flex-col justify-center items-center">
          <Image
            src={tellme_logo}
            alt="tellme logo"
            className="my-1 w-24 h-auto sm:w-40"
            priority={true}
          />
        </Link>

        {/* <div className="hidden rounded-lg sm:flex justify-center items-center my-2.5 px-2.5">
          <form action="/search/videos" method="get">
            <fieldset>
              <div className="flex justify-center items-center gap-0">
                <input
                  type="text"
                  id="search-input-desktop"
                  name="query"
                  className="form-input border-r-0 w-full h-10 rounded-l-full px-4 py-2 text-black"
                  required
                  placeholder="Search Footage"
                />
                <button
                  type="submit"
                  className="form-input border-l-0 text-black h-10 rounded-r-full flex justify-center items-center"
                >
                  <FaSearch size={20} />
                </button>
              </div>
            </fieldset>
          </form>
          <div className="h-full flex">
            <Link
              target="_blank"
              href="mailto:tellmedigi@outlook.com"
              className="flex justify-center items-center text-black gap-2 p-2.5"
            >
              <FaEnvelope size={20} />
            </Link>
          </div>
        </div> */}
		<div className="h-full flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex justify-center items-center text-white hover:text-gray-300 transition-colors gap-2 p-2.5 rounded-lg hover:bg-white/10"
              aria-label="Toggle theme"
            >
              {mounted ? (
                theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            {/* <Link
              target="_blank"
              href="mailto:tellmedigi@outlook.com"
              className="flex justify-center items-center text-white hover:text-gray-300 transition-colors gap-2 p-2.5 rounded-lg hover:bg-white/10"
            >
              <FaEnvelope size={20} />
            </Link> */}
          </div>

        {/* <Suspense>
          <div className="flex sm:hidden">
            <MobileNavbar />
            <Link
              target="_blank"
              href="mailto:tellmedigi@outlook.com"
              className="flex justify-center items-center text-black gap-2 p-2.5"
            >
              <FaEnvelope size={20} />
            </Link>
          </div>
        </Suspense> */}
      </div>
    </header>
  );
};

export default Navbar;
