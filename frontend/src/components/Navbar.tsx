import { useState, useEffect } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { API_BASE_URL, BASE_URL } from "../utils/api";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const navigation = [
  { name: "Home", href: "/", current: true },
  { name: "Guides", href: "/guides", current: false },
  { name: "About", href: "/about", current: false },
  { name: "Contact", href: "/contact", current: false },
];

const Navbar = () => {
  const [isToursOpen, setIsToursOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const navigate = useNavigate();

  const getInitials = (name: string): string => {
    const names = name.split(" ");
    const initials = names.map((n) => n[0]).join("");
    return initials.toUpperCase().slice(0, 2);
  };

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (user) {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          setProfilePicture(null);
          return;
        }

        try {
          const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch profile");
          }

          const data = await response.json();
          console.log("Fetched profile data:", data);
          setProfilePicture(
            data.profilePicture ? `${BASE_URL}${data.profilePicture}` : null
          );
        } catch (error) {
          console.error("Error fetching profile picture:", error);
          setProfilePicture(null);
        }
      } else {
        setProfilePicture(null);
      }
    };

    fetchProfilePicture();
  }, [user]);

  const handleLogout = () => {
    logout();
    setProfilePicture(null);
    navigate("/login");
  };

  const debounce = (func: () => void, delay: number) => {
    let timer: ReturnType<typeof setTimeout>;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(func, delay);
    };
  };

  const closeTours = debounce(() => setIsToursOpen(false), 100);
  const closeProfile = debounce(() => setIsProfileOpen(false), 100);
  const closeLanguage = debounce(() => setIsLanguageOpen(false), 100);

  return (
    <Disclosure
      as="nav"
      className="bg-green-800 shadow-lg z-[1000] fixed top-0 left-0 w-full will-change-transform"
    >
      <div className="mx-auto px-2 xxs:px-3 xs:px-4 sm:px-4 lg:px-8">
        <div className="relative flex h-16 items-center justify-center">
          {/* Mobile menu button */}
          <div className="flex items-center w-8 xxs:w-10 xs:w-12 sm:hidden flex-shrink-0">
            <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-1.5 xxs:p-2 text-white hover:bg-green-700 hover:text-gray-200 focus:ring-2 focus:ring-white transition-all duration-200">
              {({ open }) => (
                <>
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon
                      className="block h-5 xxs:h-6 w-5 xxs:w-6"
                      aria-hidden="true"
                    />
                  ) : (
                    <Bars3Icon
                      className="block h-5 xxs:h-6 w-5 xxs:w-6"
                      aria-hidden="true"
                    />
                  )}
                </>
              )}
            </Disclosure.Button>
          </div>

          {/* Centered content */}
          <div className="flex items-center justify-center space-x-1 xxs:space-x-2 xs:space-x-3 sm:space-x-6 md:space-x-6 lg:space-x-8 xl:space-x-10 flex-1">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <span className="text-white font-extrabold tracking-wide drop-shadow-md whitespace-nowrap navbar-brand text-xs xxs:text-sm xs:text-base sm:text-lg">
                  South Sudan Horizons
                </span>
              </Link>
            </div>

            {/* Desktop menu */}
            <div className="hidden sm:flex items-center space-x-1 md:space-x-2 lg:space-x-3 xl:space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    item.current
                      ? "bg-green-900 text-white"
                      : "text-white hover:bg-green-700 hover:text-gray-200",
                    "rounded-md px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm md:text-base font-medium transition-all duration-200"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <div
                className="relative group"
                onMouseEnter={() => setIsToursOpen(true)}
                onMouseLeave={closeTours}
              >
                <button className="flex items-center text-white hover:bg-green-700 hover:text-gray-200 rounded-md px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm md:text-base font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white">
                  Tours
                  <ChevronDownIcon className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                </button>
                {isToursOpen && (
                  <div className="absolute left-0 top-full w-40 sm:w-48 rounded-md bg-white shadow-lg ring-1 ring-green-700 ring-opacity-5 transition-all duration-200 z-10">
                    <Link
                      to="/tours/all"
                      className="block px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-green-50 hover:text-green-800"
                      onClick={() => setIsToursOpen(false)}
                    >
                      All Tours
                    </Link>
                    <Link
                      to="/tours/adventure"
                      className="block px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-green-50 hover:text-green-800"
                      onClick={() => setIsToursOpen(false)}
                    >
                      Adventure Tours
                    </Link>
                    <Link
                      to="/tours/cultural"
                      className="block px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-green-50 hover:text-green-800"
                      onClick={() => setIsToursOpen(false)}
                    >
                      Cultural Tours
                    </Link>
                    <Link
                      to="/tours/wildlife"
                      className="block px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-green-50 hover:text-green-800"
                      onClick={() => setIsToursOpen(false)}
                    >
                      Wildlife Tours
                    </Link>
                    <Link
                      to="/tours/nature"
                      className="block px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-green-50 hover:text-green-800"
                      onClick={() => setIsToursOpen(false)}
                    >
                      Nature Tours
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Right-side buttons */}
            {user ? (
              <>
                <span className="hidden sm:block text-white text-xs sm:text-sm md:text-base font-medium truncate max-w-[80px] sm:max-w-[120px] md:max-w-[120px] lg:max-w-[120px]">
                  {user.fullName}
                </span>
                <button className="relative rounded-full bg-green-700 p-1 xxs:p-1.5 xs:p-2 sm:p-2 text-white hover:bg-green-600 focus:ring-2 focus:ring-white transition-all duration-200">
                  <span className="sr-only">View notifications</span>
                  <BellIcon
                    className="h-4 w-4 xxs:h-5 xxs:w-5 sm:h-6 sm:w-6"
                    aria-hidden="true"
                  />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] sm:text-xs text-white rounded-full px-1 py-0.5">
                    3
                  </span>
                </button>
                <div
                  className="relative group"
                  onMouseEnter={() => setIsProfileOpen(true)}
                  onMouseLeave={closeProfile}
                >
                  <button className="relative flex rounded-full bg-green-700 text-sm focus:ring-2 focus:ring-white focus:outline-none transition-all duration-200 h-7 xxs:h-8 xs:h-9 sm:h-10 w-7 xxs:w-8 xs:w-9 sm:w-10 items-center justify-center">
                    {profilePicture ? (
                      <img
                        className="h-7 w-7 xxs:h-8 xxs:w-8 xs:h-9 xs:w-9 sm:h-10 sm:w-10 rounded-full object-cover border-2 border-white"
                        src={profilePicture}
                        alt="User Avatar"
                        onError={(e) => {
                          console.error(
                            "Profile image failed to load:",
                            profilePicture
                          );
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-white text-xs xxs:text-sm xs:text-base sm:text-lg font-semibold">
                        {getInitials(user.fullName)}
                      </span>
                    )}
                  </button>
                  {isProfileOpen && (
                    <div className="absolute right-0 top-full w-40 sm:w-48 rounded-md bg-white shadow-lg ring-1 ring-green-700 ring-opacity-5 transition-all duration-200 z-10">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-green-50 hover:text-green-800"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Profile & Bookings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-green-50 hover:text-green-800 text-left"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-1.5 xxs:px-2 xs:px-2.5 sm:px-3 sm:py-1.5 bg-white text-green-800 rounded-lg shadow-md hover:bg-green-50 hover:text-green-900 transition-all duration-200 text-[10px] xxs:text-xs xs:text-sm sm:text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-1.5 xxs:px-2 xs:px-2.5 sm:px-4 sm:py-1.5 border-2 border-white text-white rounded-lg hover:bg-green-700 hover:border-green-700 transition-all duration-200 text-[10px] xxs:text-xs xs:text-sm sm:text-sm font-medium"
                >
                  Register
                </Link>
              </>
            )}
            <div
              className="relative group"
              onMouseEnter={() => setIsLanguageOpen(true)}
              onMouseLeave={closeLanguage}
            >
              <button className="flex items-center text-white hover:bg-green-700 hover:text-gray-200 rounded-md px-1.5 xxs:px-2 xs:px-2.5 sm:px-3 sm:py-2 text-[10px] xxs:text-xs xs:text-sm sm:text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white">
                EN
                <ChevronDownIcon className="ml-0.5 xxs:ml-1 h-3 w-3 sm:h-4 sm:w-4" />
              </button>
              {isLanguageOpen && (
                <div className="absolute right-0 top-full w-24 sm:w-28 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200 z-10">
                  <button className="block w-full px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-green-50 hover:text-green-800">
                    English
                  </button>
                  <button className="block w-full px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-green-50 hover:text-green-800">
                    Arabic
                  </button>
                  <button className="block w-full px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-green-50 hover:text-green-800">
                    French
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Invisible spacer on small screens */}
          <div className="w-8 xxs:w-10 xs:w-12 sm:hidden flex-shrink-0" />
        </div>
      </div>

      <DisclosurePanel className="sm:hidden bg-green-900">
        <div className="space-y-1 px-2 xxs:px-3 xs:px-4 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as={Link}
              to={item.href}
              className={classNames(
                item.current
                  ? "bg-green-800 text-white"
                  : "text-white hover:bg-green-700 hover:text-gray-200",
                "block rounded-md px-3 py-2 text-xs xxs:text-sm xs:text-base font-medium transition-all duration-200"
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
          <div className="relative">
            <DisclosureButton
              as="button"
              onClick={() => setIsToursOpen(!isToursOpen)}
              className="flex items-center justify-between w-full text-white hover:bg-green-700 hover:text-gray-200 rounded-md px-3 py-2 text-xs xxs:text-sm xs:text-base font-medium transition-all duration-200"
            >
              Tours
              <ChevronDownIcon
                className={`h-5 w-5 transition-transform ${
                  isToursOpen ? "rotate-180" : ""
                }`}
              />
            </DisclosureButton>
            {isToursOpen && (
              <div className="mt-1 space-y-1 bg-green-800 rounded-md">
                <Link
                  to="/tours/all"
                  className="block px-4 py-2 text-xs xxs:text-sm xs:text-base text-gray-200 hover:bg-green-700 hover:text-white"
                >
                  All Tours
                </Link>
                <Link
                  to="/tours/adventure"
                  className="block px-4 py-2 text-xs xxs:text-sm xs:text-base text-gray-200 hover:bg-green-700 hover:text-white"
                >
                  Adventure Tours
                </Link>
                <Link
                  to="/tours/cultural"
                  className="block px-4 py-2 text-xs xxs:text-sm xs:text-base text-gray-200 hover:bg-green-700 hover:text-white"
                >
                  Cultural Tours
                </Link>
                <Link
                  to="/tours/wildlife"
                  className="block px-4 py-2 text-xs xxs:text-sm xs:text-base text-gray-200 hover:bg-green-700 hover:text-white"
                >
                  Wildlife Tours
                </Link>
                <Link
                  to="/tours/nature"
                  className="block px-4 py-2 text-xs xxs:text-sm xs:text-base text-gray-200 hover:bg-green-700 hover:text-white"
                >
                  Nature Tours
                </Link>
              </div>
            )}
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
};

export default Navbar;
