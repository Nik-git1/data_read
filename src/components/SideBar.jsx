import React from 'react';

function Sidebar({ handleOptionClick }) {
  return (
    <div className="bg-gray-100 w-1/6 h-screen flex flex-col items-center">
      <ul className="text-gray-900 w-full">
        <div >
          <button
            className="w-full hover:bg-gray-200  text-center h-20 text-3xl"
            onClick={() => handleOptionClick('auc')}
          >
            AUC Value
          </button>
        </div>
        <div>
          <button
            className="w-full hover:bg-gray-200 text-center h-20 text-3xl"
            onClick={() => handleOptionClick('replicates')}
          >
            Replicates
          </button>
        </div>
      </ul>
    </div>
  );
}

export default Sidebar;
