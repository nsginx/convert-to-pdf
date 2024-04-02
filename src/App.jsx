import { useEffect, useState } from "react";
import './App.css';
import Display from './Display.jsx';
import data from './data.json'
import {render} from 'react-dom';
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
      {/* <form className="my-4 w-full flex flex-row justify-center" onSubmit={fetchData}>
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
      </form> */}
      {/* <form id="query_form" class="d-flex flex-column">
        <div class="d-flex flex-row">
            <div class="m-2">
                <label for="location">Location :</label>
                <input type="text" class="p-1" name="location" id="location"/>
            </div>
        <div class="dropdown m-2" id="timeframe"> 
            <label for="select_timeframe">Timeframe:</label>
            <button class="btn btn-primary dropdown-toggle"
                    type="button" 
                    id="select_timeframe"
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"> 
                Select 
            </button> 
            <ul class="dropdown-menu" 
                aria-labelledby="multiSelectDropdown"> 
                <li> 
                    <label> 
                        <input type="checkbox" value="2023-2024_Q2"/> 
                        2023-2024 Q2
                    </label> 
                </li> 
                <li> 
                    <label> 
                        <input type="checkbox" value="2023-2024_Q2"/> 
                        2023-2024 Q1
                    </label> 
                </li> 
                <li> 
                    <label> 
                        <input type="checkbox" value="2022-2023_Q4"/> 
                        2022-2023 Q4
                    </label> 
                </li> 
                <li> 
                    <label> 
                        <input type="checkbox" value="2022-2023_Q3"/> 
                        2022-2023 Q3
                    </label> 
                </li> 
                <li> 
                    <label> 
                        <input type="checkbox" value="2022-2023_Q2"/> 
                        2022-2023 Q2
                    </label> 
                </li> 
                <li> 
                    <label> 
                        <input type="checkbox" value="2022-2023_Q1"/> 
                        2022-2023 Q1
                    </label> 
                </li> 
                
            </ul> 
        </div> 
        </div>
        <div class="d-flex flex-row"> 
        <div class="m-2">
            <label for="select_location_subtype">Location Sub Type : </label>
            <select class="btn btn-primary" id="location_subtype" >
                <option value="">Select</option>
                <option value="district">District</option>
                <option value="city">City</option>
                <option value="pincode">Pincode</option>

            </select>
        </div>
        <div class="dropdown m-2" id="sublocation"> 
            <label for="select_sublocation">Sublocation :</label>
            <button class="btn btn-primary dropdown-toggle"
                    type="button" 
                    id="select_sublocation"
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"> 
                Select 
            </button> 
            <ul class="dropdown-menu" 
                aria-labelledby="multiSelectDropdown"> 
                <li> 
                    <label> 
                        <input type="checkbox" value="all"/> 
                        All
                    </label> 
                </li> 
                <li> 
                    <label> 
                        <input type="checkbox" value="darjeeling"/> 
                        Darjeeling
                    </label> 
                </li> 
                <li> 
                    <label> 
                        <input type="checkbox" value="kolkata"/> 
                        Kolkata
                    </label> 
                </li> 
                <li> 
                    <label> 
                        <input type="checkbox" value="howrah"/> 
                        Howrah
                    </label> 
                </li> 
                
            </ul> 
        </div>
        
        <div class="dropdown m-2" id="loantype"> 
            <label for="select_loantype">Loan Types :</label>
            <button class="btn btn-primary dropdown-toggle"
                    type="button" 
                    id="select_loantype"
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"> 
                Select 
            </button> 
            <ul class="dropdown-menu" 
                aria-labelledby="multiSelectDropdown"> 
                <li> 
                    <label> 
                        <input type="checkbox" value="all"/> 
                        All
                    </label> 
                </li> 
                <li> 
                    <label> 
                        <input type="checkbox" value="GL"/> 
                        Gold Loan
                    </label> 
                </li>  
                <li> 
                    <label> 
                        <input type="checkbox" value="PL"/> 
                        Personal Loan
                    </label> 
                </li>  
                <li> 
                    <label> 
                        <input type="checkbox" value="LAP"/> 
                        Loan Against Property
                    </label> 
                </li>  
                <li> 
                    <label> 
                        <input type="checkbox" value="BL"/> 
                        Business Loan Unsecured
                    </label> 
                </li>  
                <li> 
                    <label> 
                        <input type="checkbox" value="CC"/> 
                        Credit Cards
                    </label> 
                </li>  
                <li> 
                    <label> 
                        <input type="checkbox" value="AL"/> 
                        New Car Loan
                    </label> 
                </li>  
                <li> 
                    <label> 
                        <input type="checkbox" value="UCL"/> 
                        Used Car Loan
                    </label> 
                </li>  
                <li> 
                    <label> 
                        <input type="checkbox" value="HL"/> 
                        Home Loan
                    </label> 
                </li>  
                
            </ul> 
        </div>
        <div class="dropdown m-2" id="turnover"> 
            <label for="select_turnover">Turnover Range :</label>
            <button class="btn dropdown-toggle bg-blue-600"
                    type="button" 
                    id="select_turnover"
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"> 
                Select 
            </button> 
            <ul class="dropdown-menu" 
                aria-labelledby="multiSelectDropdown"> 
                <li> 
                    <label> 
                        <input type="checkbox" value="all"/> 
                        All
                    </label> 
                </li> 
                <li> 
                    <label> 
                        <input type="checkbox" value="<40L"/> 
                        &#x3c;40L
                    </label> 
                </li>
                <li> 
                    <label> 
                        <input type="checkbox" value="40L-1Cr"/> 
                        40L-1Cr
                    </label> 
                </li>
                <li> 
                    <label> 
                        <input type="checkbox" value="1Cr-5Cr"/> 
                        1Cr-5Cr
                    </label> 
                </li>
                <li> 
                    <label> 
                        <input type="checkbox" value="5Cr-20Cr"/> 
                        5Cr-20Cr
                    </label> 
                </li>
                <li> 
                    <label> 
                        <input type="checkbox" value=">20Cr"/> 
                        &#x3e;20Cr
                    </label> 
                </li>
                
            </ul> 
        </div>
    </div>
        <button type="submit" class="px-4 py-2 w-[200px] bg-cyan-500" disabled={loading}>{loading? "Generating...": "Generate"}</button>
    </form> */}

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