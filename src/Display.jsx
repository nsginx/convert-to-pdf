import React from 'react'
// import data from './assets/data.json'
import JsPDF from 'jspdf';
import ReactEcharts from "echarts-for-react"; 




export default function Display({data}) {


    const entityChartOption = {
        grid: {
          containLabel: false,
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: ['']
        },
        series: [
          {
            name: 'A',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [data.target_audience.sole_proprietorship]
          },
          {
            name: 'B',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [data.target_audience.llp]
          },
          {
            name: 'C',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [data.target_audience.companies]
          },
          ,
        ]
      }; 
      
    
    const bankChartOption = {
        legend: {
          orient: 'horizontal',
          left: 'center',
          top: 'bottom'
        },
        series: [
          {
            type: 'pie',
            radius: '45%',
            data: [
              { value: data.competitions.top_bank_shares.shares[0], name: data.competitions.top_bank_shares.names[0]},
              { value: data.competitions.top_bank_shares.shares[1], name: data.competitions.top_bank_shares.names[1]},
              { value: data.competitions.top_bank_shares.shares[2], name: data.competitions.top_bank_shares.names[2]},
              { value: data.competitions.top_bank_shares.shares[3], name: data.competitions.top_bank_shares.names[3]},
              { value: data.competitions.top_bank_shares.shares[4], name: data.competitions.top_bank_shares.names[4]},          
              {value: 100-(data.competitions.top_bank_shares.shares[0]+data.competitions.top_bank_shares.shares[1]+data.competitions.top_bank_shares.shares[2]+data.competitions.top_bank_shares.shares[3]+data.competitions.top_bank_shares.shares[4]), name: "Others"}
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
            },
            label:{
                show : true,
                position: "outer",
                formatter: '{c}'
            },
            labelLayout:{
                avoidLabelOverlap : false
            }
          }
        ]
    }; 
    


  return (
    <div className='w-[850px] mx-auto font-work-sans'>
        <div id="content-id" className='w-[800px] mx-auto px-[20px] flex flex-col h-[3393px]'>
            <h1 className="bg-green-700 w-full h-12 mb-2 text-center font-bold text-white text-lg p-2">{data.city_name}</h1>
            <div className='h-[1055px] mb-[20px] flex flex-col gap-2'>
                <div className="rounded-lg bg-slate-100 drop-shadow-md border-[1px]">
                    <h1 className='text-blue-900 m-3 font-bold text-lg'>Your Market</h1>
                    <hr className='bg-orange-200'/>
                    <div className="grid grid-cols-3 gap-4 mx-3 my-2">
                        <div>
                            <h2 className='font-semibold'>Total Business</h2>
                            <div className='text-orange-400 font-bold my-2 text-lg'>{data.market.total_business}</div>
                            <div className="font-light text-sm my-1">GST Registered : {data.market.gst_registered}</div>
                            <div className="font-light text-sm my-1">Non-GST Registered : {data.market.total_business-data.market.gst_registered}</div>
                        </div>
                        <div>
                            <h2 className='font-semibold'>Total Population</h2>
                            <div className='text-orange-400 font-bold my-2 text-lg'>{parseFloat(data.market.total_population/100000)} Lakhs</div>
                            <div className="font-light text-sm my-1">Salaried Individuals : {data.market.salaried_individuals}</div>
                            <div className="font-light text-sm my-1">Household Count : {data.market.household_count}</div>
                        </div>
                        <div>
                            <h2 className='font-semibold mb-4'>Liabilities(Q4 22-23)</h2>
                            {/* <div className='text-orange-400 font-bold my-2'>{parseFloat(data.market.total_population/100000)} Lakhs</div> */}
                            <div className="font-light text-sm my-1">CA Deposit (Est.)* : <b>&#8377;</b>{data.market.ca_deposit} Cr.</div>
                            <div className="font-light text-sm my-1">SA Deposit (Est.)* : <b>&#8377;</b>{data.market.sa_deposit} Cr.</div>
                            {/* <div className="font-light text-sm my-1">SA Deposit (Est.)* :<b>&#8377;</b> {parseFloat(data.market.sa_deposit/10000000)} Cr.</div> */}
                            <div className='absolute bottom-1 right-2 font-extralight text-xs'>Est.* - Estimated</div>
                        </div>
                    </div>
                </div>
                <div className="rounded-lg bg-slate-100 drop-shadow-md border-[1px]">
                    <h1 className='text-blue-900 m-3 font-bold text-lg'>Your Target Audience</h1>
                    <hr className='bg-orange-200'/>
                    <div className="grid grid-cols-2 gap-8 mx-3 my-2">
                        <div>
                            <h2 className='font-semibold'>Categories (GST)</h2>
                            <div className="flex flex-row justify-center gap-4 mx-2">
                            {data.target_audience.category.map((item)=>{
                                return (
                                    <div key={item.name} className="flex flex-col text-center my-4 pt-2">
                                        <div className="text-lg font-bold text-orange-400">{item.value}</div>
                                        <div className='text-sm'>{item.name}</div>
                                    </div>
                                )
                            })}                          
                                
                            </div>
                            <h2 className='font-semibold my-2'>Turnover Ranges (GST)</h2>
                            <table className='w-full'>
                                <tr>
                                    <td className='bg-[rgb(229,231,235)] border-[1px] border-orange-100 p-2'>{data.target_audience.ranges[0].key_lower} Lakhs- {data.target_audience.ranges[0].key_upper} Lakhs</td>
                                    <td className='bg-[rgb(229,231,235)] border-[1px] border-orange-100 p-2'>{data.target_audience.ranges[0].value}</td>
                                </tr>
                                <tr>
                                    <td className='border-[1px] border-orange-100 p-2'>{data.target_audience.ranges[1].key_lower} Lakhs- {data.target_audience.ranges[1].key_upper} Lakhs</td>
                                    <td className='border-[1px] border-orange-100 p-2'>{data.target_audience.ranges[1].value}</td>
                                </tr>
                            </table>
                        </div>
                        <div>
                            <h2 className='font-semibold'>Entity Type Split</h2>
                            <div className='px-4 -mt-8 -mb-4'>
                                <ReactEcharts option={entityChartOption} style={{ height: "200px", width: "300px" }}/>
                            </div>
                            <table className='w-full text-sm'>
                                <tr>
                                    <td className='bg-[rgb(229,231,235)] border-[1px] border-orange-100 font-semibold p-2'>Sole Proprietorship</td>
                                    <td className='bg-[rgb(229,231,235)] border-[1px] border-orange-100 font-semibold p-2'>{data.target_audience.sole_proprietorship}%</td>
                                </tr>
                                <tr>
                                    <td className='border-[1px] border-orange-100 font-semibold p-2'>LLP</td>
                                    <td className='border-[1px] border-orange-100 font-semibold p-2'>{data.target_audience.llp}%</td>
                                </tr>
                                <tr>
                                    <td className='bg-[rgb(229,231,235)] border-[1px] border-orange-100 font-semibold p-2'>Companies</td>
                                    <td className='bg-[rgb(229,231,235)] border-[1px] border-orange-100 font-semibold p-2'>{data.target_audience.companies}%</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="rounded-lg bg-slate-100 drop-shadow-md border-[1px]">
                    <h1 className='text-blue-900 m-2 font-bold text-lg'>Competitions</h1>
                    <hr className='bg-orange-200'/>
                    <h2 className='font-semibold m-2 ml-4'>Bank Market Share by disbursement</h2>
                    <table className='w-[500px] mx-4 mt-4 text-center'>
                        <tr>
                            <td className='bg-[rgb(229,231,235)] border-[1px] border-orange-100 font-semibold p-2'>Public</td>
                            <td className='bg-[rgb(229,231,235)] border-[1px] border-orange-100 font-semibold p-2'>Private</td>
                            <td className='bg-[rgb(229,231,235)] border-[1px] border-orange-100 font-semibold p-2'>NBFC</td>
                        </tr>
                        <tr>
                            <td className='border-[1px] border-orange-100 font-semibold p-2 text-orange-400'>{data.competitions.bank_market_share.public} %</td>
                            <td className='border-[1px] border-orange-100 font-semibold p-2 text-orange-400'>{data.competitions.bank_market_share.private} %</td>
                            <td className='border-[1px] border-orange-100 font-semibold p-2 text-orange-400'>{data.competitions.bank_market_share.nbfc} %</td>
                        </tr>
                    </table>
                    <div className="flex flex-row my-2">
                        <div>
                            <h2 className='font-semibold m-2 ml-4'>Top Banks</h2>
                            <table className='text-center text-sm w-full mx-4 mt-2'>
                                <tr className='font-bold'>
                                    <td className='py-2'>Top {data.competitions.top_banks.public.length} Public Banks</td>
                                    <td className='py-2'>Top {data.competitions.top_banks.private.length} Private Banks</td>
                                </tr>
                                {data.competitions.top_banks.public.map((item, i)=>{
                                    return (i%2==0)&&(
                                        <>
                                        <tr className='bg-[rgb(229,231,235)]'>
                                            <td className='p-2'>{data.competitions.top_banks.public[i]}</td>
                                            <td className='p-2'>{data.competitions.top_banks.private[i]}</td>
                                        </tr>
                                        {(i<data.competitions.top_banks.public.length-1)&&
                                        <tr>
                                            <td className='p-2'>{data.competitions.top_banks.public[i+1]}</td>
                                            <td className='p-2'>{data.competitions.top_banks.private[i+1]}</td>
                                        </tr>
                                        }
                                        </>
                                    )
                                })}                                
                            </table>
                        </div>
                        <div>
                            <h2 className='font-semibold m-2 text-center'>Market Share by Accounts</h2>
                            <div className='px-4 -mt-20'>
                                    <ReactEcharts option={bankChartOption} style={{ height: "350px", width: "400px" }}/>
                            </div>
                        </div>
                    </div>


                </div>
            </div>       
            <div className='my-[20px] h-[1091px] flex flex-col gap-2'>
                <div className="rounded-lg bg-slate-100 drop-shadow-md border-[1px]">
                    <h1 className='text-blue-900 m-3 font-bold text-lg'>Product Sold in your Market</h1>
                    <hr className='bg-orange-200'/>
                    <h2 className='font-semibold m-3'>Disbursement</h2>
                    <table className='m-3 w-[700px] text-sm text-center'>
                        <tr className=''>
                            <td className="font-semibold py-2">Ticket Size</td>
                            <td className="font-semibold py-2">Amount</td>
                            <td className="font-semibold py-2">Count</td>
                        </tr>
                        <tr>
                            <td className='bg-[rgb(229,231,235)] border-[1px] border-orange-100 p-2'>{data.product.disbursement[0].key_lower} Lakh - {data.product.disbursement[0].key_upper} Lakh</td>
                            <td className='bg-[rgb(229,231,235)] border-[1px] border-orange-100 p-2'>{data.product.disbursement[0].value.amount} Cr.</td>
                            <td className='bg-[rgb(229,231,235)] border-[1px] border-orange-100 p-2'>{data.product.disbursement[0].value.count}</td>
                        </tr>
                        <tr>
                            <td className='border-[1px] border-orange-100 p-2'>{data.product.disbursement[1].key_lower} Lakh - {data.product.disbursement[1].key_upper} Lakh</td>
                            <td className='border-[1px] border-orange-100 p-2'>{data.product.disbursement[1].value.amount} Cr.</td>
                            <td className='border-[1px] border-orange-100 p-2'>{data.product.disbursement[1].value.count}</td>
                        </tr>
                        <tr>
                            <td className='bg-[rgb(229,231,235)] border-[1px] border-orange-100 p-2'>{data.product.disbursement[2].key_lower} Lakh - {data.product.disbursement[2].key_upper} Lakh</td>
                            <td className='bg-[rgb(229,231,235)] border-[1px] border-orange-100 p-2'>{data.product.disbursement[2].value.amount} Cr.</td>
                            <td className='bg-[rgb(229,231,235)] border-[1px] border-orange-100 p-2'>{data.product.disbursement[2].value.count}</td>
                        </tr>
                    </table>
                    <h2 className='font-semibold m-3'>Disbursement (Market Share)</h2>
                    <table className='m-3 w-[700px] mt-2 text-sm text-center'>
                        <tr className=''>
                            <td className="font-semibold py-2">Ticket Size</td>
                            <td className="font-semibold py-2">NBFC</td>
                            <td className="font-semibold py-2">Private</td>
                            <td className="font-semibold py-2">PSU</td>
                        </tr>
                        <tr>
                            <td className='bg-[rgb(229,231,235)] border-[1px] border-orange-100 p-2'>{data.product.disbursement[0].key_lower} Lakh - {data.product.disbursement[0].key_upper} Lakh</td>
                            <td className='bg-[rgb(229,231,235)] border-[1px] border-orange-100 p-2'>{data.product.disbursement[0].value.nbfc} %</td>
                            <td className='bg-[rgb(229,231,235)] border-[1px] border-orange-100 p-2'>{data.product.disbursement[0].value.private} %</td>
                            <td className='bg-[rgb(229,231,235)] border-[1px] border-orange-100 p-2'>{data.product.disbursement[0].value.psu} %</td>
                        </tr>
                        <tr>
                            <td className='border-[1px] border-orange-100 p-2'>{data.product.disbursement[1].key_lower} Lakh - {data.product.disbursement[1].key_upper} Lakh</td>
                            <td className=' border-[1px] border-orange-100 p-2'>{data.product.disbursement[1].value.nbfc} %</td>
                            <td className=' border-[1px] border-orange-100 p-2'>{data.product.disbursement[1].value.private} %</td>
                            <td className=' border-[1px] border-orange-100 p-2'>{data.product.disbursement[1].value.psu} %</td>
                        </tr>
                        <tr>
                            <td className='bg-[rgb(229,231,235)] border-[1px] border-orange-100 p-2'>{data.product.disbursement[2].key_lower} Lakh - {data.product.disbursement[2].key_upper} Lakh</td>
                            <td className='bg-[rgb(229,231,235)] border-[1px] border-orange-100 p-2'>{data.product.disbursement[2].value.nbfc} %</td>
                            <td className='bg-[rgb(229,231,235)] border-[1px] border-orange-100 p-2'>{data.product.disbursement[2].value.private} %</td>
                            <td className='bg-[rgb(229,231,235)] border-[1px] border-orange-100 p-2'>{data.product.disbursement[2].value.psu} %</td>
                        </tr>
                    </table>
                    <div className="text-[10px] mx-2 mb-2">
                    Note : Count of trades and Sanctioned amount values for business loan  are cumulative for the duration of April 2022 - March 2023 at district level
                    </div>
                </div>
                <div className="rounded-lg bg-slate-100 drop-shadow-md border-[1px]">
                    <h1 className='text-blue-900 m-3 font-bold text-lg'>Risk (Delinquency)</h1>
                    <hr className='bg-orange-200'/>
                    <table className='m-3 w-[700px] mt-2 text-sm text-center'>
                        <tr className=''>
                            <td className="font-semibold py-2">Ticket Size</td>
                            <td className="font-semibold py-2">High</td>
                            <td className="font-semibold py-2">Medium</td>
                            <td className="font-semibold py-2">Low</td>
                        </tr>
                        <tr>
                            <td className='bg-[rgb(229,231,235)] border-[1px] border-orange-100 p-2'>{data.product.disbursement[0].key_lower} Lakh - {data.product.disbursement[0].key_upper} Lakh</td>
                            <td className='bg-[rgb(229,231,235)] border-[1px] border-orange-100 p-2'>{data.product.disbursement[0].risk.high}%</td>
                            <td className='bg-[rgb(229,231,235)] border-[1px] border-orange-100 p-2'>{data.product.disbursement[0].risk.medium}%</td>
                            <td className='bg-[rgb(229,231,235)] border-[1px] border-orange-100 p-2'>{data.product.disbursement[0].risk.low}%</td>
                        </tr>
                        <tr>
                            <td className='border-[1px] border-orange-100 p-2'>{data.product.disbursement[1].key_lower} Lakh - {data.product.disbursement[1].key_upper} Lakh</td>
                            <td className=' border-[1px] border-orange-100 p-2'>{data.product.disbursement[1].risk.high}%</td>
                            <td className=' border-[1px] border-orange-100 p-2'>{data.product.disbursement[1].risk.medium}%</td>
                            <td className=' border-[1px] border-orange-100 p-2'>{data.product.disbursement[1].risk.low}%</td>
                        </tr>
                        <tr>
                            <td className='bg-[rgb(229,231,235)] border-[1px] border-orange-100 p-2'>{data.product.disbursement[2].key_lower} Lakh - {data.product.disbursement[2].key_upper} Lakh</td>
                            <td className='bg-[rgb(229,231,235)] border-[1px] border-orange-100 p-2'>{data.product.disbursement[2].risk.high}%</td>
                            <td className='bg-[rgb(229,231,235)] border-[1px] border-orange-100 p-2'>{data.product.disbursement[2].risk.medium}%</td>
                            <td className='bg-[rgb(229,231,235)] border-[1px] border-orange-100 p-2'>{data.product.disbursement[2].risk.low}%</td>
                        </tr>
                    </table>
                    <div className="flex flex-col gap-1 mx-4 mb-2 text-[10px]">
                        <div> Note: The table indicates the High, Medium and low delinquency percentage associated with the ticket size. </div>
                        <div>High : Within/More than 90 DPD, Medium: Within 60 DPD & Low : Within 30 DPD. </div>
                    </div>
                </div>
            
            </div> 
            <div className='my-[20px] h-[1091px] flex flex-col gap-2'>
                <div className="rounded-lg bg-slate-100 drop-shadow-md border-[1px]">
                    <h1 className='text-blue-900 m-3 font-bold text-lg'>Pincode Potentiality</h1>
                    <hr className='bg-orange-200'/>
                    <div className="flex flex-row gap-4">
                        <div className="text-center border-dashed mx-auto my-auto w-[200px] pb-2 border-[1px] font-semibold">Total Pincodes : {data.location.potential.total}</div>
                        <table className='text-center mx-auto w-[400px] my-2'>
                            <tr className='font-bold'>
                                <td className='p-2'>Potential</td>
                                <td className='p-2'>Count</td>
                            </tr>
                            <tr className='bg-green-400'>
                                <td className='border-dashed border-[1px] p-2 font-bold'>High</td>
                                <td className='border-dashed border-[1px] p-2'>{data.location.potential.high}</td>
                            </tr>
                            <tr className='bg-yellow-300'>
                                <td className='border-dashed border-[1px] p-2 font-bold'>Medium</td>
                                <td className='border-dashed border-[1px] p-2'>{data.location.potential.medium}</td>
                            </tr>
                            <tr className='bg-red-400'>
                                <td className='border-dashed border-[1px] p-2 font-bold'>Low</td>
                                <td className='border-dashed border-[1px] p-2'>{data.location.potential.low}</td>
                            </tr>
                        </table>

                    </div>
                </div>
                <div className="rounded-lg bg-slate-100 drop-shadow-md border-[1px]">
                    <h1 className='text-blue-900 m-3 font-bold text-lg'>Top Pincodes and Business Opportunity</h1>
                    <hr className='bg-orange-200'/>
                    <table className='text-center w-[750px] mx-auto my-2'>
                        <tr className='font-bold bg-orange-100'>
                            <td className='p-2 w-[120px]'>Pincode</td>
                            <td className='p-2'>Pincode Name</td>
                            <td className='p-2 w-[120px]'>Potential</td>
                            <td className='p-2 w-[120px]'>Total Disbursement</td>
                            <td className='p-2 w-[120px]'>Total Business</td>
                        </tr>
                        {data.location.pincodes.map((item,i)=>{
                            return (i%2==0)&&(
                                <>
                                    <tr>
                                        <td className="p-2 border-orange-100 border-[1px]">{data.location.pincodes[i].code}</td>
                                        <td className="p-2 border-orange-100 border-[1px]">{data.location.pincodes[i].name}</td>
                                        <td className="p-2 border-orange-100 border-[1px]">{data.location.pincodes[i].potential}</td>
                                        <td className="p-2 border-orange-100 border-[1px]">{data.location.pincodes[i].disbursement}</td>
                                        <td className="p-2 border-orange-100 border-[1px]">{data.location.pincodes[i].business}</td>
                                    </tr>
                                    {(i<data.location.pincodes.length-1)&& 
                                    <tr className='bg-gray-200'>
                                        <td className="p-2 border-orange-100 border-[1px]">{data.location.pincodes[i+1].code}</td>
                                        <td className="p-2 border-orange-100 border-[1px]">{data.location.pincodes[i+1].name}</td>
                                        <td className="p-2 border-orange-100 border-[1px]">{data.location.pincodes[i+1].potential}</td>
                                        <td className="p-2 border-orange-100 border-[1px]">{data.location.pincodes[i+1].disbursement}</td>
                                        <td className="p-2 border-orange-100 border-[1px]">{data.location.pincodes[i+1].business}</td>
                                    </tr>
                                    }
                                </>
                            )
                        })} 
                    </table>

                </div>
                <div className="rounded-lg bg-slate-100 drop-shadow-md border-[1px]">
                    <h1 className='text-blue-900 m-3 font-bold text-lg'>Top Business</h1>
                    <hr className='bg-orange-200'/>
                    <table className='text-center w-[750px] mx-auto my-2'>
                        
                        <tr className='font-bold bg-orange-100'>
                            <td className='p-2'>Business Name</td>
                            <td className='p-2'>Address</td>
                            <td className='p-2'>Merchant Type</td>
                            <td className='p-2 w-[120px]'>Turnover</td>
                        </tr>
                        {data.location.top.map((item, i)=>{
                            return (i%2==0) && (
                                <>
                                    <tr>
                                        <td className="p-2 border-orange-100 border-[1px]">{data.location.top[i].name}</td>
                                        <td className="p-2 border-orange-100 border-[1px]">{data.location.top[i].address}</td>
                                        <td className="p-2 border-orange-100 border-[1px]">{data.location.top[i].type}</td>
                                        <td className="p-2 border-orange-100 border-[1px]">{data.location.top[i].turnover}</td>
                                    </tr>
                                    {(i<data.location.top.length-1) && 
                                    <tr className='bg-gray-200'>
                                        <td className="p-2 border-orange-100 border-[1px]">{data.location.top[i+1].name}</td>
                                        <td className="p-2 border-orange-100 border-[1px]">{data.location.top[i+1].address}</td>
                                        <td className="p-2 border-orange-100 border-[1px]">{data.location.top[i+1].type}</td>
                                        <td className="p-2 border-orange-100 border-[1px]">{data.location.top[i+1].turnover}</td>
                                    </tr>
                                    }
                                </>
                            )
                        })}
                        
                    </table>

                </div>
            </div>
                  
        </div> 
    </div>
  )
}
