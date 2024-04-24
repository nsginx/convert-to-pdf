import { useState } from "react";

const url= "https://markets.dev.api.datasutram.com";
function options(body, token){
    return(
        {
            method: 'POST',
            headers: {
                "Authorization" : `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
    
        }
        
    )
}

export async function getBusinessTypes(token){
    const response = await fetch(`${url}/business/filters`, {
        method: 'POST',
        headers: {
            "Authorization" : `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })

    return response.json();
}


export async function getTicketSize(token, loan_type){
    const response = await fetch(`${url}/asset/filters`, {
        method: 'POST',
        headers: {
            "Authorization" : `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            "categories":[
                "ticketsize"
            ],
            "filters": {
                "loan_type":[loan_type]
            }
        })
    })

    return response.json();
}

export async function getPlaceArray(token, level, groupBy, name, state){
    const response= await fetch(`${url}/business`,options(
        {
            "location": {
                "state": state,
                "level": level,
                "name": name
            },
            "group_by": groupBy
        },token
    )
    );
    return response.json();

}

export async function getShapeInsights(token, level, name, state){
    const response= await fetch(`${url}/shape/insights`,options(
        {
            "location": {
                "state": state,
                "level": level,
                "name": name
            },
            "group_by": level
        }, token
        )
        );
        return response.json();
        
    }

export async function getBusinessInsights(token, level, name, state, business_filter){
    const response= await fetch(`${url}/business/insights`,options(
    {
        "location": {
            "state": state,
            "level": level,
            "name": name
        },
        "group_by": level,
        "type_distribution": {
            "default_types": business_filter,
            "top_count": 6
        }
    }, token)
    );
    return response.json();
    
}

export async function getEntitySplitInsights(token, level, name, state, entity){
    const response = await fetch(`${url}/business`, options(
        {
            "location": {
                "state": state,
                "level": level,
                "name": name
            },   
            "group_by": level,
            "filters":{
                "entity": [entity]
            }
        }, token
    ))
    const data= await response.json();
    const data_formatted = data.data;
    const dict= {
        "name": entity,
        "count": data_formatted[0].count
    }
    return new Promise((resolve)=>{
        resolve(dict);
    })
}

export async function getBankInsights(token, level, name, state, bank_filter){
    let filter = [];
    bank_filter.map((item)=>{
        filter.push({
            "category": item,
            "top_count": 4
        })
    })
    const response= await fetch(`${url}/bank/insights`,options(
        {
            "location": {
                "state": state,
                "level": level,
                "name": name
            },
            "group_by": level,
            "category_distribution": filter
        }, token
    )
    );
    return response.json();

}
export async function getAssetInsights(token, level, name, state, timeframe, loan_filter){
    const response= await fetch(`${url}/asset/insights`,options(
        {
            "location": {
                "state": state,
                "level": level,
                "name": name
            },
            "group_by": level,
            "filters": {
                "timeframe": [
                    timeframe
                ],
                "loan_type": loan_filter
            },
            "disbursement_keys": [],
            "delinquency_keys": []
            
        }, token
    )
    );
    return response.json();

}

export async function getTicketWiseAssetInsights(token, level, name, state, timeframe, loan_filter, ticket_filter){
    const response= await fetch(`${url}/asset/insights`,options(
        {
            "location": {
                "state": state,
                "level": level,
                "name": name
            },
            "group_by": level,
            "filters": {
                "timeframe": [
                    timeframe
                ],
                "loan_type": loan_filter,
                "ticketsize": ticket_filter
            },
            "disbursement_keys": ["loan_type", "ticketsize"],
            "delinquency_keys": ["loan_type", "ticketsize"]
            
        }, token
    )
    );
    return response.json();
}

export async function getBankwiseTicketwiseDisbursement(token, level, name, state, timeframe, loan_filter, ticket_filter, bank_category){
    const response= await fetch(`${url}/asset/insights`,options(
        {
            "location": {
                "state": state,
                "level": level,
                "name": name
            },
            "group_by": level,
            "filters": {
                "timeframe": [
                    timeframe
                ],
                "loan_type": loan_filter,
                "ticketsize": ticket_filter,
                "bank_category": [bank_category]
            },
            "disbursement_keys": ["loan_type", "ticketsize"]            
        }, token
    )
    );
    return response.json();
}

export async function getBankWiseDisbursement(token, level, name, state, timeframe, loan_filter, bank_category){
    const response= await fetch(`${url}/asset/insights`,options(
        {
            "location": {
                "state": state,
                "level": level,
                "name": name
            },
            "group_by": level,
            "filters": {
                "timeframe": [
                    timeframe
                ],
                "loan_type": loan_filter,
                "bank_category": [bank_category]
            },
            "disbursement_keys": ["loan_type"]
            
        }, token
    )
    );
    return response.json();
}

export async function getAssetwiseBanks(token, level, name, state, timeframe){
    const response= await fetch(`${url}/asset/insights`,options(
        {
            "location": {
                "state": state,
                "level": level,
                "name": name
            },
            "group_by": level,
            "filters": {
                "timeframe": [
                    timeframe
                ]
            },
            "disbursement_keys": ["bank_category"]
            
        }, token
    )
    );
    return response.json();
}

export async function getLoanWiseAsset(token, level, name, state, timeframe, loan_filter){
    const response= await fetch(`${url}/asset/insights`,options(
        {
            "location": {
                "state": state,
                "level": level,
                "name": name
            },
            "group_by": level,
            "filters": {
                "timeframe": [
                    timeframe
                ],
                "loan_type" : loan_filter
            },
            "disbursement_keys": ["loan_type"]
            
        }, token
    )
    );
    return response.json();
}

export async function getTicketWiseGrowthInsights(token, level, name, state, loan_filter, ticket_filter){
    const response= await fetch(`${url}/asset/insights`,options(
        {
            "location": {
                "state": state,
                "level": level,
                "name": name
            },
            "group_by": level,
            "filters":{
                "loan_type": loan_filter,
                "ticketsize": ticket_filter,
            },            
            "growth_keys": ["loan_type", "ticketsize"]
            
        }, token
    )
    );
    return response.json();

}

export async function getGrowthInsights(token, level, name, state, loan_filter){
    const response= await fetch(`${url}/asset/insights`,options(
        {
            "location": {
                "state": state,
                "level": level,
                "name": name
            },
            "group_by": level,
            "filters":{
                "loan_type": loan_filter
            },
            "growth_keys": []            
        }, token
    )
    );
    return response.json();

}

export async function getLiabilityInsights(token, level, name, state,timeframe){
    const response= await fetch(`${url}/liability/insights`,options(
        {
            "location": {
                "state": state,
                "level": level,
                "name": name
            },
            "group_by": level,
            "filters": {
                "timeframe": [
                    timeframe
                ]
            },
            "disbursement_keys": []           
        }, token
    )
    );
    return response.json();

}
