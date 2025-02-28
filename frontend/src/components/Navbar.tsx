import { useState } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navigation = [
  { name: "Home", href: "/", current: true },
  { name: "Guides", href: "/guides", current: false },
  { name: "About", href: "/about", current: false },
  { name: "Contact", href: "/contact", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = () => {
  const [isToursOpen, setIsToursOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth(); // Get the user and logout function from AuthContext

  return (
    <Disclosure
      as="nav"
      className="bg-green-800 py-1 z-[1000] fixed top-0 left-0 w-full"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="relative inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-green-700 hover:text-gray-300 focus:ring-2 focus:ring-white">
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              <XMarkIcon className="hidden h-6 w-6" aria-hidden="true" />
            </DisclosureButton>
          </div>

          {/* Logo and desktop menu */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            {/* Logo - Hidden on small screens, visible on medium and larger screens */}
            <div className="flex-shrink-0 hidden sm:block">
              <span className="text-white text-2xl font-bold tracking-wide">
                South Sudan Horizons
              </span>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      item.current
                        ? "bg-green-900 text-white"
                        : "text-white hover:bg-green-700 hover:text-gray-300",
                      "rounded-md px-4 py-2 text-sm font-medium transition-all duration-200"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Tours Dropdown (Desktop) */}
                <div
                  className="relative"
                  onMouseEnter={() => setIsToursOpen(true)}
                  onMouseLeave={() => setIsToursOpen(false)}
                >
                  <button className="flex items-center text-white hover:bg-green-700 hover:text-gray-300 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 z-50">
                    Tours
                    <ChevronDownIcon className="ml-1 h-4 w-4" />
                  </button>
                  {isToursOpen && (
                    <div className="absolute left-0 mt-2 w-48 origin-top-left rounded-md bg-white py-2 shadow-lg ring-1 ring-black/5 transition-all duration-200">
                      <Link
                        to="/tours/all"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        All Tours
                      </Link>
                      <Link
                        to="/tours/adventure"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Adventure Tours
                      </Link>
                      <Link
                        to="/tours/cultural"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Cultural Tours
                      </Link>
                      <Link
                        to="/tours/wildlife"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Wildlife Tours
                      </Link>
                      <Link
                        to="/tours/nature"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Nature Tours
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right-side buttons (Desktop) */}
          <div className="absolute inset-y-0 right-0 flex items-center space-x-4 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {user ? (
              <>
                {/* Display the user's name */}
                <span className="text-white font-medium">{user.fullName}</span>

                <button className="relative rounded-full bg-green-600 p-1 text-white hover:text-gray-300 focus:ring-2 focus:ring-white z-50">
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                  <span className="absolute top-0 right-0 bg-red-500 text-xs text-white rounded-full px-1 py-0.15">
                    3
                  </span>
                </button>

                {/* Profile Dropdown (Desktop) */}
                <div
                  className="relative"
                  onMouseEnter={() => setIsProfileOpen(true)}
                  onMouseLeave={() => setIsProfileOpen(false)}
                >
                  <button className="relative flex rounded-full bg-green-600 text-sm focus:ring-2 focus:ring-white focus:outline-none transition-all duration-200">
                    <img
                      className="h-9 w-9 rounded-full"
                      src="https://i.pravatar.cc/150?img=3"
                      alt="User Avatar"
                    />
                  </button>
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-black/5 transition-all duration-200 z-50">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile & Bookings
                      </Link>
                      <button
                        onClick={logout}
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Show login and register buttons if the user is not logged in */}
                <Link
                  to="/login"
                  className="px-4 py-1 bg-white text-green-800 rounded-lg shadow-md hover:bg-gray-100 transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-1 border border-green-400 text-white rounded-lg shadow-md hover:bg-green-500 hover:text-white transition-all duration-200"
                >
                  Register
                </Link>
              </>
            )}

            {/* Language Dropdown (Desktop) */}
            <div
              className="relative"
              onMouseEnter={() => setIsLanguageOpen(true)}
              onMouseLeave={() => setIsLanguageOpen(false)}
            >
              <button className="flex items-center text-white hover:bg-green-700 hover:text-gray-300 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 z-50">
                English
                <ChevronDownIcon className="ml-1 h-4 w-4" />
              </button>
              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-24 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-black/5 transition-all duration-200">
                  <button className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    English
                  </button>
                  <button className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Arabic
                  </button>
                  <button className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    French
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu (DisclosurePanel) */}
      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as={Link}
              to={item.href}
              className={classNames(
                item.current
                  ? "bg-green-900 text-white"
                  : "text-white hover:bg-green-700 hover:text-gray-300",
                "block rounded-md px-3 py-2 text-base font-medium transition-all duration-200"
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}

          {/* Tours Dropdown (Mobile) */}
          <DisclosureButton
            as="div"
            className="text-white hover:bg-green-700 hover:text-gray-300 rounded-md px-3 py-2 text-base font-medium transition-all duration-200"
          >
            <button
              onClick={() => setIsToursOpen(!isToursOpen)}
              className="flex items-center w-full justify-between"
            >
              Tours
              <ChevronDownIcon
                className={`h-5 w-5 transition-transform ${
                  isToursOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isToursOpen && (
              <div className="mt-2 space-y-1">
                <Link
                  to="/tours/all"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  All Tours
                </Link>
                <Link
                  to="/tours/adventure"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Adventure Tours
                </Link>
                <Link
                  to="/tours/cultural"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Cultural Tours
                </Link>
                <Link
                  to="/tours/wildlife"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Wildlife Tours
                </Link>
                <Link
                  to="/tours/nature"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Nature Tours
                </Link>
              </div>
            )}
          </DisclosureButton>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
};

export default Navbar;
