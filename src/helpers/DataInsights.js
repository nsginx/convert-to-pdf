import { useState } from "react";

const url= "https://markets.dev.api.datasutram.com";
const authString= "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWViMDk3YTA4MjI5YWUyYzZlN2I0MWYiLCJmaXJzdE5hbWUiOiJTb3Vyb2RlZXAiLCJsYXN0TmFtZSI6IkFjaGFyeWEiLCJlbWFpbCI6ImFjaGFyeWFzb3Vyb2RlZXBAZ21haWwuY29tIiwicm9sZXMiOlsiYmFzaWMiXSwiZGVzaWduYXRpb24iOiJJbnRlcm4iLCJjb21wYW55TmFtZSI6IkRTIiwiaXNBdXRob3JpemVkIjp0cnVlLCJwYXNzd29yZCI6bnVsbCwiY3JlYXRlZEF0IjoiMjAyNC0wMy0wOFQxMDoyMDo0OC4yMDNaIiwidXBkYXRlZEF0IjoiMjAyNC0wMy0wOFQxMDoyMDo0OC4yMDNaIiwidGVhbUlEIjoiNjVlYjA4MWEwODIyOWFlMmM2ZTdiNDE5IiwiY3JlYXRlZEJ5IjpudWxsLCJ1cGRhdGVkQnkiOm51bGwsInR5cGUiOiJ0b2tlbiIsImlhdCI6MTcxMDIzOTM3NiwiZXhwIjo0NzEwMjM5Mzc2fQ.Ys5wtgqJeSHY7nQRwKuFrnHaRwp-19K5JvpJK6lfjfE";
function options(body){
    return(
        {
            method: 'POST',
            headers: {
                "Authorization" : authString,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
    
        }
        
    )
}

export async function getPlaceArray(level, groupBy, name, state){
    const response= await fetch(`${url}/business`,options(
        {
            "location": {
                "state": state,
                "level": level,
                "name": name
            },
            "group_by": groupBy
        }
    )
    );
    return response.json();

}

export async function getShapeInsights(level, name, state){
    const response= await fetch(`${url}/shape/insights`,options(
        {
            "location": {
                "state": state,
                "level": level,
                "name": name
            },
            "group_by": level
        }
        )
        );
        return response.json();
        
    }

export async function getBusinessInsights(level, name, state, business_filter){
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
    }
    )
    );
    return response.json();
    
}

export async function getEntitySplitInsights(level, name, state, entity){
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
        }
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

export async function getBankInsights(level, name, state, bank_filter){
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
        }
    )
    );
    return response.json();

}
export async function getAssetInsights(level, name, state, timeframe, loan_filter){
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
            
        }
    )
    );
    return response.json();

}

//don't add loan_filter to growth insight before fixing frontend for the growth chart 
export async function getGrowthInsights(level, name, state, loan_filter){
    const response= await fetch(`${url}/asset/insights`,options(
        {
            "location": {
                "state": state,
                "level": level,
                "name": name
            },
            "group_by": level,
            // "filters":{
            //     "loan_type": loan_filter
            // },
            "growth_keys": []            
        }
    )
    );
    return response.json();

}

// async function test(){
//     const response= await getEntitySplitFromAPi("pincode", 700001, "west bengal", "Company");
//     console.log("hello");
//     console.log(response);

// }

// test();