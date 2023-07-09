import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/SideBar';
import AucValue from './components/AucComponent';
import Replicates from './components/Replicates';

function App() {
  const [activeOption, setActiveOption] = useState('auc');

  const handleOptionClick = (option) => {
    setActiveOption(option);
  }

  return (
    <div className="h-screen">
    <div className="sticky top-0 z-50">
      <Navbar />
    </div>
    <div className="flex">
      <div className="w-[25%]"> {/* Sidebar component */}
        <Sidebar handleOptionClick={handleOptionClick} />
      </div>
      <div className="w-[75%] p-6 overflow-y-auto"> {/* Content component */}
        {activeOption === 'auc' && <AucValue />}
        {activeOption === 'replicates' && <Replicates />}
      </div>
    </div>
  </div>
  
  
  );
}

export default App;
