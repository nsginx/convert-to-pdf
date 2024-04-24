import { getCompetitionData, getMarketData, getProductData, getTargetAudienceData } from "./PopulateData.js";

const loan_types=["AL", "BL", "CC", "GL", "HL", "LAP", "PL", "UCL"];

export default async function fetchDataArray(token, level, places, state, timeframes, entity_filter, turnover_filter, business_filter, loan_filter, bank_filter,ticket_filter, disbursement_bank, all_banks_together,ticketwise ){
    async function fetchFromAPI(place, timeframe){
        const name= (level=="pincode") ? parseInt(place) : place;
        let individualData= {};
        individualData.name= name;  
        individualData.timeframe = timeframe;
        individualData.all_banks_together =  all_banks_together;         
        individualData.market= await getMarketData(token, level, name, state, timeframe, loan_filter);
        individualData.target_audience= await getTargetAudienceData(token, level, name, state, business_filter, entity_filter, turnover_filter);
        individualData.competition= await getCompetitionData(token, level,  name, state, timeframe, bank_filter);
        individualData.product= await getProductData(token, level, name, state, timeframe, loan_filter, ticket_filter, disbursement_bank, all_banks_together, ticketwise);
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

    // console.log(dataArray);
    return dataArray;

}
