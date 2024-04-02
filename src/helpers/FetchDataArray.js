import { getAssetInsights, getBankInsights, getBusinessInsights, getGrowthInsights, getPlaceArray, getShapeInsights } from "./DataInsights.js";
import parseLoanType from "./ParseLoanType.js";
import { getCompetitionData, getMarketData, getProductData, getTargetAudienceData } from "./PopulateData.js";

const loan_types=["AL", "BL", "CC", "GL", "HL", "LAP", "PL", "UCL"];

export default async function fetchDataArray(level, places, state, timeframes, entity_filter, turnover_filter, business_filter, loan_filter, bank_filter){
    async function fetchFromAPI(place, timeframe){
        const name= (level=="pincode") ? parseInt(place) : place;
        let individualData= {};
        individualData.name= name;  
        individualData.timeframe = timeframe;          
        individualData.market= await getMarketData(level, name, state, loan_filter);
        individualData.target_audience= await getTargetAudienceData(level, name, state, business_filter, entity_filter, turnover_filter);
        individualData.competition= await getCompetitionData(level,  name, state, bank_filter);
        individualData.product= await getProductData(level, name, state, timeframe, loan_filter);
        return new Promise((resolve)=>{
            resolve(individualData);
        })
    }


    let dataArray=[];


    await Promise.all(timeframes.map(async (timeframe) => {
        const promises = places.map((place) => fetchFromAPI(place, timeframe));
        const timeframe_data = await Promise.all(promises);
        dataArray = dataArray.concat(timeframe_data);
    }));

    console.log(dataArray);
    return dataArray;

}

//test function

async function test(){
    const response= await fetchDataArray("pincode", [700001], "west bengal", ["2023-2024_Q2"], ["Company","Partnership"], ["Slab: Rs. 25 Cr. to 100 Cr."], ["Kirana_store"], ["BL"], ["public", "private", "nbfc", "foreign"]);
    console.log("hello");
    console.log(response);

}

// test();
