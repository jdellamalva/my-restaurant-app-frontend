'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppContext } from '../context/AppContext';

export default function Navigation() {
    const { searchTerm, setSearchTerm, user, logout } = useAppContext();
    const pathname = usePathname();
    const router = useRouter();

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const getUserName = (email) => {
        return email.split('@')[0];
    };

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const showSearchInput = pathname === '/' || pathname.startsWith('/restaurant');

    return (
        <nav className="container mx-auto flex justify-between items-center p-6 px-4">
            <div className="flex items-center xl:w-1/3">
                <Link
                    className="block text-lg max-w-max text-coolGray-500 hover:text-coolGray-900 font-medium"
                    href="/"
                >
                    Giuseppe&apos;s
                </Link>
            </div>

            {showSearchInput && (
                <div className="flex-grow px-4">
                    <input
                        className="appearance-none block w-full p-3 leading-5 text-black border border-coolGray-200 rounded-lg shadow-md placeholder-text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
            )}

            <div className="flex items-center justify-end xl:w-1/3 space-x-4">
                {user ? (
                    <>
                        <span className="text-lg text-coolGray-500 font-medium">
                            Welcome, {getUserName(user.email)}
                        </span>
                        <Link
                            className="text-coolGray-500 hover:text-coolGray-900 font-medium"
                            href="/account"
                        >
                            Account
                        </Link>
                        <button
                            className="inline-block py-2 px-4 text-sm leading-5 text-green-50 bg-green-500 hover:bg-green-600 font-medium focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-md"
                            onClick={handleLogout}
                        >
                            Log Out
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            className="inline-block py-2 px-4 mr-2 leading-5 text-coolGray-500 hover:text-coolGray-900 bg-transparent font-medium rounded-md"
                            href="/login"
                        >
                            Log In
                        </Link>
                        <Link
                            className="inline-block py-2 px-4 text-sm leading-5 text-green-50 bg-green-500 hover:bg-green-600 font-medium focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-md"
                            href="/register"
                        >
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}