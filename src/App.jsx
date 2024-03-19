import { useEffect, useState } from "react";
import './App.css';
import Display from './Display.jsx';
import data from './data.json'
import {render} from 'react-dom';
import fetchDataArray from "./helpers/FetchDataArray.js";


function App(){
  const [dataArray, setDataArray]= useState(null);
  const [level, setLevel]= useState("district");
  const [groupBy, setGroupBy]= useState("pincode");
  const [name, setName] = useState("kolkata");
  const [state, setState] = useState("west bengal");
  const [search, setSearch]= useState(0);
  const [loading, setLoading]= useState(false);


  // useEffect(()=>{
  //   fetchFromApi(level, groupBy, name, state).then((data)=>{
  //     setDataArray(data);
  //     console.log(dataArray);
  //   })
  // },[search])
  function fetchData(e){
    setLoading(true);
    e.preventDefault();
    fetchDataArray(level, groupBy, name, state).then((data)=>{
      setDataArray(data);
      setLoading(false);
      console.log(dataArray);
    })
    // setSearch((search)=> search+1)
  }

  // useEffect(()=>{
  //   renderData(dataArray);
  // },[search])

  // function renderData(dataArray) {
  //   const viewport = document.getElementById('viewport');
  //   viewport.innerHTML = ''; 

  //   if (!dataArray) {
  //     return; 
  //   }

  //   if (dataArray.length === 0) {
  //     viewport.textContent = 'No data available.';
  //   } 
    
  //   else {
  //     dataArray.forEach((item, index) => {
  //       const displayElement = document.createElement('div');
  //       displayElement.id = `display-${index}`;
  //       viewport.appendChild(displayElement);
  //       // ReactDOM.render(<Display data={item} />, displayElement);
  //       render(<Display data={item} />, displayElement);
  //     });
  //   }
  // }


    return(
    <>
      <form className="my-4 w-full flex flex-row justify-center" onSubmit={fetchData}>
        <label htmlFor="name">Name</label>
        <input name="name" id="name" type="text" value={name} onChange={(e)=>{setName(e.target.value.toLowerCase())}} className="my-auto"/>
        <label htmlFor="level" className="ml-8">Level:</label>
        <select id="level" value={level} onChange={(e)=>{setLevel(e.target.value)}}>
          <option value="">--Select an Option--</option>
          <option value="state">State</option>
          <option value="district">District</option>
          <option value="city">City</option>
          <option value="pincode">Pincode</option>
        </select>
        <label htmlFor="groupBy" className="ml-8">Group By:</label>
        <select id="groupBy" value={groupBy} onChange={(e)=>{setGroupBy(e.target.value)}}>
          <option value="">--Select an Option--</option>
          <option value="state">State</option>
          <option value="district">District</option>
          <option value="city">City</option>
          <option value="pincode">Pincode</option>
        </select>
        <label htmlFor="state">State</label>
        <input name="state" id="state" type="text" value={state} onChange={(e)=>{setState(e.target.value.toLowerCase())}} className="my-auto"/>
        <button type="submit" disabled={loading} className={`ml-32 ${loading?"bg-blue-400":"bg-blue-800"} rounded-md border-0 text-white px-4 py-2 my-2`}>{loading?"Generating...":"Generate"}</button>
      </form>
      <div id="viewport">
        {dataArray && ((dataArray.statusCode==400)? 
        <>
          <div className="text-4xl my-8 text-cyan-500 text-center">{dataArray.message}</div>
        </> 
        : dataArray?.map((data, i)=>{
          return(
            <Display key={data.name} data={data}/>
          )
        }))}
      </div>
    </>
  );
};


export default App;