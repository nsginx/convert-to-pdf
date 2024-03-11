import React, { useEffect, useRef, useState } from 'react'
import ReactEcharts from "echarts-for-react"; 
import generatePDF, { Resolution, Margin } from 'react-to-pdf';

const options= {
    // method: 'save',
    method: 'open',
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
  

export default function Display({data}) {

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
        series: [
          {
            name: 'A',
            type: 'bar',
            stack: 'total',
            label: {
              show: true,
              formatter: [data.target_audience.entity[0].percentage]
            },
            emphasis: {
              focus: 'series'
            },
            data: [data.target_audience.entity[0].percentage]
          },
          {
            name: 'B',
            type: 'bar',
            stack: 'total',
            label: {
              show: true,
              formatter: [data.target_audience.entity[1].percentage]
            },
            emphasis: {
              focus: 'series'
            },
            data: [data.target_audience.entity[1].percentage]
          },
          {
            name: 'C',
            type: 'bar',
            stack: 'total',
            label: {
              show: true,
              formatter:[data.target_audience.entity[2].percentage]
            },
            emphasis: {
              focus: 'series'
            },
            data: [data.target_audience.entity[2].percentage]
          },
          {
            name: 'D',
            type: 'bar',
            stack: 'total',
            label: {
              show: true,
              formatter: parseFloat(100-(parseFloat(data.target_audience.entity[0].percentage)+parseFloat(data.target_audience.entity[1].percentage)+parseFloat(data.target_audience.entity[2].percentage))).toFixed(2)
            },
            emphasis: {
              focus: 'series'
            },
            data: [100-(parseFloat(data.target_audience.entity[0].percentage)+parseFloat(data.target_audience.entity[1].percentage)+parseFloat(data.target_audience.entity[2].percentage))]
          },
          ,
        ]
      };

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
            data: [
              { value: data.competition.liabilities[0].share, name: data.competition.liabilities[0].name},
              { value: data.competition.liabilities[1].share, name: data.competition.liabilities[1].name},
              { value: data.competition.liabilities[2].share, name: data.competition.liabilities[2].name},
              { value: data.competition.liabilities[3].share, name: data.competition.liabilities[3].name},
              { value: data.competition.liabilities[4].share, name: data.competition.liabilities[4].name},          
              {value: 100-(parseFloat(data.competition.liabilities[0].share)+parseFloat(data.competition.liabilities[1].share)+parseFloat(data.competition.liabilities[2].share)+parseFloat(data.competition.liabilities[3].share)+parseFloat(data.competition.liabilities[4].share)), name: "Others"}
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
                formatter: '{d}'
            },
            labelLayout:{
                avoidLabelOverlap : false
            }
          }
        ]
    }; 

    function parseNumToWord(num){
        num= parseInt(num);
        if(num>9999999){
            return parseFloat(num/10000000).toFixed(2).toString().concat(" Cr.")
        }
        else if(num>99999){
            return parseFloat(num/100000).toFixed(2).toString().concat(" Lakh")
        }
        else if(num){
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); 
        }else{
            return num;
        }
    }

    const targetElementRef = useRef(null);
    const [printableContent, setPrintableContent] = useState(null);

    useEffect(() => {
        if (targetElementRef.current) {
            setPrintableContent(targetElementRef.current);
        }
    }, []);
    // const getTargetElement = () => document.querySelectorAll('.print-content');
    const getTargetElement = () => printableContent;

    return (
        <div className='w-[850px] mx-auto font-work-sans'>
        <div ref={targetElementRef} className='font-work-sans w-[800px] mx-auto px-[20px] flex flex-col h-[3393px]'>
            <h1 className="bg-green-700 w-full h-12 mb-2 text-center font-bold text-white text-3xl uppercase">{data.name}</h1>
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
                            <div className="text-sm mt-2">Salaried Individuals: <span className="font-semibold">{data.market.population.salaried_individuals}%</span></div>
                            <div className="text-sm">Self Employed: <span className="font-semibold">{data.market.population.self_employed}%</span></div>
                            <div className="text-sm">Household Count: <span className="font-semibold">{data.market.population.household_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span></div>
                        
                        </div>
                        <div className="">
                            <h2 className="font-semibold">Liabilities ({data.timeframe})</h2>
                            <ul className='list-disc ml-4 mb-2'>
                                <li className="text-sm">SA Deposit(Est): <b>&#8377;</b><span className="font-semibold">{parseNumToWord(data.market.liabilities.sa)}</span> </li>
                                <li className="text-sm">CA Deposit(Est): <b>&#8377;</b><span className="font-semibold">{parseNumToWord(data.market.liabilities.ca)}</span> </li>
                            </ul>
                            <h2 className="font-semibold">Assets ({data.timeframe})</h2>
                            <ul className='list-disc ml-4 mb-2'>
                                <li className="text-sm">Home Loan: <b>&#8377;</b><span className="font-semibold">{parseNumToWord(data.market.assets.home_loan)}</span> </li>
                                <li className="text-sm">Personal Loan: <b>&#8377;</b><span className="font-semibold">{parseNumToWord(data.market.assets.personal_loan)}</span> </li>
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
                                    <div className="text-sm">{item.name}</div>
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
                                                <td className="p-2 border-[1px]">Slab: {data.target_audience.turnover[i].slab}</td>
                                                <td className="p-2 border-[1px]">{parseNumToWord(data.target_audience.turnover[i].count)}</td>
                                            </tr>
                                            {(i<data.target_audience.turnover.length-1)&&
                                            <tr>
                                                <td className="p-2 border-[1px]">Slab: {data.target_audience.turnover[i+1].slab}</td>
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
                                <tr className="bg-slate-100">
                                    <td className="p-2 border-[1px] w-64">{data.target_audience.entity[0].type}</td>
                                    <td className="p-2 border-[1px] w-32">{data.target_audience.entity[0].percentage} %</td>
                                    <td className="p-2 border-[1px] w-16"><div className="w-4 h-4 m-auto bg-blue-600"></div></td>                        
                                </tr>
                                <tr className="">
                                    <td className="p-2 border-[1px] w-64">{data.target_audience.entity[1].type}</td>
                                    <td className="p-2 border-[1px] w-32">{data.target_audience.entity[1].percentage} %</td>
                                    <td className="p-2 border-[1px] w-16"><div className="w-4 h-4 m-auto bg-green-500"></div></td>                        
                                </tr>
                                <tr className="bg-slate-100">
                                    <td className="p-2 border-[1px] w-64">{data.target_audience.entity[2].type}</td>
                                    <td className="p-2 border-[1px] w-32">{data.target_audience.entity[2].percentage} %</td>
                                    <td className="p-2 border-[1px] w-16"><div className="w-4 h-4 m-auto bg-yellow-500"></div></td>                        
                                </tr>
                                <tr className="">
                                    <td className="p-2 border-[1px] w-64">Others</td>
                                    <td className="p-2 border-[1px] w-32">{parseFloat(100-(parseFloat(data.target_audience.entity[0].percentage)+parseFloat(data.target_audience.entity[1].percentage)+parseFloat(data.target_audience.entity[2].percentage))).toFixed(2)} %</td>
                                    <td className="p-2 border-[1px] w-16"><div className="w-4 h-4 m-auto bg-red-400"></div></td>                        
                                </tr>
                                
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
                    <table className="my-4">
                        <tr>
                            {data.competition.branch.banks.map((item)=>{
                                return(
                                    <td key={item.category} className='border-[1px] text-center p-2'>
                                        <h2 className="font-semibold">{item.category}</h2>
                                        <div className="font-bold text-orange-400 text-2xl">{parseNumToWord(item.count)}</div>
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
                                    <td className="text-sm border-[1px] p-2">{item.top[0]}</td>
                                )
                            })}
                        </tr>
                        <tr className="">
                            {data.competition.branch.banks.map((item)=>{
                                return(
                                    <td className="text-sm border-[1px] p-2">{item.top[1]}</td>
                                )
                            })}
                        </tr>
                        <tr className="bg-slate-100">
                            {data.competition.branch.banks.map((item)=>{
                                return(
                                    <td className="text-sm border-[1px] p-2">{item.top[2]}</td>
                                )
                            })}
                        </tr>
                        <tr className="">
                            {data.competition.branch.banks.map((item)=>{
                                return(
                                    <td className="text-sm border-[1px] p-2">{item.top[3]}</td>
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
                                                <td className="p-2 border-[1px] w-28">{data.competition.assets[i].share} %</td>
                                            </tr>
                                            {(i<data.competition.assets.length-1)&&
                                            <tr className='bg-slate-100'>
                                                <td className="p-2 border-[1px]">{data.competition.assets[i+1].category}</td>
                                                <td className="p-2 border-[1px]">{data.competition.assets[i+1].share} %</td>
                                            </tr>
                                            
                                            }
                                        </>
                                    )
                                })}

                            </table>

                        </div>
                        <div className="">
                            <div className="p-4 font-semibold bg-slate-200">By Liabilities</div>
                            <h2 className="font-semibold my-2 mx-4">Market Share breakup</h2>
                            <table>
                                <tr>
                                    <td className="border-[1px] p-2 w-72">{data.competition.liabilities[0].name}</td>
                                    <td className="border-[1px] p-2 w-28">{data.competition.liabilities[0].share} %</td>
                                    <td className='border-[1px] p-2 w-8'><div className="w-4 h-4 m-auto bg-blue-500"></div></td>
                                </tr>
                                <tr className='bg-slate-100'>
                                    <td className="border-[1px] p-2 w-72">{data.competition.liabilities[1].name}</td>
                                    <td className="border-[1px] p-2 w-28">{data.competition.liabilities[1].share} %</td>
                                    <td className='border-[1px] p-2 w-8'><div className="w-4 h-4 m-auto bg-lime-500"></div></td>
                                </tr>
                                <tr>
                                    <td className="border-[1px] p-2 w-72">{data.competition.liabilities[2].name}</td>
                                    <td className="border-[1px] p-2 w-28">{data.competition.liabilities[2].share} %</td>
                                    <td className='border-[1px] p-2 w-8'><div className="w-4 h-4 m-auto bg-yellow-400"></div></td>
                                </tr>
                                <tr className='bg-slate-100'>
                                    <td className="border-[1px] p-2 w-72">{data.competition.liabilities[3].name}</td>
                                    <td className="border-[1px] p-2 w-28">{data.competition.liabilities[3].share} %</td>
                                    <td className='border-[1px] p-2 w-8'><div className="w-4 h-4 m-auto bg-red-500"></div></td>
                                </tr>
                                <tr>
                                    <td className="border-[1px] p-2 w-72">{data.competition.liabilities[4].name}</td>
                                    <td className="border-[1px] p-2 w-28">{data.competition.liabilities[4].share} %</td>
                                    <td className='border-[1px] p-2 w-8'><div className="w-4 h-4 m-auto bg-cyan-400"></div></td>
                                </tr>
                                <tr className='bg-slate-100'>
                                    <td className="border-[1px] p-2 w-72">Others</td>
                                    <td className="border-[1px] p-2 w-28">{parseFloat(100-(parseFloat(data.competition.liabilities[0].share)+parseFloat(data.competition.liabilities[1].share)+parseFloat(data.competition.liabilities[2].share)+parseFloat(data.competition.liabilities[3].share)+parseFloat(data.competition.liabilities[4].share))).toFixed(2)} %</td>
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
            <div className='my-[20px] h-[1091px] flex flex-col gap-2'>
                <div className="flex flex-col">
                    <div className="text-blue-700 text-2xl font-bold">Products Sold in Your Market</div>
                    <div className="h-[1px] bg-slate-400 w-full mt-4"/>
                    <h2 className="font-semibold my-4">Disbursement ({data.timeframe})</h2>
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
                                        <td className="border-[1px] p-2">{data.product.disbursement[i].loan_type}</td>
                                        <td className="border-[1px] p-2">{parseNumToWord(data.product.disbursement[i].average_ticketsize.lower)}-{parseNumToWord(data.product.disbursement[i].average_ticketsize.upper)}</td>
                                        <td className="p-2 border-[1px]">{data.product.disbursement[i].sanctioned_trades_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                                        <td className="p-2 border-[1px]">&#8377;{parseNumToWord(data.product.disbursement[i].sanctioned_amount)}</td>
                                        <td className="p-2 border-[1px]">&#8377;{parseNumToWord(data.product.disbursement[i].outstanding_balance)}</td>
                                    </tr>
                                    {(i<data.product.disbursement.length-1)&&
                                        <tr className='bg-slate-100'>
                                            <td className="border-[1px] p-2">{data.product.disbursement[i+1].loan_type}</td>
                                            <td className="border-[1px] p-2">{parseNumToWord(data.product.disbursement[i+1].average_ticketsize.lower)}-{parseNumToWord(data.product.disbursement[i+1].average_ticketsize.upper)}</td>
                                            <td className="p-2 border-[1px]">{data.product.disbursement[i+1].sanctioned_trades_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                                            <td className="p-2 border-[1px]">&#8377;{parseNumToWord(data.product.disbursement[i+1].sanctioned_amount)}</td>
                                            <td className="p-2 border-[1px]">&#8377;{parseNumToWord(data.product.disbursement[i+1].outstanding_balance)}</td>
                                        </tr>

                                    }
                                </>

                            )
                        })}
                    </table>
                    <h2 className="font-semibold my-4">Delinquency ({data.timeframe})</h2>
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
                    
                </div>
            </div>
        </div>

        {/* print button  */}

        <div className='mx-auto my-4 w-auto text-center '>
            <button onClick={() => generatePDF(getTargetElement, options)} type="button" className='px-4 py-2 bg-slate-600 text-white rounded-lg'>Export PDF</button>
            {/* <button onClick={convertToPDF} type="button" className='px-4 py-2 bg-slate-600 text-white'>Export PDF</button> */}
        </div>

        <div className="h-4 bg-blue-700 w-full mb-4" />



        </div>
    )
}