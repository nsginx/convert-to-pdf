import { useState } from 'react'
import './App.css'
import Display from './Display.jsx';
import generatePDF, { Resolution, Margin } from 'react-to-pdf';
// import * as xlsx from 'xlsx';

const options= {
  // method: 'save',
  method: 'open',
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

function App() {

  const [data, setData]= useState(null);

  const readUploadFile = (e) => {
    e.preventDefault();
    if (e.target.files) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = xlsx.read(data, { type: "array" });
            const sheetName1 = workbook.SheetNames[0];
            const sheetName2 = workbook.SheetNames[1];
            const sheetName3 = workbook.SheetNames[2];
            const worksheet1 = workbook.Sheets[sheetName1];
            const worksheet2 = workbook.Sheets[sheetName2];
            const worksheet3 = workbook.Sheets[sheetName3];
            const json1 = xlsx.utils.sheet_to_json(worksheet1);
            const json2 = xlsx.utils.sheet_to_json(worksheet2);
            const json3 = xlsx.utils.sheet_to_json(worksheet3);
            console.log(json1);
            console.log(json2);
            console.log(json3);
        };
        reader.readAsArrayBuffer(e.target.files[0]);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const xlData= {
      "city_name":"Kolkata",
      "market":{
        "total_business": 129001,
        "gst_registered": 58465,
        "total_population": 3450000,
        "salaried_individuals": 606747,
        "household_count": 723602,
        "ca_deposit": 596310000000,
        "sa_deposit": 1047230000000
      },
      "target_audience":{
        "categories":[{
          "name": "FMCG",
          "value": 8235

        },
        {
          "name": "Consumer Durables",
          "value": 8235

        },
        {
          "name": "Agriculture",
          "value": 8235

        },
        {
          "name": "FMCG",
          "value": 8235

        },
      ],
        "ranges":[
          {
            "key_lower": "40 Lakh",
            "key_upper": "1.5 Crore",
            "value": 3441
          },
          {
            "key_lower": "0",
            "key_upper": "40 Lakhs",
            "value": 14312
          }
        ],
        "sole_proprietorship": 74,
        "llp": 12,
        "companies":14
      },
      "competitions":{
        "bank_market_share":{
          "public":59.15,
          "private":7.16,
          "nbfc":33.68
        },
        "top_banks":{
          "public":["United Bank of India","State Bank of India","Canara Bank","Punjab National Bank"],
          "private": ["HDFC Bank Ltd","Axis Bank","ICICI Bank Ltd","Kotak Mahindra Bank"]
        },
        "top_bank_shares":{
          "names":["United Bank of India","HDFC Bank Ltd","State Bank of India","Canara Bank","Punjab National Bank"],
          "shares":[18.2, 15.63, 11.28, 8.21, 6.73]
        }
      },
      "product":{
        "disbursement":[
          {
            "key_upper":5,
            "key_lower":0,
            "value":{
              "amount": 138.18,
              "count": 10687,
              "nbfc": 55.85,
              "private": 40.14,
              "psu": 4.01
            },
            "risk":{
              "high": 0.17985,
              "medium": 0.8958,
              "low": 0.9737
            }
          },
          {
            "key_upper":15,
            "key_lower":5,
            "value":{
              "amount": 138.18,
              "count": 10687,
              "nbfc": 55.85,
              "private": 40.14,
              "psu": 4.01
            },
            "risk":{
              "high": 0.17985,
              "medium": 0.8958,
              "low": 0.9737
            }
          },
          {
            "key_upper":20,
            "key_lower":15,
            "value":{
              "amount": 138.18,
              "count": 10687,
              "nbfc": 55.85,
              "private": 40.14,
              "psu": 4.01
            },
            "risk":{
              "high": 0.17985,
              "medium": 0.8958,
              "low": 0.9737
            }
          },
          
        ]
      },
      "location":{
        "potential":{
          "total": 40,
          "high": 12,
          "medium": 16,
          "low":12
        },
        "pincodes":[
          {
            "code": 500001,
            "name": "Hyderabad G.P.O",
            "potential": "High",
            "disbursement": 81.02,
            "business": 3711
          },
          {
            "code": 500002,
            "name": "Hyderabad G.P.O",
            "potential": "High",
            "disbursement": 81.02,
            "business": 3711
          },
          {
            "code": 500003,
            "name": "Hyderabad G.P.O",
            "potential": "High",
            "disbursement": 81.02,
            "business": 3711
          },
          {
            "code": 500004,
            "name": "Hyderabad G.P.O",
            "potential": "High",
            "disbursement": 81.02,
            "business": 3711
          },
          {
            "code": 500005,
            "name": "Hyderabad G.P.O",
            "potential": "High",
            "disbursement": 81.02,
            "business": 3711
          },
          {
            "code": 500006,
            "name": "Hyderabad G.P.O",
            "potential": "High",
            "disbursement": 81.02,
            "business": 3711
          },
        ],
        "top":[
          {
            "name":"Technokraft Solutions",
            "address": "Basheerbagh, Telangana, 500029",
            "type":"IT Hardware",
            "turnover":"0 to 40 Lakhs"
          },
          {
            "name":"Sri Ganesh Traders",
            "address": "Basheerbagh, Telangana, 500029",
            "type":"IT Hardware",
            "turnover":"0 to 40 Lakhs"
          },
          {
            "name":"Technokraft Solutions",
            "address": "Basheerbagh, Telangana, 500029",
            "type":"IT Hardware",
            "turnover":"0 to 40 Lakhs"
          },
          {
            "name":"Technokraft Solutions",
            "address": "Basheerbagh, Telangana, 500029",
            "type":"IT Hardware",
            "turnover":"0 to 40 Lakhs"
          },
          {
            "name":"Sri Ganesh Traders",
            "address": "Basheerbagh, Telangana, 500029",
            "type":"IT Hardware",
            "turnover":"0 to 40 Lakhs"
          }
        ]
      }
      
    }

    setData(xlData);

    console.log("Form submitted!");
  }
  
  const getTargetElement = () => document.querySelector('#content-id');
  return (
    
    <>
      <form onSubmit={handleSubmit}>
          <button type="submit">Submit</button>
      </form>
      {data && <Display data={data}/>}
      <div className='mx-auto w-auto'>
          <button onClick={() => generatePDF(getTargetElement, options)} type="button" className='px-4 py-2 bg-slate-600 text-white'>Export PDF</button>
          {/* <button onClick={convertToPDF} type="button" className='px-4 py-2 bg-slate-600 text-white'>Export PDF</button> */}
      </div>
    </>
  )
}

export default App
