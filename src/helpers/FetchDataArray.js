import { getAssetInsights, getBankInsights, getBusinessInsights, getGrowthInsights, getPlaceArray, getShapeInsights } from "./DataInsights.js";
import parseLoanType from "./ParseLoanType.js";
import { getCompetitionData, getMarketData, getProductData, getTargetAudienceData } from "./PopulateData.js";

const loan_types=["AL", "BL", "CC", "GL", "HL", "LAP", "PL", "UCL"];

export default async function fetchDataArray(token, level, places, state, timeframes, entity_filter, turnover_filter, business_filter, loan_filter, bank_filter){
    async function fetchFromAPI(place, timeframe){
        const name= (level=="pincode") ? parseInt(place) : place;
        let individualData= {};
        individualData.name= name;  
        individualData.timeframe = timeframe;          
        individualData.market= await getMarketData(token, level, name, state, loan_filter);
        individualData.target_audience= await getTargetAudienceData(token, level, name, state, business_filter, entity_filter, turnover_filter);
        individualData.competition= await getCompetitionData(token, level,  name, state, bank_filter);
        individualData.product= await getProductData(token, level, name, state, timeframe, loan_filter);
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
    const response= await fetchDataArray("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWViMDk3YTA4MjI5YWUyYzZlN2I0MWYiLCJmaXJzdE5hbWUiOiJTb3Vyb2RlZXAiLCJsYXN0TmFtZSI6IkFjaGFyeWEiLCJlbWFpbCI6ImFjaGFyeWFzb3Vyb2RlZXBAZ21haWwuY29tIiwicm9sZXMiOlsiYmFzaWMiXSwiZGVzaWduYXRpb24iOiJJbnRlcm4iLCJjb21wYW55TmFtZSI6IkRTIiwiaXNBdXRob3JpemVkIjp0cnVlLCJwYXNzd29yZCI6bnVsbCwiY3JlYXRlZEF0IjoiMjAyNC0wMy0wOFQxMDoyMDo0OC4yMDNaIiwidXBkYXRlZEF0IjoiMjAyNC0wMy0wOFQxMDoyMDo0OC4yMDNaIiwidGVhbUlEIjoiNjVlYjA4MWEwODIyOWFlMmM2ZTdiNDE5IiwiY3JlYXRlZEJ5IjpudWxsLCJ1cGRhdGVkQnkiOm51bGwsInR5cGUiOiJ0b2tlbiIsImlhdCI6MTcxMDIzOTM3NiwiZXhwIjo0NzEwMjM5Mzc2fQ.Ys5wtgqJeSHY7nQRwKuFrnHaRwp-19K5JvpJK6lfjfE", "pincode", [700001], "west bengal", ["2023-2024_Q2"], ["Company","Partnership"], ["Slab: Rs. 25 Cr. to 100 Cr."], ["Kirana_store"], ["BL"], ["public", "private", "nbfc", "foreign"]);
    console.log("hello");
    console.log(response);

}

// test();
