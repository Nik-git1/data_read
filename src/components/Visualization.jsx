
import React, { useState } from "react";
import Chart from "./LineChart.jsx";

import {sampleData} from './sampleData'

export default function TestComponent({ newData}) {
   const [generate, setGenerate] = useState(false)
   const [finalData, setfinalData] = useState({})
   const [button, setButton] = useState(true)

   const calc = () => {
    console.log("new data is here")
    console.log(newData)
    let data_length = newData[0].data.length;
    let labels = []
    for(let i =0; i<data_length;i++){
      labels.push(i*15);
    }
    console.log(labels)

    for (let i = 0; i < 10; i++) {
      let new_row = newData[i];
      let row = sampleData[i];
      row.label = new_row.id;
      row.data = new_row.data
    }

    let datasets = sampleData
    setfinalData({labels,datasets})
   

    setGenerate(true);
    setButton(false)

  };

  return (
    <>
      {button&& (
          <div className="flex justify-center">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold  px-2 rounded"
              onClick={calc}
            >
              Calculate
            </button>
          </div>
        )}

        {generate&&( <Chart newData={finalData} />)}
    </>
  );
}
