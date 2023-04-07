import React from 'react';

function Navbar() {
  return (
    <nav className="bg-black text-white py-4 px-6 flex justify-between items-center">
      <div className="font-bold text-lg m-2">
        The Sengupta
        <div className="block">Laboratory</div>
      </div>
      <div className="flex items-center">
        <a href="#" className="mr-4">Home</a>
        <a href="#" className="mr-4">Research</a>
        <a href="#" className="mr-4">Publications</a>
        <a href="#" className="mr-4">Team</a>
        <a href="#">More</a>
      </div>
    </nav>
  );
}

export default Navbar;
