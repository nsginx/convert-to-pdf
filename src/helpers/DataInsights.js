import { useState } from "react";

const url= "https://markets.dev.api.datasutram.com";
const authString= "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWViMDk3YTA4MjI5YWUyYzZlN2I0MWYiLCJmaXJzdE5hbWUiOiJTb3Vyb2RlZXAiLCJsYXN0TmFtZSI6IkFjaGFyeWEiLCJlbWFpbCI6ImFjaGFyeWFzb3Vyb2RlZXBAZ21haWwuY29tIiwicm9sZXMiOlsiYmFzaWMiXSwiZGVzaWduYXRpb24iOiJJbnRlcm4iLCJjb21wYW55TmFtZSI6IkRTIiwiaXNBdXRob3JpemVkIjp0cnVlLCJwYXNzd29yZCI6bnVsbCwiY3JlYXRlZEF0IjoiMjAyNC0wMy0wOFQxMDoyMDo0OC4yMDNaIiwidXBkYXRlZEF0IjoiMjAyNC0wMy0wOFQxMDoyMDo0OC4yMDNaIiwidGVhbUlEIjoiNjVlYjA4MWEwODIyOWFlMmM2ZTdiNDE5IiwiY3JlYXRlZEJ5IjpudWxsLCJ1cGRhdGVkQnkiOm51bGwsInR5cGUiOiJ0b2tlbiIsImlhdCI6MTcxMDIzOTM3NiwiZXhwIjo0NzEwMjM5Mzc2fQ.Ys5wtgqJeSHY7nQRwKuFrnHaRwp-19K5JvpJK6lfjfE";
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

export async function getSeperateDisbursement(token, level, name, state, timeframe, loan_filter, bank_category){
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
                "bank_category" : [
                    bank_category
                ]
            },
            "disbursement_keys": []
            
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

// async function test(){
//     const response= await getSeperateDisbursement("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWViMDk3YTA4MjI5YWUyYzZlN2I0MWYiLCJmaXJzdE5hbWUiOiJTb3Vyb2RlZXAiLCJsYXN0TmFtZSI6IkFjaGFyeWEiLCJlbWFpbCI6ImFjaGFyeWFzb3Vyb2RlZXBAZ21haWwuY29tIiwicm9sZXMiOlsiYmFzaWMiXSwiZGVzaWduYXRpb24iOiJJbnRlcm4iLCJjb21wYW55TmFtZSI6IkRTIiwiaXNBdXRob3JpemVkIjp0cnVlLCJwYXNzd29yZCI6bnVsbCwiY3JlYXRlZEF0IjoiMjAyNC0wMy0wOFQxMDoyMDo0OC4yMDNaIiwidXBkYXRlZEF0IjoiMjAyNC0wMy0wOFQxMDoyMDo0OC4yMDNaIiwidGVhbUlEIjoiNjVlYjA4MWEwODIyOWFlMmM2ZTdiNDE5IiwiY3JlYXRlZEJ5IjpudWxsLCJ1cGRhdGVkQnkiOm51bGwsInR5cGUiOiJ0b2tlbiIsImlhdCI6MTcxMDIzOTM3NiwiZXhwIjo0NzEwMjM5Mzc2fQ.Ys5wtgqJeSHY7nQRwKuFrnHaRwp-19K5JvpJK6lfjfE","pincode", 700001, "west bengal","2023-2024_Q2", ["BL"], "private");
//     console.log("hello");
//     console.log(response);

// }

// test();