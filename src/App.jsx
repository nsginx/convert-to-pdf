import { useState } from "react";
import './App.css';
import Display from './Display.jsx';
import data from './data.json'
import fetchFromApi from "./helpers/FetchFromApi.js";


function App(){
  const [dataArray, setDataArray]= useState([]);
  const [level, setLevel]= useState("");
  const [groupBy, setGroupBy]= useState("");
  const [place, setPlace] = useState("");

  function fetchData(e){
    e.preventDefault();
    setDataArray(fetchFromApi(level, groupBy, place));
    setDataArray(data); //to be removed after getting data from api
  
  }
    return(
    <>
      <form className="my-4 w-full flex flex-row justify-center" onSubmit={fetchData}>
        <label htmlFor="name">Name</label>
        <input name="name" id="name" type="text" value={place} onChange={(e)=>{setPlace(e.target.value)}} className="my-auto"/>
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
        <button type="submit" className="ml-32 bg-blue-800 rounded-md border-0 text-white px-4 py-2 my-2">Generate</button>
      </form>
      <div className="viewport">
        {dataArray.map((data, i)=>{
          return(
            <Display key={i} data={data}/>
          )
        })}
      </div>
    </>
  );
};

export default App;