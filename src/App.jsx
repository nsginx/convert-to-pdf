import { useState } from "react";
import './App.css';
import { useForm, useFieldArray } from "react-hook-form";
import Display from './Display.jsx';
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

function App(){
  const [data, setData]= useState();
  const form = useForm({
    defaultValues: {
      city_name: "",
      market: {
        total_business: "",
        gst_registered: "",
        total_population: "",
        salaried_individuals: "",
        household_count: "",
        ca_deposit: "",
        sa_deposit: "",
      },
      target_audience: {
        category: [{ name: "", value: "" }],
        ranges: [
          { key_lower: "", key_upper: "", value: "" },
          { key_lower: "", key_upper: "", value: "" },
        ],
        sole_proprietorship: "",
        llp: "",
        companies: "",
      },
      competitions: {
        bank_market_share: { public: "", private: "", nbfc: "" },
        top_banks: {
          public: ["", "", "", ""],
          private: ["", "", "", ""],
        },
        top_bank_shares: {
          names: ["", "", "", "", ""],
          shares: ["", "", "", "", ""],
        },

      },
      product: {
        disbursement: [
          {
            key_upper: "",
            key_lower: "",
            value: { amount: "", count: "", nbfc: "", private: "", psu: "" },
            risk: { high: "", medium: "", low: "" },
          },
          {
            key_upper: "",
            key_lower: "",
            value: { amount: "", count: "", nbfc: "", private: "", psu: "" },
            risk: { high: "", medium: "", low: "" },
          },
          {
            key_upper: "",
            key_lower: "",
            value: { amount: "", count: "", nbfc: "", private: "", psu: "" },
            risk: { high: "", medium: "", low: "" },
          },
        ],
      },
      location: {
        potential: { total: "", high: "", medium: "", low: "" },
        pincodes: [{ code: "", name: "", potential: "", disbursement: "", business: "" }],
        top: [{ name: "", address: "", type: "", turnover: "" }]
      },
    },
  });
  const { register, handleSubmit, control, watch, setValue } = form;
  const pincodes = watch("location.pincodes");
  const topLocations = watch("location.top");

  const addPincode = () => {
    setValue("location.pincodes", [...pincodes, { code: "", name: "", potential: "", disbursement: "", business: "" }]);
  };

  const removePincode = (index) => {
    const updatedPincodes = [...pincodes];
    updatedPincodes.splice(index, 1);
    setValue("location.pincodes", updatedPincodes);
  };

  const addTopLocation = () => {
    setValue("location.top", [...topLocations, { name: "", address: "", type: "", turnover: "" }]);
  };

  const removeTopLocation = (index) => {
    const updatedTopLocations = [...topLocations];
    updatedTopLocations.splice(index, 1);
    setValue("location.top", updatedTopLocations);
  };


  const {
    fields: categoryFields,
    append: appendCategory,
    remove: removeCategory,
  } = useFieldArray({
    name: "target_audience.category",
    control,
  });

  const {
    fields: rangeFields,
    append: appendRange,
    remove: removeRange,
  } = useFieldArray({
    name: "target_audience.ranges",
    control,
  });

  const {
    fields: disbursementFields,
    append: appendDisbursement,
    remove: removeDisbursement,
  } = useFieldArray({
    name: "product.disbursement",
    control,
  });

  const onSubmit = (data) => {
    console.log(data);
    setData(data);
  };

  const getTargetElement = () => document.querySelector('#content-id');
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>Enter Data</h3>
        <div>
          <label htmlFor="city_name">City Name:</label>
          <input type="text" name="city_name" {...register("city_name")} />
        </div>
        <div>
          <label htmlFor="market.total_business">Total business:</label>
          <input
            type="number"
            name="market.total_business"
            {...register("market.total_business", {
              valueAsNumber: true,
            })}
            />
          <label htmlFor="market.gst_registered">GST registered:</label>
          <input
            type="number"
            name="market.gst_registered"
            {...register("market.gst_registered", {
              valueAsNumber: true,
            })}
          />
          <label htmlFor="market.total_population">Population:</label>
          <input
            type="number"
            name="market.total_population"
            {...register("market.total_population", {
              valueAsNumber: true,
            })}
          />
          <label htmlFor="market.salaried_individuals">
            Salaried Individuals:
          </label>
          <input
            type="number"
            name="market.salaried_individuals"
            {...register("market.salaried_individuals", {
              valueAsNumber: true,
            })}
          />
          <label htmlFor="market.household_count">Household Count:</label>
          <input
            type="number"
            name="market.household_count"
            {...register("market.household_count", {
              valueAsNumber: true,
            })}
          />
          <label htmlFor="market.ca_deposit">CA Deposit(in Crores):</label>
          <input
            type="number"
            name="market.ca_deposit"
            {...register("market.ca_deposit", {
              valueAsNumber: true,
            })}
          />
          <label htmlFor="market.sa_deposit">SA Deposit(in Crores):</label>
          <input
            type="number"
            name="market.sa_deposit"
            {...register("market.sa_deposit", {
              valueAsNumber: true,
            })}
          />
        </div>
        <div>
          <div>
            <h1>Target Audience</h1>
            <label htmlFor="target_audience">Categories:</label>
            <div>
              {categoryFields.map((field, index) => (
                <div key={field.id} className="sections">
                  <label htmlFor={`name`}>Name:</label>
                  <input
                    type="text"
                    name={`target_audience.category[${index}].name`}
                    {...register(`target_audience.category[${index}].name`)}
                  />
                  <label htmlFor={`value`}>Count of Business:</label>
                  <input
                    type="text"
                    name={`target_audience.category[${index}].value`}
                    {...register(`target_audience.category[${index}].value`)}
                  />
                  <button type="button" onClick={() => removeCategory(index)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => appendCategory({ name: "", value: "" })}
            >
              Add New Category
            </button>
          </div>

          {/* Ranges */}
          <div>
            <label htmlFor="target_audience.ranges">Turnover Ranges(at least 3):</label>
            <div>
              {rangeFields.map((field, index) => (
                <div key={field.id} className="sections">
                  <label htmlFor={`range_lower_${index}`}>Lower Limit(in Lakhs):</label>
                  <input
                    type="text"
                    name={`target_audience.ranges[${index}].key_lower`}
                    {...register(`target_audience.ranges[${index}].key_lower`)}
                  />
                  <label htmlFor={`range_upper_${index}`}>Upper Limit(in Lakhs):</label>
                  <input
                    type="text"
                    name={`target_audience.ranges[${index}].key_upper`}
                    {...register(`target_audience.ranges[${index}].key_upper`)}
                  />
                  <label htmlFor={`range_value_${index}`}>Count:</label>
                  <input
                    type="text"
                    name={`target_audience.ranges[${index}].value`}
                    {...register(`target_audience.ranges[${index}].value`)}
                  />
                  <button type="button" onClick={() => removeRange(index)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                appendRange({ key_lower: "", key_upper: "", value: "" })
              }
            >
              Add New Range
            </button>
          </div>
          <h1>Entity Split</h1>
          <label htmlFor="target_audience.sole_proprietorship">
            Sole Proprietorship:
          </label>
          <input
            type="number"
            name="target_audience.sole_proprietorship"
            {...register("target_audience.sole_proprietorship", {
              valueAsNumber: true,
            })}
          />
          <label htmlFor="target_audience.llp">LLP:</label>
          <input
            type="number"
            name="target_audience.llp"
            {...register("target_audience.llp", {
              valueAsNumber: true,
            })}
          />
          <label htmlFor="target_audience.companies">Companies:</label>
          <input
            type="number"
            name="target_audience.companies"
            {...register("target_audience.companies", {
              valueAsNumber: true,
            })}
          />
        </div>
        <div>
          <h1>Competitions</h1>
          <h2>Market Share Percentage</h2>
          <label htmlFor="competitions.bank_market_share.public">public:</label>
          <input
            type="number"
            name="competitions.bank_market_share.public"
            {...register("competitions.bank_market_share.public", {
              valueAsNumber: true,
            })}
          />
          <label htmlFor="competitions.bank_market_share.private">private:</label>
          <input
            type="number"
            name="competitions.bank_market_share.private"
            {...register("competitions.bank_market_share.private", {
              valueAsNumber: true,
            })}
          />
          <label htmlFor="competitions.bank_market_share.nbfc">nbfc:</label>
          <input
            type="number"
            name="competitions.bank_market_share.nbfc"
            {...register("competitions.bank_market_share.nbfc", {
              valueAsNumber: true,
            })}
          />
        <div>
          <label htmlFor="competitions.top_banks.public">Top Public Banks:</label>
          <div>
            {form.watch("competitions.top_banks.public").map((bank, index) => (
              <input key={index} type="text" {...register(`competitions.top_banks.public[${index}]`)} />
            ))}
          </div>
          <label htmlFor="competitions.top_banks.private">Top Private Banks:</label>
          <div>
            {form.watch("competitions.top_banks.private").map((bank, index) => (
              <input key={index} type="text" {...register(`competitions.top_banks.private[${index}]`)} />
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="competitions.top_bank_shares.names">Overall Top Bank Names:</label>
          <div>
            {form.watch("competitions.top_bank_shares.names").map((name, index) => (
              <input key={index} type="text" {...register(`competitions.top_bank_shares.names[${index}]`)} />
            ))}
          </div>
          <label htmlFor="competitions.top_bank_shares.shares">Their Shares:</label>
          <div>
            {form.watch("competitions.top_bank_shares.shares").map((share, index) => (
              <input key={index} type="text" {...register(`competitions.top_bank_shares.shares[${index}]`,{
                valueAsNumber:true
              })} />
            ))}
          </div>
        </div>
        </div>
        {/* Product Disbursement */}
        <div>
          <h1>Sold Product</h1>
          <label htmlFor="product.disbursement">Disbursement Tickets(3):</label>
          <div>
            {disbursementFields.map((field, index) => (
              <div key={field.id} className="sections">
                <label>Upper Boundary of Ticket Size(in Lakhs):</label>
                <input
                  type="text"
                  {...register(`product.disbursement[${index}].key_upper`,{
                    valueAsNumber:true
                  })}
                />
                <label>Lower Boundary of Ticket Size(in Lakhs):</label>
                <input
                  type="text"
                  {...register(`product.disbursement[${index}].key_lower`,{
                    valueAsNumber:true
                  })}
                />

                {/* Value */}
                <div>
                  <label>Total Amount of Ticket(in Crores):</label>
                  <input
                    type="text"
                    {...register(`product.disbursement[${index}].value.amount`,{
                      valueAsNumber:true
                    })}
                  />
                  <label>Count:</label>
                  <input
                    type="text"
                    {...register(`product.disbursement[${index}].value.count`,{
                      valueAsNumber:true
                    })}
                  />
                  <label>market share of NBFC(%):</label>
                  <input
                    type="text"
                    {...register(`product.disbursement[${index}].value.nbfc`,{
                      valueAsNumber:true
                    })}
                  />
                  <label>market share of Private(%):</label>
                  <input
                    type="text"
                    {...register(`product.disbursement[${index}].value.private`,{
                      valueAsNumber:true
                    })}
                  />
                  <label>market share of PSU(%):</label>
                  <input
                    type="text"
                    {...register(`product.disbursement[${index}].value.psu`,{
                      valueAsNumber:true
                    })}
                  />
                </div>
                {/* Risk */}
                <div>
                  <label>High Risk Tickets(%):</label>
                  <input
                    type="text"
                    {...register(`product.disbursement[${index}].risk.high`,{
                      valueAsNumber:true
                    })}
                  />
                  <label>Medium Risk Tickets(%):</label>
                  <input
                    type="text"
                    {...register(`product.disbursement[${index}].risk.medium`,{
                      valueAsNumber:true
                    })}
                  />
                  <label>Low Risk Tickets(%):</label>
                  <input
                    type="text"
                    {...register(`product.disbursement[${index}].risk.low`,{
                      valueAsNumber:true
                    })}
                  />
                </div>

                <button type="button" onClick={() => removeDisbursement(index)}>
                  Remove Ticket
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() =>
              appendDisbursement({
                key_upper: "",
                key_lower: "",
                value: { amount: "", count: "", nbfc: "", private: "", psu: "" },
                risk: { high: "", medium: "", low: "" },
              })
            }
          >
            Add Ticket
          </button>
        </div>
        <div>
          <h1>Your Market</h1>
          <h2>Potential Pincodes:</h2>
          <label htmlFor="location.potential.total">total:</label>
          <input
            type="number"
            name="location.potential.total"
            {...register("location.potential.total", {
              valueAsNumber: true,
            })}
          />
          <label htmlFor="location.potential.high">high:</label>
          <input
            type="number"
            name="location.potential.high"
            {...register("location.potential.high", {
              valueAsNumber: true,
            })}
          />
          <label htmlFor="location.potential.medium">medium:</label>
          <input
            type="number"
            name="location.potential.medium"
            {...register("location.potential.medium", {
              valueAsNumber: true,
            })}
          />
          <label htmlFor="location.potential.low">low:</label>
          <input
            type="number"
            name="location.potential.low"
            {...register("location.potential.low", {
              valueAsNumber: true,
            })}
          />
          <br />
        <label>Top Pincodes:</label>
          {pincodes.map((pincode, index) => (
            <div key={index} className="sections">
              <input type="text" {...register(`location.pincodes[${index}].code`)} placeholder="Pincode" />
              <input type="text" {...register(`location.pincodes[${index}].name`)} placeholder="Name" />
              <input type="text" {...register(`location.pincodes[${index}].potential`)} placeholder="Potentiality" />
              <input type="text" {...register(`location.pincodes[${index}].disbursement`)} placeholder="Total Disbursement" />
              <input type="text" {...register(`location.pincodes[${index}].business`)} placeholder="Total Business" />
              <button type="button" onClick={() => removePincode(index)}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={addPincode}>Add Pincode</button>
        </div>

        <div>
          <label>Top Locations:</label>
          {topLocations.map((top, index) => (
            <div key={index} className="sections">
              <input type="text" {...register(`location.top[${index}].name`)} placeholder="Name" />
              <input type="text" {...register(`location.top[${index}].address`)} placeholder="Address" />
              <input type="text" {...register(`location.top[${index}].type`)} placeholder="Type" />
              <input type="text" {...register(`location.top[${index}].turnover`)} placeholder="Turnover" />
              <button type="button" onClick={() => removeTopLocation(index)}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={addTopLocation}>Add Location</button>
        </div>

        <button type="submit" id="submitButton">Submit</button>
      </form>
      {data &&
        <>
          <div className='mx-auto my-4 w-auto text-center '>
              <button onClick={() => generatePDF(getTargetElement, options)} type="button" className='px-4 py-2 bg-slate-600 text-white rounded-lg'>Export PDF</button>
              {/* <button onClick={convertToPDF} type="button" className='px-4 py-2 bg-slate-600 text-white'>Export PDF</button> */}
          </div>
          <Display data={data}/>
        </>}
    </>
  );
};

export default App;
