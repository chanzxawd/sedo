import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faUpload } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav>
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="block w-auto h-8">
              <Image
                src="/imgs/icon.webp"
                alt="Sedo"
                width={50}
                height={50}
                className="h-8 w-auto"
              />
            </Link>
          </div>
          

          {/* Menu Links */}
          <div className="hidden translate-x-[40rem] sm:flex space-x-4">
            <Link href="/upload" className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center">
              <FontAwesomeIcon icon={faUpload} className="mr-2" />
              Upload
            </Link>
            <Link href="/profile" className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center">
              <FontAwesomeIcon icon={faUserCircle} className="mr-2" />
              Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
