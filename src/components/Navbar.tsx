'use client';
import { cn } from '@/shadcn_data/lib/utils';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';

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
				'w-full px-4 py-2 text-white sm:px-20',
				mounted && theme === 'dark' ? 'bg-white/10' : 'bg-black/10'
				// pathname === "/video_background"
				//   ? "absolute z-10 top-0 left-0"
				//   : undefined,
			)}
		>
			<div className='flex items-center justify-between gap-5 sm:container sm:mx-auto'>
				<Link href='/' className='flex flex-col items-center justify-center'>
					<Image
						src={tellme_logo}
						alt='tellme logo'
						className='my-1 h-auto w-24 sm:w-40'
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
              href="mailto:digital@tellmedigi.com"
              className="flex justify-center items-center text-black gap-2 p-2.5"
            >
              <FaEnvelope size={20} />
            </Link>
          </div>
        </div> */}
				<div className='flex h-full items-center gap-3'>
					<button
						onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
						className='hover:text-foreground flex items-center justify-center gap-2 rounded-lg p-2.5 text-white transition-colors hover:bg-white/10'
						aria-label='Toggle theme'
					>
						{mounted ? (
							theme === 'dark' ? (
								<Sun className='h-5 w-5' />
							) : (
								<Moon className='h-5 w-5' />
							)
						) : (
							<Moon className='h-5 w-5' />
						)}
					</button>
					<Link
						target='_blank'
						href='mailto:digital@tellmedigi.com'
						className='hover:text-foreground flex items-center justify-center gap-2 rounded-lg p-2.5 text-white transition-colors hover:bg-white/10'
					>
						<FaEnvelope size={20} />
					</Link>
				</div>
			</div>
		</header>
	);
};

export default Navbar;
