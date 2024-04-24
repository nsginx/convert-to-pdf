import React, { useEffect, useRef, useState } from 'react'
import ReactEcharts from "echarts-for-react"; 
import generatePDF, { Resolution, Margin } from 'react-to-pdf';
import parseNumToWord from './helpers/ParseNumToWord';
import parseLoanType from './helpers/ParseLoanType';
import ParseTimeframe from './helpers/ParseTimeframe';



export default function Display({data}){
    const pdfOptions= {
        method: 'save',
        // method: 'open',
        filename: `${data.name}_${data.timeframe}`,
        // resolution: Resolution.HIGH,
        canvas: {
            // default is 'image/jpeg' for better size performance
            mimeType: 'image/png/',
            qualityRatio: 1
        },
        overrides: {
            pdf: {
                compress: true
            },
            canvas: {
            useCORS: true
            }
        },
    }


    //ENTITY CHART
    let totalEntity= 0;
    data.target_audience.entity.forEach((item)=> totalEntity+= item.count);
    const entityChartSeries= data.target_audience.entity.map((item, i)=>{
        return {
            name: String.fromCharCode(65+i),
            type: 'bar',
            stack: 'total',
            label: {
              show: false,
              formatter : ((item.count)*100/totalEntity).toFixed(2).toString().concat("%")
            },
            emphasis: {
              focus: 'series'
            },
            // data: [(parseInt(data.target_audience.entity[0].count)*100/(parseInt(data.target_audience.entity[0].count)+parseInt(data.target_audience.entity[1].count)+parseInt(data.target_audience.entity[2].count)+parseInt(data.target_audience.entity[3].count))).toFixed(2)]
            data: [(item.count)*100/totalEntity]
          }
    })
    const entityChartOption = {
        grid: {
          containLabel: false,
        },
        xAxis: {
          type: 'value',
        },
        yAxis: {
          type: 'category',
          data: ['']
        },
        series : entityChartSeries
    };


    //BANK CHART
    const bankChartData = data.competition.liabilities.map((item)=>{
        return {
            value : item.percentage,
            name : item.name,
        }
    });
    const bankChartOption = {
        legend: {
          orient: 'horizontal',
          left: 'center',
          top: 'bottom',
          show: false,
        },
        series: [
          {
            type: 'pie',
            radius: '50%',
            data : bankChartData,
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
                formatter: '{d}'
            },
            labelLayout:{
                avoidLabelOverlap : false
            }
          }
        ]
    }; 


    //GROWTH CHART
    const growthChartSeries= data.product.growth_rate.map((element)=>{
        return {
            name: element.loan_name,
            type: 'line',
            stack: 'Total',
            data: [element.sanction[0].amount, element.sanction[1].amount, element.sanction[2].amount, element.sanction[3].amount, element.sanction[4].amount, element.sanction[5].amount]
        }
    })
    const growthChartLegend= data.product.growth_rate.map((element)=>{
        return element.loan_name;
    })
    const growthChartAxis= data.product.growth_rate[0].sanction.map((item)=>{
        return ParseTimeframe(item.quarter);
    })
    const growthChartOption = {
        legend: {
            data : growthChartLegend
        },
        grid: {
          left: '3%',
          right: '10%',
          bottom: '3%',
          top: '25%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: growthChartAxis,
        },
        yAxis: {
          type: 'value'
        },
        series : growthChartSeries
      };    

    const targetElementRef = useRef(null);
    
    // const [printableContent, setPrintableContent] = useState(null);
    // useEffect(() => {
    //     if (targetElementRef.current) {
    //         setPrintableContent(targetElementRef.current);
    //     }
    // }, []);
    // const getTargetElement = () => printableContent;

    const getTargetElement = () => document.getElementById(`${data.name}_${data.timeframe}`);

    return (
        <div className='w-[820px] mx-auto font-custom'>
        <div ref={targetElementRef} id={`${data.name}_${data.timeframe}`} className='font-work-sans w-[800px] mx-auto px-[20px] flex flex-col'>
            <h1 className="bg-orange-200 w-full h-12 mb-2 text-center font-bold text-amber-700 text-3xl uppercase">{data.name}</h1>
            <div className='h-[1055px] mb-[20px] flex flex-col gap-2'>
                <div className='flex flex-col'>
                    <div className="text-blue-700 text-2xl font-bold">Your Market</div>
                    <div className="h-[1px] bg-slate-400 w-full mt-4"/>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="">
                            <h2 className="font-semibold">Total Business</h2>
                            <div className="font-semibold text-orange-400 text-4xl">{data.market.business.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
                            <div className="text-sm mt-2">GST Registered: <span className="font-semibold">{data.market.business.gst_registered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span></div>
                        </div>
                        <div className="">
                            <h2 className="font-semibold">Total Population</h2>
                            <div className="font-semibold text-orange-400 text-4xl">{data.market.population.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
                            <div className="text-sm mt-2">Salaried Individuals: <span className="font-semibold">{data.market.population.salaried_individuals} %</span></div>
                            <div className="text-sm">Self Employed: <span className="font-semibold">{data.market.population.self_employed} %</span></div>
                            <div className="text-sm">Household Count: <span className="font-semibold">{data.market.population.household_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span></div>
                        
                        </div>
                        <div className="">
                            <h2 className="font-semibold">Liabilities ({ParseTimeframe(data.timeframe)})</h2>
                            <ul className='list-disc ml-4 mb-2'>
                                <li className="text-sm">SA Deposit(Est): <b>&#8377;</b><span className="font-semibold">{parseNumToWord(data.market.liabilities.sa)}</span> </li>
                                <li className="text-sm">CA Deposit(Est): <b>&#8377;</b><span className="font-semibold">{parseNumToWord(data.market.liabilities.ca)}</span> </li>
                            </ul>
                            <h2 className="font-semibold">Assets ({ParseTimeframe(data.timeframe)})</h2>
                            <ul className='list-disc ml-4 mb-2'>
                                {data.market.assets.map((item)=>{
                                    return(
                                        <li className="text-sm">{item.loan_type}: <b>&#8377;</b><span className="font-semibold">{parseNumToWord(item.amount)}</span> </li>
                                    )
                                })}
                                {/* <li className="text-sm">Personal Loan: <b>&#8377;</b><span className="font-semibold">{parseNumToWord(data.market.assets.personal_loan)}</span> </li> */}
                            </ul>
                            
                        </div>
                    </div>
                    <div className="h-[1px] bg-slate-400 w-full mt-4"/>
                </div>
                <div className="flex flex-col">
                    <div className="text-blue-700 text-2xl font-bold">Your Target Audience</div>
                    <div className="h-[1px] bg-slate-400 w-full mt-4"/>
                    <h2 className="font-semibold">Top Categories(GST)</h2>
                    <div className="flex flex-row my-4">
                        {data.target_audience.top_categories.map((item)=>{
                            return(
                                <div className='flex flex-col w-32 justify-center text-center'>
                                    <div className="font-semibold text-orange-400">{parseNumToWord(item.count)}</div>
                                    <div className="text-xs">{item.category.toString().split("_").join(" ")}</div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex flex-row gap-4">
                        <div className="mt-4">
                            <h2 className="font-semibold">Turnover Ranges(GST)</h2>
                            <table className="text-sm mt-4">
                                <tr className="font-semibold text-blue-700">
                                    <td className="p-2 border-[1px] w-64">Turnover Ranges</td>
                                    <td className="p-2 border-[1px] w-28">No. of Businesses</td>
                                </tr>
                                {data.target_audience.turnover.map((item, i)=>{
                                    return (i%2==0)&&(
                                        <>
                                            <tr className='bg-slate-100'>
                                                <td className="p-2 border-[1px] text-xs">{data.target_audience.turnover[i].category}</td>
                                                <td className="p-2 border-[1px]">{parseNumToWord(data.target_audience.turnover[i].count)}</td>
                                            </tr>
                                            {(i<data.target_audience.turnover.length-1)&&
                                            <tr>
                                                <td className="p-2 border-[1px] text-xs">{data.target_audience.turnover[i+1].category}</td>
                                                <td className="p-2 border-[1px]">{parseNumToWord(data.target_audience.turnover[i+1].count)}</td>
                                            </tr>
                                            
                                            }
                                        </>
                                    )
                                })}
                            </table>
                        </div>
                        <div className="mt-4">
                            <h2 className="font-semibold">Entity Type Split(GST)</h2>
                            <table className="text-sm mt-4">
                                {data.target_audience.entity[0] && 
                                <tr className="bg-slate-100">
                                    <td className="p-2 border-[1px] w-48">{data.target_audience.entity[0].name}</td>
                                    <td className="p-2 border-[1px] w-32">{data.target_audience.entity[0].count}</td>
                                    <td className="p-2 border-[1px] w-32">{((data.target_audience.entity[0].count)*100/totalEntity).toFixed(2)}%</td>
                                    <td className="p-2 border-[1px] w-16"><div className="w-4 h-4 m-auto bg-blue-600"></div></td>                        
                                </tr>}
                                {data.target_audience.entity[1] &&
                                <tr className="">
                                    <td className="p-2 border-[1px] w-48">{data.target_audience.entity[1].name}</td>
                                    <td className="p-2 border-[1px] w-32">{data.target_audience.entity[1].count}</td>
                                    <td className="p-2 border-[1px] w-32">{((data.target_audience.entity[1].count)*100/totalEntity).toFixed(2)}%</td>
                                    <td className="p-2 border-[1px] w-16"><div className="w-4 h-4 m-auto bg-green-500"></div></td>                        
                                </tr>}
                                {data.target_audience.entity[2] &&
                                <tr className="bg-slate-100">
                                    <td className="p-2 border-[1px] w-48">{data.target_audience.entity[2].name}</td>
                                    <td className="p-2 border-[1px] w-32">{data.target_audience.entity[2].count}</td>
                                    <td className="p-2 border-[1px] w-32">{((data.target_audience.entity[2].count)*100/totalEntity).toFixed(2)}%</td>
                                    <td className="p-2 border-[1px] w-16"><div className="w-4 h-4 m-auto bg-yellow-500"></div></td>                        
                                </tr>}
                                {data.target_audience.entity[3] &&
                                <tr className="">
                                <td className="p-2 border-[1px] w-48">{data.target_audience.entity[3].name}</td>
                                    <td className="p-2 border-[1px] w-32">{data.target_audience.entity[3].count}</td>
                                    <td className="p-2 border-[1px] w-32">{((data.target_audience.entity[3].count)*100/totalEntity).toFixed(2)}%</td>
                                    <td className="p-2 border-[1px] w-16"><div className="w-4 h-4 m-auto bg-red-500"></div></td>                        
                                </tr>}
                                
                            </table>
                            <div className='-mt-8 -mb-12'>
                                <ReactEcharts option={entityChartOption} style={{ height: "200px", width: "400px" }}/>
                            </div>
                        </div>

                    </div>
                    <div className="h-[1px] bg-slate-400 w-full mt-4"/>
                    

                </div>
            </div>
            <div className='my-[20px] h-[1091px] flex flex-col gap-2'>
                <div className="flex flex-col">
                    <div className="text-blue-700 text-2xl font-bold mb-4">Your Competition</div>
                    <div className="bg-slate-200 flex flex-row justify-between text-xl py-4 px-4">
                        <div className='font-semibold'>By Branches</div>
                        <div className="">Total <span className="text-blue-700 font-semibold">{data.competition.branch.total} branches</span> around you</div>

                    </div>
                    <table className="my-4 text-xs">
                        <tr>
                            {data.competition.branch.banks.map((item)=>{
                                return(
                                    <td key={item.category} className='border-[1px] text-center p-2'>
                                        <h2 className="font-semibold">{item.category}</h2>
                                        <div className="font-bold text-orange-400 text-xl">{parseNumToWord(item.count)}</div>
                                    </td>
                                )
                            })}
                        </tr>
                        <tr>
                            {data.competition.branch.banks.map((item, i)=>{
                                return(
                                    <td key={item.category} className="font-semibold border-[1px] text-xs p-2">Top {item.category} Bank Branches</td>
                                )
                            })}
                        </tr>
                        <tr className="bg-slate-100">
                            {data.competition.branch.banks.map((item)=>{
                                return(
                                    <td className=" border-[1px] p-2">{item.top[0]}</td>
                                )
                            })}
                        </tr>
                        <tr className="">
                            {data.competition.branch.banks.map((item)=>{
                                return(
                                    <td className="border-[1px] p-2">{item.top[1]}</td>
                                )
                            })}
                        </tr>
                        <tr className="bg-slate-100">
                            {data.competition.branch.banks.map((item)=>{
                                return(
                                    <td className="border-[1px] p-2">{item.top[2]}</td>
                                )
                            })}
                        </tr>
                        <tr className="">
                            {data.competition.branch.banks.map((item)=>{
                                return(
                                    <td className="border-[1px] p-2">{item.top[3]}</td>
                                )
                            })}
                        </tr>
                    </table>
                    <div className="flex flex-row justify-between mt-4">
                        <div className=''>
                            <div className="bg-slate-200 p-4 font-semibold">By Assets</div>
                            <h2 className="font-semibold my-2 mx-4">Market Share breakup</h2>
                            <table>
                                {data.competition.assets.map((item, i)=>{
                                    return (i%2==0)&&(
                                        <>
                                            <tr className=''>
                                                <td className="p-2 border-[1px] w-36">{data.competition.assets[i].category}</td>
                                                <td className="p-2 border-[1px] w-28">{data.competition.assets[i].percentage} %</td>
                                            </tr>
                                            <tr className='bg-slate-100'>
                                                <td className="p-2 border-[1px]">{data.competition.assets[i+1].category}</td>
                                                <td className="p-2 border-[1px]">{data.competition.assets[i+1].percentage} %</td>
                                            </tr>
                                        </>
                                    )
                                })}

                            </table>

                        </div>
                        <div className="">
                            <div className="p-4 font-semibold bg-slate-200">By Liabilities</div>
                            <h2 className="font-semibold my-2 mx-4">Market Share breakup</h2>
                            <table className='text-xs'>
                                <tr>
                                    <td className="border-[1px] p-2 w-72">{data.competition.liabilities[0].name}</td>
                                    <td className="border-[1px] p-2 w-28">{data.competition.liabilities[0].count}</td>
                                    <td className='border-[1px] p-2 w-8'><div className="w-4 h-4 m-auto bg-blue-500"></div></td>
                                </tr>
                                <tr className='bg-slate-100'>
                                    <td className="border-[1px] p-2 w-72">{data.competition.liabilities[1].name}</td>
                                    <td className="border-[1px] p-2 w-28">{data.competition.liabilities[1].count}</td>
                                    <td className='border-[1px] p-2 w-8'><div className="w-4 h-4 m-auto bg-lime-500"></div></td>
                                </tr>
                                <tr>
                                    <td className="border-[1px] p-2 w-72">{data.competition.liabilities[2].name}</td>
                                    <td className="border-[1px] p-2 w-28">{data.competition.liabilities[2].count}</td>
                                    <td className='border-[1px] p-2 w-8'><div className="w-4 h-4 m-auto bg-yellow-400"></div></td>
                                </tr>
                                <tr className='bg-slate-100'>
                                    <td className="border-[1px] p-2 w-72">{data.competition.liabilities[3].name}</td>
                                    <td className="border-[1px] p-2 w-28">{data.competition.liabilities[3].count}</td>
                                    <td className='border-[1px] p-2 w-8'><div className="w-4 h-4 m-auto bg-red-400"></div></td>
                                </tr>
                                <tr>
                                    <td className="border-[1px] p-2 w-72">{data.competition.liabilities[4].name}</td>
                                    <td className="border-[1px] p-2 w-28">{data.competition.liabilities[4].count}</td>
                                    <td className='border-[1px] p-2 w-8'><div className="w-4 h-4 m-auto bg-cyan-400"></div></td>
                                </tr>
                                <tr className='bg-slate-100'>
                                    <td className="border-[1px] p-2 w-72">{data.competition.liabilities[5].name}</td>
                                    <td className="border-[1px] p-2 w-28">{data.competition.liabilities[5].count}</td>
                                    <td className='border-[1px] p-2 w-8'><div className="w-4 h-4 m-auto bg-green-600"></div></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div className='ml-auto mr-0 -mt-16'>
                        <ReactEcharts option={bankChartOption} style={{ height: "450px", width: "450px" }}/>

                    </div>

                </div>
            </div>
            <div className={`my-[20px] ${data.all_banks_together?"h-[1091px]":"h-[2222px]"} flex flex-col gap-2`}>
            {/* <div className={`my-[20px] flex flex-col gap-2`}> */}
                <div className="flex flex-col">
                    <div className="text-blue-700 text-2xl font-bold">Products Sold in Your Market</div>
                    <div className="h-[1px] bg-slate-400 w-full mt-4"/>
                    <h2 className="font-semibold my-2">Disbursement ({ParseTimeframe(data.timeframe)})</h2>
                    {data.all_banks_together ? 
                        <table className='text-xs'>
                        <tr className='text-blue-700 font-semibold'>
                            <td className="border-[1px] p-2 w-64">Product</td>
                            <td className="border-[1px] p-2">Average Ticket Size of Sanctioned Loans</td>
                            <td className="border-[1px] p-2">Total Count of Sanctioned Loans</td>
                            <td className="border-[1px] p-2">Total Amount of Sanctioned Loans</td>
                            <td className="border-[1px] p-2">Total Outstanding Amount</td>
                        </tr>
                        {data.product.disbursement.map((item, i)=>{
                            return (i%2==0)&&(
                                <>
                                    <tr>
                                        <td className="border-[1px] p-2">{parseLoanType(data.product.disbursement[i].loan_type)}</td>
                                        <td className="border-[1px] p-2">{data.product.disbursement[i].average_ticketsize}</td>
                                        <td className="p-2 border-[1px]">{data.product.disbursement[i].sanctioned_trades_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                                        <td className="p-2 border-[1px]">&#8377;{parseNumToWord(data.product.disbursement[i].sanctioned_amount)}</td>
                                        <td className="p-2 border-[1px]">&#8377;{parseNumToWord(data.product.disbursement[i].outstanding_amount)}</td>
                                    </tr>
                                    {(i<data.product.disbursement.length-1)&&
                                        <tr className='bg-slate-100'>
                                            <td className="border-[1px] p-2">{parseLoanType(data.product.disbursement[i+1].loan_type)}</td>
                                            <td className="border-[1px] p-2">{data.product.disbursement[i+1].average_ticketsize}</td>
                                            <td className="p-2 border-[1px]">{data.product.disbursement[i+1].sanctioned_trades_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                                            <td className="p-2 border-[1px]">&#8377;{parseNumToWord(data.product.disbursement[i+1].sanctioned_amount)}</td>
                                            <td className="p-2 border-[1px]">&#8377;{parseNumToWord(data.product.disbursement[i+1].outstanding_amount)}</td>
                                        </tr>

                                    }
                                </>

                            )
                        })}
                        </table>
                    : 
                    <div className='mb-[20px] flex flex-col h-[1091px]'>
                    {/* <div className='mb-[20px] flex flex-col'> */}
                        {data.product.seperate_disbursement?.map((bankdata)=>{
                            return(
                                <>
                                    <h2 className="font-semibold text-sm my-2">{bankdata.bank_type.toUpperCase()}</h2>
                                    <table className='text-[10px]'>
                                        <tr className='text-blue-700 font-semibold'>
                                            <td className="border-[1px] p-2 w-64">Product</td>
                                            <td className="border-[1px] p-2">Average Ticket Size of Sanctioned Loans</td>
                                            <td className="border-[1px] p-2">Total Count of Sanctioned Loans</td>
                                            <td className="border-[1px] p-2">Total Amount of Sanctioned Loans</td>
                                            <td className="border-[1px] p-2">Total Outstanding Amount</td>
                                        </tr>
                                        {bankdata.disbursement.map((item, i)=>{
                                            return (i%2==0)&&(
                                                <>
                                                    <tr>
                                                        <td className="border-[1px] p-2">{parseLoanType(bankdata.disbursement[i].loan_type)}</td>
                                                        <td className="border-[1px] p-2">{bankdata.disbursement[i].average_ticketsize}</td>
                                                        <td className="p-2 border-[1px]">{bankdata.disbursement[i].sanctioned_trades_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                                                        <td className="p-2 border-[1px]">&#8377;{parseNumToWord(bankdata.disbursement[i].sanctioned_amount)}</td>
                                                        <td className="p-2 border-[1px]">&#8377;{parseNumToWord(bankdata.disbursement[i].outstanding_amount)}</td>
                                                    </tr>
                                                    {(i<bankdata.disbursement.length-1)&&
                                                        <tr className='bg-slate-100'>
                                                            <td className="border-[1px] p-2">{parseLoanType(bankdata.disbursement[i+1].loan_type)}</td>
                                                            <td className="border-[1px] p-2">{bankdata.disbursement[i+1].average_ticketsize}</td>
                                                            <td className="p-2 border-[1px]">{bankdata.disbursement[i+1].sanctioned_trades_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                                                            <td className="p-2 border-[1px]">&#8377;{parseNumToWord(bankdata.disbursement[i+1].sanctioned_amount)}</td>
                                                            <td className="p-2 border-[1px]">&#8377;{parseNumToWord(bankdata.disbursement[i+1].outstanding_amount)}</td>
                                                        </tr>

                                                    }
                                                </>

                                            )
                                        })}
                                    </table>

                                </>
                            )
                        })}

                    </div>

                    }
                    <h2 className="font-semibold my-4">Delinquency ({ParseTimeframe(data.timeframe)})</h2>
                    <table className='text-xs'>
                        <tr className='text-blue-700 font-semibold'>
                            <td className="border-[1px] p-2 w-64">Product</td>
                            {data.product.delinquency[0].dpd.map((item, i)=>{
                                return <td key={i} className='border-[1px] p-2'>DPD {item.key}</td>
                            })}
                        </tr>
                        {data.product.delinquency.map((item, i)=>{
                            return (i%2==0)&&(
                                <>
                                    <tr>
                                        <td className="p-2 border-[1px]">{data.product.delinquency[i].loan_type}</td>
                                        {data.product.delinquency[i].dpd.map((it)=>{
                                            return <td className='p-2 border-[1px]'>{it.value}</td>
                                        })}
                                    </tr>
                                    {(i<data.product.delinquency.length-1)&&
                                        <tr className='bg-slate-100'>
                                            <td className="p-2 border-[1px]">{data.product.delinquency[i+1].loan_type}</td>
                                            {data.product.delinquency[i+1].dpd.map((it)=>{
                                                return <td className='p-2 border-[1px]'>{it.value}</td>
                                            })}

                                        </tr>
                                    }
                                </>
                            )
                        })}
                    </table>
                    <h2 className="font-semibold my-4">Product-wise Growth (sanctioned)</h2>
                    <div className="">
                                <ReactEcharts option={growthChartOption} style={{ height: `${data.product.disbursement.length<9?"250px":"350px"}`, width: "800px" }}/>
                    </div>
                    
                </div>
            </div>
        </div>
        {/* print button  */}

        <div className='mx-auto my-4 w-auto text-center '>
            <button onClick={() => generatePDF(getTargetElement, pdfOptions)} type="button" className='px-4 py-2 bg-slate-600 text-white rounded-lg'>Export PDF</button>
            {/* <button onClick={convertToPDF} type="button" className='px-4 py-2 bg-slate-600 text-white'>Export PDF</button> */}
        </div>

        <div className="h-4 bg-blue-700 w-full mb-4" />



        </div>
    )
}