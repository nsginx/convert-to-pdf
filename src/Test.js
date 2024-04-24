import { getAssetInsights, getAssetwiseBanks, getBankInsights, getBankWiseDisbursement, getBankwiseTicketwiseDisbursement, getBusinessInsights, getBusinessTypes, getEntitySplitInsights, getGrowthInsights, getLiabilityInsights, getLoanWiseAsset, getPlaceArray, getShapeInsights, getTicketSize, getTicketWiseAssetInsights, getTicketWiseGrowthInsights } from "./helpers/DataInsights";
import { getMarketData, getCompetitionData, getProductData, getTargetAudienceData } from "./helpers/PopulateData";
import fetchDataArray from "./helpers/FetchDataArray";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWViMDk3YTA4MjI5YWUyYzZlN2I0MWYiLCJmaXJzdE5hbWUiOiJTb3Vyb2RlZXAiLCJsYXN0TmFtZSI6IkFjaGFyeWEiLCJlbWFpbCI6ImFjaGFyeWFzb3Vyb2RlZXBAZ21haWwuY29tIiwicm9sZXMiOlsiYmFzaWMiXSwiZGVzaWduYXRpb24iOiJJbnRlcm4iLCJjb21wYW55TmFtZSI6IkRTIiwiaXNBdXRob3JpemVkIjp0cnVlLCJwYXNzd29yZCI6bnVsbCwiY3JlYXRlZEF0IjoiMjAyNC0wMy0wOFQxMDoyMDo0OC4yMDNaIiwidXBkYXRlZEF0IjoiMjAyNC0wMy0wOFQxMDoyMDo0OC4yMDNaIiwidGVhbUlEIjoiNjVlYjA4MWEwODIyOWFlMmM2ZTdiNDE5IiwiY3JlYXRlZEJ5IjpudWxsLCJ1cGRhdGVkQnkiOm51bGwsInR5cGUiOiJ0b2tlbiIsImlhdCI6MTcxMDIzOTM3NiwiZXhwIjo0NzEwMjM5Mzc2fQ.Ys5wtgqJeSHY7nQRwKuFrnHaRwp-19K5JvpJK6lfjfE";

async function test(){
    const response= await fetchDataArray(token, "pincode", [700001], "west bengal", ["2023-2024_Q2"], ["Company","Partnership"], ["Slab: Rs. 25 Cr. to 100 Cr."], ["Kirana_store"], ["AL", "HL"], ["public", "private", "nbfc", "foreign"],["2L-4L", "4L-6L" ,"15L-40L" ,"1Cr-2Cr"], ["private"] , false, true);
    // const response= await getLiabilityInsights(token, "pincode", 700001, "west bengal","2023-2024_Q2");
    console.log("hello");
    console.log(response);

}

test();