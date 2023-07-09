import React from 'react';

function Sidebar({ handleOptionClick }) {
  return (
    <div className="fixed left-0 h-screen flex bg-gray-200 w-[25%]">
      <div className="overflow-y-auto w-full">
        <ul className="text-gray-900">
          <li className="h-20">
            <button
              className="w-full hover:bg-gray-300 text-center h-full text-2xl"
              onClick={() => handleOptionClick('auc')}
            >
              AUC Value
            </button>
          </li>
          <li className="h-20">
            <button
              className="w-full hover:bg-gray-300 text-center h-full text-2xl"
              onClick={() => handleOptionClick('replicates')}
            >
              Replicates
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
