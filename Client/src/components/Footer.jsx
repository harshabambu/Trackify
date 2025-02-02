import React from "react";

function Footer() {
  return (
    <div className="bg-black text-gray-300 py-4 px-5 text-center">
      <div className="mb-3">
        <h2 className="text-white text-xl font-bold mb-2">About Tracify</h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm">
          Tracify is a productivity platform designed to help individuals and teams manage their time, tasks, and goals efficiently. With seamless integrations, real-time tracking, and customizable features, Tracify empowers users to stay organized and focused on what matters most.
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-3">
        <div className="text-center md:text-left">
          <h3 className="text-white text-lg font-semibold mb-2">Contact Us</h3>
          <p>Email: <a href="mailto:support@tracify.com" className="text-teal-400 hover:text-teal-300">support@tracify.com</a></p>
          <p>Phone: <span className="text-teal-400">+123 456 789</span></p>
        </div>

        <div>
          <h3 className="text-white text-lg font-semibold mb-2">Follow Us</h3>
          <ul className="flex justify-center space-x-4">
            <li>
              <a
                href="#"
                target="_blank"
                className="text-teal-400 hover:text-teal-300 transition duration-300"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href="#"
                target="_blank"
                className="text-teal-400 hover:text-teal-300 transition duration-300"
              >
                Twitter
              </a>
            </li>
            <li>
              <a
                href="#"
                target="_blank"
                className="text-teal-400 hover:text-teal-300 transition duration-300"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-xs text-gray-500">
        &copy; 2025 Tracify. All Rights Reserved.
      </div>
    </div>
  );
}

export default Footer;
