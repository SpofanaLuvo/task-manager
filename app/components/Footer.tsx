const Footer = () => {
    return (
      <footer className="bg-gray-900 text-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Footer Links */}
            <div className="flex space-x-4 mb-4 md:mb-0">
              <a href="#" className="hover:text-blue-400">
                About Us
              </a>
              <a href="#" className="hover:text-blue-400">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-blue-400">
                Terms of Service
              </a>
              <a href="#" className="hover:text-blue-400">
                Contact
              </a>
            </div>
  
            {/* Copyright Info */}
            <div className="text-sm">
              &copy; {new Date().getFullYear()} MyBrand. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  