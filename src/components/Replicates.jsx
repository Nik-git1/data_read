import { read, utils } from "xlsx";
import React, { useState, useRef, useEffect } from "react";
import ErrorBar from "./ErrorBar.jsx";

export default function Replicates() {
  const [results, setResults] = useState([]);
  const [plate, setPlate] = useState([]);
  const Plateref = useRef(null);

  const resetPlate = () => {
    Plateref.current.value = null;
    setPlate([]);
    setResults([]); 
  };

  const plateUpload = ($event) => {
    const files = $event.target.files;
    if (files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const wb = read(event.target.result);
        const sheets = wb.SheetNames;
        if (sheets.length) {
          // console.log(wb.Sheets[sheets[0]])
          const rows = utils.sheet_to_json(wb.Sheets[sheets[1]], {
            header: 1,
            defval: "",
          });
          console.log(rows);
          setPlate(rows);
        }
      };
      reader.readAsArrayBuffer(file);
      console.log(plate);
    }
  };

  useEffect(() => {
    calc();
  }, [plate]);

  const calc = () => {
    if (plate.length > 0) {
      const arr = plate[0];
      const newarr = arr.splice(1);
      var unique = [...new Set(newarr)];
      console.log(unique);
      var lastRow = plate[plate.length - 1];
      lastRow = lastRow.splice(1);
      console.log(lastRow);

      const Replicates = unique.reduce((acc, cur) => {
        acc.push({ key: cur, value: [] });
        return acc;
      }, []);

      console.log(Replicates);

      const numReplicates = Replicates.length;
      const numLastRow = lastRow.length;
      for (let i = 0; i < numLastRow; i++) {
        const replicateIndex = i % numReplicates;
        Replicates[replicateIndex].value.push(lastRow[i]);
      }
      console.log(Replicates);
      const newResults = [];
      for (const { key, value } of Replicates) {
        const avgOD = (
          value.reduce((acc, cur) => acc + cur, 0) / value.length
        ).toFixed(3);
        const minOD = Math.min(...value).toFixed(3);
        const maxOD = Math.max(...value).toFixed(3);
        newResults.push({ concentration: key, OD: avgOD, minOD, maxOD });
      }
      const newArray = newResults.splice(0, 10);

      setResults(newArray);
      console.log(results.length);
    }
  };

  return (
    <div>
      <div className='m-8'>
        <div className='font-bold text-2xl'>Calculate Replicates values</div>
        </div>
<div className="flex items-center m-4 justify-around">
  <label htmlFor="plateInput" className="mr-4">
    Choose File
  </label>
  <div className="relative">
    <input
      type="file"
      id="plateInput"
      className="opacity-0 absolute inset-0 z-50"
      ref={Plateref}
      required
      onChange={plateUpload}
      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
    />
    <label
      htmlFor="plateInput"
      className={`bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded cursor-pointer ${
        plate.length > 0 ? 'bg-green-500 hover:bg-green-400 border-green-700 hover:border-green-500' : ''
      }`}
    >
      {plate.length > 0 ? 'File Uploaded' : 'Upload'}
    </label>
  </div>
  <button
    className={`${
      plate.length === 0 ? 'bg-red-300 text-gray-700' : 'bg-red-500 hover:bg-red-400 text-white'
    } font-bold py-2 px-4 ml-4 border-b-4 border-red-700 hover:border-red-500 rounded align-middle`}
    onClick={resetPlate}
    disabled={plate.length === 0}
  >
    Reset Plate
  </button>
</div>


      {results.length>0 ? (
        <ErrorBar data={results} />
      ) : (
        <p>No results to display.</p>
      )}
    </div>
  );
}
