import { useEffect, useState } from "react";
import './App.css';
import Display from './Display.jsx';
import data from './data.json'
import fetchDataArray from "./helpers/FetchDataArray.js";
import { MultiSelect } from "react-multi-select-component";
import { getBusinessTypes, getPlaceArray } from "./helpers/DataInsights.js";
import parseLoanType from "./helpers/ParseLoanType.js";
import generatePDF from 'react-to-pdf';


async function fetchPlaces(token, placeLevel, level, place, state) {
  try {
    const response = await getPlaceArray(token, placeLevel, level, place, state);
    const placesArrayFromApi = response.data;
    const formattedArray = placesArrayFromApi.map(element => {
      const name = level === "pincode" ? parseInt(element.name) : element.name;
      return { label: name, value: name };
    });
    return formattedArray;
  } catch (error) {
    console.error("Error fetching places:", error);
    return [];
  }
}

async function fetchBusinessTypes(token){
  try{
    const response = await getBusinessTypes(token);
    const arrayFromApi= response.data;
    const categories= arrayFromApi.filter((element)=>{ return element.filter=="type"});
    const formattedArray= categories[0].categories.map((element)=>{
      return { label : element, value : element};
    });
    return formattedArray;

  } catch (error){
    console.error("Error fetching business types:", error);
    return [];
  }
}


function pdfOptions (name, timeframe) {
  return {
    method: 'save',
    // method: 'open',
    filename: `${name}_${timeframe}`,
    // resolution: Resolution.HIGH,
    canvas: {
        // default is 'image/jpeg' for better size performance
        mimeType: 'image/png/',
        qualityRatio: 1
    },
    overrides: {
        pdf: {
            compress: true
        },
        canvas: {
        useCORS: true
        }
    },

  }
}


function App(){
  const [dataArray, setDataArray]= useState(data);
  const [token, setToken] = useState();
  const [place, setPlace]= useState("kolkata");
  const [placeLevel, setPlaceLevel]= useState("district");
  // const [level, setLevel]= useState("pincode");
  const [level, setLevel]= useState();
  // const [places, setPlaces]= useState([700001, 700004]);
  const [places, setPlaces]= useState([]);
  const [state, setState]= useState("west bengal");
  const [timeframes, setTimeframes]= useState(["2023-2024_Q2"]);
  const [entity_filter, setEntity_filter]= useState(["Companies","LLP"]);
  const [turnover_filter, setTurnover_filter]= useState(["Slab: Rs. 25 Cr. to 100 Cr."]);
  const [busines_filter, setBusiness_filter]= useState(["Kirana_store"]);
  const [loan_filter, setLoan_filter]= useState(["BL", "AL" ,"GL"]);
  const [bank_filter, setBank_filter]= useState(["public", "private", "nbfc", "foreign"]);
  const [disbursement_bank, setDisbursement_bank]= useState([]);
  const [disbursement_type_all, setDisbursement_type_all]= useState(true);
  const [loading, setLoading]= useState(false);



  //collecting timeframes
  const timeframesOptions = [
    { label: "Q2 2023-2024", value: "2023-2024_Q2" },
    { label: "Q1 2023-2024", value: "2023-2024_Q1" },
    { label: "Q4 2022-2023", value: "2022-2023_Q4"},
    { label: "Q3 2022-2023", value: "2022-2023_Q3"},
    { label: "Q2 2022-2023", value: "2022-2023_Q2"},
    { label: "Q1 2022-2023", value: "2022-2023_Q1"},
  ];

  const [selectedTimeframes, setSelectedTimeframes] = useState([{ label: "Q2 2023-2024", value: "2023-2024_Q2" }]);

  //collecting places
  const[placesOptions, setPlacesOptions]= useState([]);
  const [selectedPlaces, setSelectedPlaces]= useState([]);

  useEffect(() => {
    async function fetchArray() {
      const formattedArray = await fetchPlaces(token, placeLevel, level, place, state);
      setPlacesOptions(formattedArray); 
    }
    fetchArray();
  }, [place, placeLevel, level, state]);



  //collecting entity types
  const entityOptions=[
    { label : "LLP", value : "LLP"},
    { label : "Sole Proprietorship", value : "Sole Proprietorship"},
    { label : "Companies", value : "Companies"},
    { label : "Others", value : "Others"}
  ]

  const [selectedEntities, setSelectedEntities]= useState(entityOptions);


  //collecting loan types
  const loanOptions=[
    { label : parseLoanType("AL"), value : "AL"},
    { label : parseLoanType("BL"), value : "BL"},
    { label : parseLoanType("CC"), value : "CC"},
    { label : parseLoanType("GL"), value : "GL"},
    { label : parseLoanType("HL"), value : "HL"},
    { label : parseLoanType("PL"), value : "PL"},
    { label : parseLoanType("LAP"), value : "LAP"},
    { label : parseLoanType("UCL"), value : "UCL"}
  ]

  const [selectedLoans, setSelectedLoans]= useState([
    { label : parseLoanType("HL"), value : "HL"},
    { label : parseLoanType("PL"), value : "PL"}
  ]);


  //collecting turnover ranges
  const turnoverOptions=[
    { label : "Slab: Rs. 0 to 40 lakhs", value : "Slab: Rs. 0 to 40 lakhs"},
    { label : "Slab: Rs. 40 lakhs to 1.5 Cr.", value : "Slab: Rs. 40 lakhs to 1.5 Cr."},
    { label : "Slab: Rs. 1.5 Cr. to 5 Cr.", value : "Slab: Rs. 1.5 Cr. to 5 Cr."},
    { label : "Slab: Rs. 5 Cr. to 25 Cr.", value : "Slab: Rs. 5 Cr. to 25 Cr."},
    { label : "Slab: Rs. 25 Cr. to 100 Cr.", value : "Slab: Rs. 25 Cr. to 100 Cr."},
    { label : "Slab: Rs. 100 Cr. to 500 Cr.", value : "Slab: Rs. 100 Cr. to 500 Cr."},
    { label : "Slab: Rs. 500 Cr. and above", value : "Slab: Rs. 500 Cr. and above"},
    { label : "NA", value : "NA"}
  ]

  const [selectedTurnover, setSelectedTurnover] = useState([]);


  //collecting bank filters
  const bankOptions=[
    { label : "public", value : "public"},
    { label : "private", value : "private"},
    { label : "nbfc", value : "nbfc"},
    { label : "Co-Operative", value : "Co-Operative"},
    { label : "foreign", value : "foreign"},
    { label : "Regional & Rural", value : "Regional & Rural"}
  ]

  const [selectedBank, setSelectedBank]= useState([
    { label : "public", value : "public"},
    { label : "private", value : "private"},
    { label : "nbfc", value : "nbfc"},
    { label : "Co-Operative", value : "Co-Operative"}
  ]);

  //collecting disbursement bank filters
  const disbursementBankOptions=[
    { label : "private", value : "private"},
    { label : "public", value : "public"},
    { label : "nbfc", value : "nbfc"}
  ]

  const [selectedDisbursementBank, setSelectedDisbursementBank]= useState([]);

  useEffect(()=>{
    setDisbursement_type_all(selectedDisbursementBank.length==0);
  },[selectedDisbursementBank])


  //collecting business types
  const[businessOptions, setBusinessOptions]= useState([]);
  const [selectedBusiness, setSelectedBusiness]= useState([]);

  useEffect(() => {
    async function fetchArray() {
      const formattedArray = await fetchBusinessTypes(token);
      setBusinessOptions(formattedArray); 
      // console.log(formattedArray);
    }
    fetchArray();
  }, [token]);

  //updating all query values
  useEffect(()=>{
    const timeframes_form= selectedTimeframes.map((element)=>{
      return element.value;
    })
    setTimeframes(timeframes_form);

    const places_form= selectedPlaces.map((element)=>{
      return element.value;
    })
    setPlaces(places_form);

    const entity_form = selectedEntities.map((element)=>{
      return element.value;
    })
    setEntity_filter(entity_form);

    const loan_form = selectedLoans.map((element)=>{
      return element.value;
    })
    setLoan_filter(loan_form);

    const turnover_form = selectedTurnover.map((element)=>{
      return element.value;
    })
    setTurnover_filter(turnover_form);

    const bank_form = selectedBank.map((element)=>{
      return element.value;
    })
    setBank_filter(bank_form);

    const business_form = selectedBusiness.map((element)=>{
      return element.value;
    })
    setBusiness_filter(business_form);

    const disbursement_bank_form = selectedDisbursementBank.map((element)=>{
      return element.value;
    })
    setDisbursement_bank(disbursement_bank_form);

  },[selectedTimeframes, selectedPlaces, selectedEntities, selectedLoans, selectedTurnover, selectedBank, selectedBusiness, selectedDisbursementBank])


  //generate all data
  function fetchData(e){
    setLoading(true);
    e.preventDefault();
    fetchDataArray(token, level, places, state, timeframes, entity_filter, turnover_filter, busines_filter, loan_filter, bank_filter, disbursement_bank, disbursement_type_all).then((data)=>{
      setDataArray(data);
      setLoading(false);
    //   console.log(dataArray);
    })
    
  }
  
  //export all pdf
  function exportAll(){
    dataArray.forEach((data)=>{
      const getTargetElement = () => document.getElementById(`${data.name}_${data.timeframe}`);
      const options= pdfOptions(data.name, data.timeframe);
      generatePDF(getTargetElement,options);
    })
  }


    return(
    <div className="flex flex-row">


        {/* input form */}
        <div className="bg-slate-500 w-88 p-4 h-full flex flex-col gap-2 fixed left-0 overflow-y-scroll z-20">
            <div className="mt-2">
              <label className="my-auto mx-2" htmlFor="token">Token :</label>
              <input type="text" name="token" id="token" value={token} onChange={(e)=>{setToken(e.target.value)}}  className="p-1 rounded-md"/>
            </div>
            <div className="flex flex-row">
                <label className="my-auto mx-2">Timeframes :</label>
                <MultiSelect options={timeframesOptions} value={selectedTimeframes} onChange={setSelectedTimeframes} labelledBy="Select" className="w-60 mx-auto"/>
            </div>
            <div>
              <label className="my-auto mx-2" htmlFor="state">State :</label>
              <input type="text" name="state" id="state" value={state} onChange={(e)=>{setState(e.target.value.toLowerCase())}}  className="p-1 rounded-md"/>
            </div>
            <div>
              <label className="my-auto mx-2" htmlFor="place">Location :</label>
              <input type="text" name="place" id="place" value={place} onChange={(e)=>{setPlace(e.target.value.toLowerCase())}}  className="p-1 rounded-md"/>
            </div>
            <div>
              <label className="my-auto mx-2">Location Type: </label>
              <select value={placeLevel} onChange={(e)=>{setPlaceLevel(e.target.value)}} className="p-1 rounded-md">
                <option value="">Select...</option>
                <option value="state">State</option>
                <option value="district">District</option>
              </select>
            </div>
            <div>
              <label className="my-auto mx-2">Location SubType: </label>
              <select value={level} onChange={(e)=>{setLevel(e.target.value)}} className="p-1 rounded-md">
                <option value="">Select...</option>
                <option value="district">District</option>
                <option value="city">City</option>
                <option value="pincode">Pincode</option>
              </select>
            </div>
            <div className="flex flex-row">
                <label className="my-auto mx-2">Sublocations :</label>
                <MultiSelect options={placesOptions} value={selectedPlaces} onChange={setSelectedPlaces} labelledBy="Select" className="w-60 mx-auto"/>
            </div>
            <div className="flex flex-row">
                <label className="my-auto mx-2">Entities :</label>
                <MultiSelect options={entityOptions} value={selectedEntities} onChange={setSelectedEntities} labelledBy="Select" className="w-60 mx-auto"/>
            </div>
            <div className="flex flex-row">
                <label className="my-auto mx-2">Loan Types :</label>
                <MultiSelect options={loanOptions} value={selectedLoans} onChange={setSelectedLoans} labelledBy="Select" className="w-60 mx-auto"/>
            </div>
            <div className="flex flex-row">
                <label className="my-auto mx-2">Turnover Ranges :</label>
                <MultiSelect options={turnoverOptions} value={selectedTurnover} onChange={setSelectedTurnover} labelledBy="Select" className="w-60 mx-auto"/>
            </div>
            <div className="flex flex-row">
                <label className="my-auto mx-2">Your Competitors : <br />(At least 4)</label>
                <MultiSelect options={bankOptions} value={selectedBank} onChange={setSelectedBank} labelledBy="Select" className="w-60 mx-auto"/>
            </div>
            <div className="flex flex-row">
                <label className="my-auto mx-2">Business Types : <br />(6 types at most)</label>
                <MultiSelect options={businessOptions} value={selectedBusiness} onChange={setSelectedBusiness} labelledBy="Select" className="w-60 mx-auto"/>
            </div>
            <div className="flex flex-row">
                <label className="my-auto mx-2">Bank Types for <br /> Disbursement : </label>
                <MultiSelect options={disbursementBankOptions} value={selectedDisbursementBank} onChange={setSelectedDisbursementBank} hasSelectAll={false} labelledBy="Select" className="w-40 mx-auto"/>
                {/* <span className="my-auto">or</span> */}
                <input type="checkbox"  className="mx-2" id="combined" checked={disbursement_type_all} />
                <label htmlFor="combined" className="my-auto">Combined</label>
            </div>


            <button onClick={fetchData} className="px-4 py-2 bg-blue-600 disabled:bg-blue-300 m-4 w-64 text-white rounded-lg" disabled={loading}>{loading?"Generating...":"Generate"}</button>

        </div>
        


      <div id="viewport" className="absolute right-0">
        {loading? 
        <div className="">
          {/* <ClipLoader
          color={"#ff0000"}
          loading={loading}
          size={100}
          data-testid="loader"
          className="mx-auto"
        /> */}
        </div>
        : <>
          {dataArray && ((dataArray.statusCode==400)? 
          <>
            <div className="text-4xl my-8 text-cyan-500 text-center">{dataArray.message}</div>
          </> 
          :
          <>
            <div className="h-16 bg-cyan-700 fixed right-0 w-[820px] z-10">
              <button onClick={exportAll} className="w-64 my-2 h-12 absolute right-4 px-4 py-2 bg-slate-200 rounded-lg">Export All</button>
                
            </div>
            <div className="mt-20">
              {dataArray?.map((data, i)=>{
                return(
                  <Display key={data.name} data={data}/>
                  
                )
              })}
            </div>
          </>
          )}

        </>}
      </div>
    </div>
  );
};


export default App;