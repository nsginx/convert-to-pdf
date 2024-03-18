import { getAssetInsights, getBankInsights, getBusinessInsights, getGrowthInsights, getPlaceArray, getShapeInsights } from "./DataInsights.js";

function parseLoanType(type){
    let res;
    switch(type){
        case "AL":
            res="New Car Loan";
            break;
        case "BL":
            res= "Business Loan Unsecured";
            break;
        case "CC":
            res= "Credit Cards";
            break;
        case "GL":
            res= "Gold Loan";
            break;
        case "HL":
            res= "Home Loan";
            break;
        case "LAP":
            res= "Loan Against Property";
            break;
        case "PL":
            res= "Personal Loan";
            break;
        case "UCL":
            res= "Used Car Loan";
            break;
        default:
            res= "Personal Loan";
            break;
    }

    return res;
}

async function getMarketData(level, groupBy, name, state){
    let market={
        "business":{},
        "population":{},
        "liabilities":{},
        "assets":{},
    };
    const responseShapeInsights= await getShapeInsights(groupBy, groupBy, name, state);
    // console.log(responseShapeInsights);
    // responseShapeInsights.then((data)=>{
        // console.log(data.data[0]);
    market.business.total= responseShapeInsights.data[0].details.total_business_count;
    market.business.gst_registered= responseShapeInsights.data[0].details.gst_business_count;
    market.population.total= responseShapeInsights.data[0].details.total_population;
    market.population.salaried_individuals= responseShapeInsights.data[0].insights.salaried_individuals_percentage;
    market.population.self_employed= responseShapeInsights.data[0].insights.total_self_employed_population_percentage;
    market.population.household_count= responseShapeInsights.data[0].details.total_households;
    market.liabilities.sa= responseShapeInsights.data[0].details.total_SA_deposit;
    market.liabilities.ca= responseShapeInsights.data[0].details.total_CA_deposit;
    market.assets.home_loan= responseShapeInsights.data[0].details.HL_disbursed_amount;
    market.assets.personal_loan= responseShapeInsights.data[0].details.PL_disbursed_amount;
    return market;

}

async function getTargetAudienceData(level, groupBy, name, state){
    let target_audience={};
    const responseBusinessInsights= await getBusinessInsights(groupBy, groupBy, name, state);
    // responseBusinessInsights.then((data)=>{
    // console.log(responseBusinessInsights);
    target_audience.top_categories= responseBusinessInsights.category_distribution;
    target_audience.turnover= responseBusinessInsights.turnover_distribution;
    target_audience.entity= responseBusinessInsights.entity_distribution;

    return target_audience;
}

async function getCompetitionData(level, groupBy, name, state){
    let competition ={
        "branch":{},
    }
    const responseBankInsights= await getBankInsights(groupBy, groupBy, name, state);
    // console.log(responseBankInsights);
    competition.branch.total=responseBankInsights.total_count;
    let banks= responseBankInsights.category_distribution;
    banks.map((item)=>{
        let top=[];
        let topBanks= responseBankInsights.category_top_count[item.category];
        let count= topBanks.length;
        topBanks.map((it)=>{
            top.push(it.name);
        })
        while(count<4){
            top.push("-");
            count++;
        }
        item.top= top;
        
    })
    competition.branch.banks= banks;
    competition.liabilities= responseBankInsights.market_share;
    let length= competition.liabilities.length;
    while(length<6){
        competition.liabilities.push({
            "name": "NA",
            "percentage": 0,
            "count": 0
        })
        length++;
    }
    return competition;
}

async function getProductData(level, groupBy, name, state,  individualData){
    let product={};            
    const responseGrowthInsights= await getGrowthInsights(groupBy, groupBy, name, state);
    // console.log(responseGrowthInsights);
    const growthArray= responseGrowthInsights.growthSequence;
    const timeframe= growthArray[5];
    individualData.timeframe= timeframe;
    const responseAssetInsights= await getAssetInsights(groupBy, groupBy, name, state, timeframe);
    product.disbursement= responseAssetInsights.disbursement;
    const disbursement_array= product.disbursement;
    disbursement_array.map((item)=>{
        item.loan_name= parseLoanType(item.loan_type);
    })
    const delinquency_response= responseAssetInsights.delinquency;
    const delinquency_type = ["0", "1-29", "30-59", "60-89", "90-179", "180+"];
    let delinquency_array=[];
    delinquency_response.map((item)=>{
        let delinquency= {};
        delinquency.loan_type= parseLoanType(item.loan_type);
        var dpd= [];
        delinquency_type.map((it)=>{
            dpd.push({
                "key": it,
                "value": item[it]
            })
        })
        delinquency.dpd= dpd;
        delinquency_array.push(delinquency);
    })
    product.delinquency= delinquency_array;
    const growth_response= responseGrowthInsights.growth;
    let growth_array=[];
    growth_response.map((item)=>{
        let growth_item={};
        growth_item.loan_name= parseLoanType(item.loan_type);
        let sanction =[];
        growthArray.map((it)=>{
            sanction.push({
                "quarter": it,
                "amount": item[it]
            })
        })
        growth_item.sanction=sanction;
        growth_array.push(growth_item);
    })
    // console.log(growth_array);
    product.growth_rate= growth_array;

    return product;
}


const loan_types=["AL", "BL", "CC", "GL", "HL", "LAP", "PL", "UCL"];

export default async function fetchFromApi(level, groupBy, name, state){
    async function fetchData(place){
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
    const responsePlaceArray= await getPlaceArray(level, groupBy, name, state);
    // console.log(responsePlaceArray);
    // await responsePlaceArray.data.map(async (place)=>{
    //     const name= (groupBy=="pincode") ? parseInt(place.name) : place.name;
    //     let individualData= {};
    //     individualData.name= name;            
    //     individualData.market= await getMarketData(level, groupBy, name, state);
    //     individualData.target_audience= await getTargetAudienceData(level, groupBy, name, state);
    //     individualData.competition= await getCompetitionData(level, groupBy, name, state);
    //     individualData.product= await getProductData(level, groupBy, name, state, individualData);
    //     // console.log(individualData);
    //     dataArray.push(individualData)
    //     console.log("hii");
        
    // })

    const promises= responsePlaceArray.data.map((place)=> fetchData(place));
    const dataArray=await Promise.all(promises);
    // console.log(dataArray);
    return dataArray;

}

// async function test(){
//     const response= await fetchFromApi("district", "pincode", "kolkata", "west bengal");
//     console.log("hello");
//     console.log(response);

// }

// test();
