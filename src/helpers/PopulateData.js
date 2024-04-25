import { getAssetInsights, getAssetwiseBanks, getBankInsights, getBankWiseDisbursement, getBankwiseTicketwiseDisbursement, getBusinessInsights, getBusinessTypes, getEntitySplitInsights, getGrowthInsights, getLiabilityInsights, getLoanWiseAsset, getPlaceArray, getShapeInsights, getTicketSize, getTicketWiseAssetInsights, getTicketWiseGrowthInsights} from "./DataInsights.js";
import parseLoanType from "./ParseLoanType.js";

const loan_types=["AL", "BL", "CC", "GL", "HL", "LAP", "PL", "UCL"];


async function getMarketData(token, level, name, state, timeframe, loan_filter){
    let market={
        "business":{},
        "population":{},
        "liabilities":{},
        "assets":[],
    };
    const responseShapeInsights= await getShapeInsights(token, level, name, state);
    // console.log(responseShapeInsights);
    const data_details= responseShapeInsights.data[0].details;
    market.business.total= data_details.total_business_count;
    market.business.gst_registered= data_details.gst_business_count;
    market.population.total= data_details.total_population;
    market.population.salaried_individuals= responseShapeInsights.data[0].insights.salaried_individuals_percentage;
    market.population.self_employed= responseShapeInsights.data[0].insights.total_self_employed_population_percentage;
    market.population.household_count= data_details.total_households;
    const liabilityResponse = await getLiabilityInsights(token, level, name, state, timeframe);
    const ca_disbursement= liabilityResponse.disbursement.find((item)=> item.type==="current");
    const sa_disbursement= liabilityResponse.disbursement.find((item)=> item.type==="savings");
    market.liabilities.sa= sa_disbursement.deposit_potential;
    market.liabilities.ca= ca_disbursement.deposit_potential;
    let asset_response= await getLoanWiseAsset(token, level, name, state, timeframe, loan_filter);
    // console.log(asset_response);
    let assets= asset_response.disbursement.map((item)=>{
        return {
            "loan_type": parseLoanType(item.loan_type),
            "amount": item.sanctioned_amount
        }
    }).sort((a,b)=> b.amount-a.amount).slice(0,2);
    // console.log(assets);
    market.assets= assets;
    return market;

}

async function getTargetAudienceData(token, level, name, state, business_filter, entity_filter, turnover_filter ){
    let target_audience={};
    const responseBusinessInsights= await getBusinessInsights(token, level, name, state, business_filter);
    // console.log(responseBusinessInsights);
    target_audience.top_categories= responseBusinessInsights.category_distribution.slice(0,6);
    let turnover_array = responseBusinessInsights.turnover_distribution;
    target_audience.turnover = turnover_array.filter((item)=>{ return turnover_filter.includes(item.category)});
    // const promises = entity_filter.map((entity)=>getEntitySplitInsights(level, name, state, entity))
    // target_audience.entity = await Promise.all(promises);
    let entity_array = responseBusinessInsights.entity_distribution;
    target_audience.entity= entity_array.filter((item)=> {return entity_filter.includes(item.name)})
    // console.log(target_audience);
    return target_audience;
}

async function getCompetitionData(token, level, name, state, timeframe, bank_filter){
    let competition ={
        "branch":{},
    }
    const responseBankInsights= await getBankInsights(token, level, name, state, bank_filter);
    // console.log(responseBankInsights);
    competition.branch.total=responseBankInsights.total_count;
    let banks_response= responseBankInsights.category_distribution;
    let banks = banks_response.filter((item)=> bank_filter.includes(item.category))
    // console.log(banks);
    banks.map((item)=>{
        let top=[];
        // console.log(responseBankInsights.category_top_count);
        let topBanks= responseBankInsights.category_top_count[item.category];
        // console.log(topBanks);
        let count= topBanks.length;
        topBanks.map((it)=>{
            top.push(it.name);
        })
        while(count<4){
            top.push("-");
            count++;
        }
        item.top= top;
        
    });
    competition.branch.banks= banks.slice(0,4);
    let asset_response= await getAssetwiseBanks(token, level, name, state, timeframe);
    // console.log(asset_response);
    let asset_count_sum=0;
    await asset_response.disbursement.forEach(element => {
        asset_count_sum+= element.sanctioned_amount;
    });
    // console.log(asset_count_sum);
    competition.assets= await asset_response.disbursement.map((item)=>{
        return {
            "category": item.bank_category,
            "percentage": ((item.sanctioned_amount)*100/asset_count_sum).toFixed(2)
        }
    }).sort((a, b)=> b.percentage-a.percentage);
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

async function getProductData(token, level, name, state, timeframe, loan_filter, ticket_filter, disbursement_bank, all_banks_together,ticketwise){
    let product={};            
    // console.log(responseGrowthInsights);
    // individualData.timeframe= timeframe;
    let responseAssetInsights;
    if(ticketwise){
        responseAssetInsights= await getTicketWiseAssetInsights(token, level, name, state, timeframe, loan_filter, ticket_filter)
        // responseAssetInsights.disbursement.map((item)=>{
        //     item.average_ticketsize = item.ticketsize;
        // })
    }else{
        responseAssetInsights= await getAssetInsights(token, level, name, state, timeframe, loan_filter);
    }
    product.disbursement= responseAssetInsights.disbursement;
    const disbursement_array= product.disbursement;
    disbursement_array.map((item)=>{
        item.loan_name= parseLoanType(item.loan_type);
    })
    const delinquency_response= responseAssetInsights.delinquency;
    // console.log(delinquency_response);
    const delinquency_type = ["0", "1-29", "30-59", "60-89", "90-179", "180+"];
    let delinquency_array=[];
    delinquency_response.map((item)=>{
        let delinquency= {};
        delinquency.loan_type= ticketwise? parseLoanType(item.loan_type).concat(" ").concat(item.ticketsize) : parseLoanType(item.loan_type);
        const dpd = delinquency_type.map((it)=>{
            return {
                "key": it,
                "value": item[it]
            }
        }).filter(item => item.key != "180+");
        delinquency.dpd= dpd;
        delinquency_array.push(delinquency);
    })
    product.delinquency= delinquency_array;
    // const loan_filter_seperate= ticket_filter[0];
    let responseGrowthInsights;
    if(ticketwise){
        responseGrowthInsights= await getTicketWiseGrowthInsights(token, level, name, state, loan_filter, ticket_filter);
    }else{
        responseGrowthInsights= await getGrowthInsights(token, level, name, state, loan_filter);
    }
    const growth_response= responseGrowthInsights.growth;
    const growthArray= responseGrowthInsights.growthSequence;
    // console.log(growthArray);
    let growth_array=[];
    growth_response.map((item)=>{
        // console.log(item);
        let growth_item={};
        growth_item.loan_name= ticketwise ? parseLoanType(item.loan_type).concat(" ").concat(item.ticketsize) : parseLoanType(item.loan_type);
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

    if(!all_banks_together){
        
        let seperate_disbursement=[];
        await Promise.all(disbursement_bank.map(async (bank_category)=>{
            let eachItem ={};
            eachItem.bank_type = bank_category;
            let disbursement_response;
            if(ticketwise){
                disbursement_response= await getBankwiseTicketwiseDisbursement(token, level, name, state, timeframe, loan_filter, ticket_filter, bank_category);
            }else{
                disbursement_response= await getBankWiseDisbursement(token, level, name, state, timeframe, loan_filter, bank_category);
            }
            // console.log(disbursement_response);
            eachItem.disbursement = disbursement_response.disbursement;
            // console.log(eachItem);
            seperate_disbursement = seperate_disbursement.concat(eachItem);
        }))
        product.seperate_disbursement= seperate_disbursement;
    }


    return product;
}

export {getCompetitionData, getMarketData, getProductData, getTargetAudienceData};
