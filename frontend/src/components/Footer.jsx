const Footer = () => {
  return (
    <footer className="bg-darkGray text-pureWhite text-center py-6 mt-12 border-t-4 border-primaryRed">
      <div className="max-w-7xl mx-auto px-4">
        <p className="font-semibold">&copy; {new Date().getFullYear()} SMART BUS System. All Rights Reserved.</p>
        <p className="text-gray-400 text-sm mt-1">Designed for next-level reliable transportation tracking in Sri Lanka.</p>
      </div>
    </footer>
  );
};

export default Footer;