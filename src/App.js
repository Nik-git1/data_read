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
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar handleOptionClick={handleOptionClick} />
        <div className=" p-6">
          {activeOption === 'auc' && <AucValue />}
          {activeOption === 'replicates' && <Replicates />}
        </div>
      </div>
    </div>
  );
}

export default App;
