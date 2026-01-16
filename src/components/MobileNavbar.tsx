'use client';
import Link from 'next/link';
import {
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaSearch,
  FaYoutube,
} from 'react-icons/fa';
// import { HiOutlineMenu } from 'react-icons/hi';
import {
  Sheet,
  SheetContent,
  // SheetDescription,
  // SheetHeader,
  // SheetTitle,
  SheetTrigger,
} from '@/shadcn_data/components/ui/sheet';

const MobileNavbar = () => {
  return (
    <Sheet>
      <SheetTrigger className="text-black sm:hidden">
        <FaSearch size={25} />
      </SheetTrigger>
      <SheetContent className="text-black">
        <div>
          <Link
            target="_blank"
            href="https://www.youtube.com/channel/UCtp_qdzendr0tf5_tpR9vPg"
            className="flex justify-center items-center gap-4 p-2.5"
          >
            <FaYoutube /> YouTube
          </Link>
        </div>
        <div>
          <Link
            target="_blank"
            href="https://www.facebook.com/Tellme360/"
            className="flex justify-center items-center gap-4 p-2.5"
          >
            <FaFacebook /> Facebook
          </Link>
        </div>
        <div>
          <Link
            target="_blank"
            href="https://www.instagram.com/tellme360/"
            className="flex justify-center items-center gap-4 p-2.5"
          >
            <FaInstagram /> Instagram
          </Link>
        </div>
        <div>
          <Link
            target="_blank"
            href="mailto:tellmedigi@outlook.com"
            className="flex flex-col justify-center items-center gap-2 p-2.5"
          >
            <FaEnvelope className="hidden" /> tellmedigi@outlook.com
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavbar;
