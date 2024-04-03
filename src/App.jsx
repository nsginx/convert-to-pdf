import { useEffect, useState } from "react";
import './App.css';
import Display from './Display.jsx';
import data from './data.json'
import fetchDataArray from "./helpers/FetchDataArray.js";


function App(){
  const [dataArray, setDataArray]= useState(data);
  const [level, setLevel]= useState("pincode");
  const [places, setPlaces]= useState([700001]);
  const [state, setState]= useState("west bengal");
  const [timeframes, setTimeframes]= useState(["2023-2024_Q2"]);
  const [entity_filter, setEntity_filter]= useState(["Companies","LLP"]);
  const [turnover_filter, setTurnover_filter]= useState(["Slab: Rs. 25 Cr. to 100 Cr."]);
  const [busines_filter, setBusiness_filter]= useState(["Kirana_store"]);
  const [loan_filter, setLoan_filter]= useState(["BL", "AL" ,"GL"]);
  const [bank_filter, setBank_filter]= useState(["public", "private", "nbfc", "foreign"]);
  const [loading, setLoading]= useState(false);


  function fetchData(e){
    setLoading(true);
    e.preventDefault();
    fetchDataArray(level, places, state, timeframes, entity_filter, turnover_filter, busines_filter, loan_filter, bank_filter).then((data)=>{
      setDataArray(data);
      setLoading(false);
    //   console.log(dataArray);
    })
    
  }

  


    return(
    <div className="flex flex-row">

        
        {/* input form */}
        <div className="bg-slate-500 h-full w-full">

            <button onClick={fetchData}>submit</button>

        </div>


      <div id="viewport" className="w-[1000px] mr-0">
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
    </div>
  );
};


export default App;