import { Fragment, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { BellIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!user || !user.userId) return;

    fetch(`http://localhost:5000/api/notifications/${user.userId}`)
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch((err) => console.error("🚨 Error fetching notifications:", err));
  }, [user]);

  return (
    <nav className="bg-black text-gray-300 shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Left Side - Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-4xl font-extrabold text-white">
              Trackify
            </Link>
          </div>

          {/* Right Side - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link to="/dashboard/overview" className="text-teal-400 hover:text-teal-300 text-xl font-semibold">
                  Dashboard
                </Link>
                <div className="relative">
                  <button
                    type="button"
                    className="rounded-full p-2 text-teal-400 hover:text-teal-300 focus:outline-none text-xl"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-7 w-7" aria-hidden="true" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-white text-red-600 text-xs font-bold px-2 py-1 rounded-full">
                        {notifications.length}
                      </span>
                    )}
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md p-4 z-50">
                      <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                      {notifications.length > 0 ? (
                        notifications.map((task) => (
                          <div key={task._id} className="mt-2 p-3 bg-gray-100 rounded">
                            <p className="text-md text-gray-800">
                              🔔 {task.title} is due on {new Date(task.deadline).toLocaleDateString()}!
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-md mt-2">No notifications</p>
                      )}
                    </div>
                  )}
                </div>
                <Menu as="div" className="relative">
                  <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none">
                    <span className="sr-only">Open user menu</span>
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-black text-lg font-bold">
                      {user.username ? user.username[0].toUpperCase() : "U"}
                    </div>
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={logout}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-3 text-lg text-gray-700 w-full text-left"
                            )}
                          >
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </>
            ) : (
              <>
                <Link to="/" className="text-teal-400 hover:text-teal-300 text-xl font-semibold">
                  Home
                </Link>
                <Link to="/login" className="text-teal-400 hover:text-teal-300 text-xl font-semibold">
                  Login
                </Link>
                <Link to="/register" className="text-teal-400 hover:text-teal-300 text-xl font-semibold">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Hamburger Menu - Mobile Only */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="text-teal-400 hover:text-teal-300 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-8 w-8" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-black text-gray-300 px-4 py-4 space-y-4">
            {user ? (
              <>
                <Link
                  to="/dashboard/overview"
                  className="block text-teal-400 hover:text-teal-300 text-lg font-semibold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <div className="relative">
                  <button
                    type="button"
                    className="text-teal-400 hover:text-teal-300 text-lg font-semibold"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    Notifications
                    {notifications.length > 0 && (
                      <span className="ml-2 bg-white text-red-600 text-xs font-bold px-2 py-1 rounded-full">
                        {notifications.length}
                      </span>
                    )}
                  </button>
                  {isDropdownOpen && (
                    <div className="mt-2 w-full bg-white shadow-lg rounded-md p-4">
                      <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                      {notifications.length > 0 ? (
                        notifications.map((task) => (
                          <div key={task._id} className="mt-2 p-3 bg-gray-100 rounded">
                            <p className="text-md text-gray-800">
                              🔔 {task.title} is due on {new Date(task.deadline).toLocaleDateString()}!
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-md mt-2">No notifications</p>
                      )}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block text-teal-400 hover:text-teal-300 text-lg font-semibold"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="block text-teal-400 hover:text-teal-300 text-lg font-semibold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/login"
                  className="block text-teal-400 hover:text-teal-300 text-lg font-semibold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block text-teal-400 hover:text-teal-300 text-lg font-semibold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}