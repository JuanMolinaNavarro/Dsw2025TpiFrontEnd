function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 text-gray-800 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-lg font-semibold">DSW TPI</p>
            
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-400">
              © {currentYear} DSW TPI 2025.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;