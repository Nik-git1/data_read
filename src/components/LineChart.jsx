import React from "react";
import { useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import annotationPlugin from "chartjs-plugin-annotation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);
const Xvalue=10
const Yvalue=0.8
let label_map=["click the button"]
export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "right",
      display: true,
    },
    title: {
      display: true,
      text: "Growth Curve",
    },
    annotation: {
      annotations: {
        label1: {
          type: "label",
          xValue: Xvalue,
          yValue: Yvalue,
          backgroundColor: "rgba(245,245,245)",
          content: label_map,
          font: {
            size: 20,
          },
        },
      },
    },
  },
};



export default function Chart({ newData }) {
    console.log(newData.datasets[0].data[newData.datasets[0].data.length-1]);
    const inputElement = useRef();

     const calc = ()=>{
      label_map.length=0
      for(let i=0;i<newData.datasets.length;i++){
        let label=[]
        label.push(newData.datasets[i].label)
        label.push(newData.datasets[i].data[newData.datasets[i].data.length-1])
        label_map.push(label)
      }
      console.log(label_map)
      inputElement.current.update()


     }
  
  return (
       <>
       {(
          <div className="flex justify-center">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold  px-2 rounded"
              onClick={calc}
            >
              See Top 10 Values
            </button>
          </div>
        )}

       <Line options={options} data={newData} redraw={true} ref={inputElement} />
    </>
  )
}
