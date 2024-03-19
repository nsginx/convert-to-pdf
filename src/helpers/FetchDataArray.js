import { getAssetInsights, getBankInsights, getBusinessInsights, getGrowthInsights, getPlaceArray, getShapeInsights } from "./DataInsights.js";
import parseLoanType from "./ParseLoanType.js";
import { getCompetitionData, getMarketData, getProductData, getTargetAudienceData } from "./PopulateData.js";

const loan_types=["AL", "BL", "CC", "GL", "HL", "LAP", "PL", "UCL"];

export default async function fetchDataArray(level, groupBy, name, state){
    async function fetchFromAPI(place){
        const name= (groupBy=="pincode") ? parseInt(place.name) : place.name;
        let individualData= {};
        individualData.name= name;            
        individualData.market= await getMarketData(level, groupBy, name, state);
        individualData.target_audience= await getTargetAudienceData(level, groupBy, name, state);
        individualData.competition= await getCompetitionData(level, groupBy, name, state);
        individualData.product= await getProductData(level, groupBy, name, state, individualData);
        return new Promise((resolve)=>{
            resolve(individualData);
        })
    }


    // let dataArray= [];
    name= (level=="pincode")? parseInt(name): name;
    const responsePlaceArray= await getPlaceArray(level, groupBy, name, state);
    console.log(responsePlaceArray);
    if (responsePlaceArray.statusCode===400){
        return responsePlaceArray;
    }

    const promises= responsePlaceArray.data.map((place)=> fetchFromAPI(place));
    const dataArray=await Promise.all(promises);
    // console.log(dataArray);
    return dataArray;

}

//test function

// async function test(){
//     const response= await fetchFromApi("district", "pincode", "kolkata", "west bengal");
//     console.log("hello");
//     console.log(response);

// }

// test();
