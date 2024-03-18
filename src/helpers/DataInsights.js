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

export async function getShapeInsights(level, groupBy, name, state){
    const response= await fetch(`${url}/shape/insights`,options(
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
    export async function getBusinessInsights(level, groupBy, name, state){
        const response= await fetch(`${url}/business/insights`,options(
            {
                "location": {
                    "state": state,
                    "level": level,
                    "name": name
                },
                "group_by": groupBy,
                "type_distribution": {
                    "default_types": [
                        "Industrial Plants & Machinery",
                        "Agricultural machinery & equipment",
                        "Industrial Supplies"
                    ],
                    "top_count": 6
                }
            }
            )
            );
            return response.json();
            
        }
export async function getBankInsights(level, groupBy, name, state){
    const response= await fetch(`${url}/bank/insights`,options(
        {
            "location": {
                "state": state,
                "level": level,
                "name": name
            },
            "group_by": groupBy,
            "category_distribution": [
                {
                    "category": "public",
                    "top_count": 4
                },
                {
                    "category": "private",
                    "top_count": 4
                },
                {
                    "category": "nbfc",
                    "top_count": 4
                },
                {
                    "category": "Co-Operative",
                    "top_count": 4
                },
                {
                    "category": "foreign",
                    "top_count": 4
                },
                {
                    "category": "Regional & Rural",
                    "top_count": 4
                }
            ]
        }
    )
    );
    return response.json();

}
export async function getAssetInsights(level, groupBy, name, state, timeframe){
    const response= await fetch(`${url}/asset/insights`,options(
        {
            "location": {
                "state": state,
                "level": level,
                "name": name
            },
            "group_by": groupBy,
            "filters": {
                "timeframe": [
                    timeframe
                ]
            },
            "disbursement_keys": [],
            "delinquency_keys": []
            
        }
    )
    );
    return response.json();

}
export async function getGrowthInsights(level, groupBy, name, state){
    const response= await fetch(`${url}/asset/insights`,options(
        {
            "location": {
                "state": state,
                "level": level,
                "name": name
            },
            "group_by": groupBy,
            "growth_keys": []            
        }
    )
    );
    return response.json();

}