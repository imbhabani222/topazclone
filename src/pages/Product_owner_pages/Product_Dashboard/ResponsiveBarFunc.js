import { ResponsiveBar } from "@nivo/bar";
import { DatePicker } from "antd";
import { useEffect, useState } from "react";
import moment, { months } from "moment";
import axios from "axios";
import { APIs } from "../../../worker";
import { dashboardSales, monthAndWeeklySales } from "../../../action/useraction";
import dayjs from 'dayjs';


const ResponsiveBarFunc = ({ currentTab }) => {

    const [startEndDate, setStartEndDate] = useState({ startState: "", endState: "" });
    const [tableResData, setTableResDate] = useState(new Date());
    const [datePicker, setDatePicker] = useState(new Date())
    const [chartData, setChartData] = useState([]);
    const [totalamount, setTotalAmount] = useState(0)

    const date = new Date();
    let sevendaysago = new Date();
    sevendaysago.setDate(date.getDate() - 6);
    const [topFiveDates, setTopFiveDates] = useState({ start:`${sevendaysago.getFullYear()}-${String(sevendaysago.getMonth()+1).padStart(2, '0')}-${String(sevendaysago.getDate()).padStart(2, '0')}`, end:`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` })
    // const { startState, endState } = startEndDate
    const userInfo = JSON.parse(localStorage.getItem("userinfo"));
    // console.log(start, "--", userInfo.userInfo?.manufacturerCode)
    useEffect(async () => {
        const d = datePicker
        const todayday = String(d.getDate()).padStart(2, '0')
        const todaymonth = String(d.getMonth() + 1).padStart(2, '0')
        const todayyear = d.getFullYear()
        const start = `${todayyear}-${todaymonth}-${todayday}`
        console.log("cur----------------", currentTab)
        if (currentTab === "DAILY") {
            console.log("dailyST----")
            dashboardSales({ start, setChartData, setTotalAmount })
            setStartEndDate({ startState: start })
        }
        console.log("after----------------", currentTab, startEndDate.startState, startEndDate.endState)
    }, [datePicker])

    useEffect(async () => {
        console.log("comming--------------------",currentTab)
        if (currentTab === "WEEKLY") {
            monthAndWeeklySales({ value: "Weekly", setChartData, setTotalAmount })
        } else if (currentTab === "MONTHLY") {
            monthAndWeeklySales({ value: "Monthly", setChartData, setTotalAmount })
        }else if(currentTab==="THREEMONTHS"){
            monthAndWeeklySales({ value: "Months", setChartData, setTotalAmount })
        }else if (currentTab === "THRESHOLD") {
            const res = await axios.get(`${APIs.baseURL}/product-service/v1/product/chart-response/${userInfo?.manufacturerCode}`,{
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${userInfo.token}`,
                }
              }
              )
            console.log(res)
            const chartArray = []
            res.data.forEach(product => {
                if (product.stock < 80) {
                    let execute = true
                    for (let c of chartArray) {
                        if (c.label === product.productTitle) {
                            execute = false;
                            break;
                        }
                    }
                    if (execute) {
                        const chartObj = {
                            "label": product.productTitle,
                            "Utilized threshold": product.threshold - product.stock,
                            "Stock": product.stock,
                            "id": product.productTitle
                        }
                        // "country": "AD",
                        // "hot dog": 92,
                        // "hot dogColor": "hsl(321, 70%, 50%)",
                        // "burger": 44,
                        // "burgerColor": "hsl(169, 70%, 50%)",
                        // "sandwich": 114,
                        // const lab = `${day} Orders : ${product.orderCount}    Sales on `
                        // chartObj["label"] = product.productTitle
                        // chartObj["Threshold"] = product.threshold
                        // chartObj["ThresholdColor"] = "hsl(321, 70%, 50%)"
                        // chartObj["stock"] = product.stock
                        // chartObj["stockColor"] =  "hsl(169, 70%, 50%)"
                        // chartObj["id"] = product.productTitle
                        chartArray.push(chartObj)
                    }
                }
            })
            setChartData(chartArray)
        }
    }, [])

    useEffect(async () => {
        if (currentTab === "TOPFIVE") {
            const chartArray = []
            // const months = [{
            //     orderid: "ORD21",
            //     amountwithtax: "1233"
            // }, {
            //     orderid: "ORD22",
            //     amountwithtax: "1000"
            // }, {
            //     orderid: "ORD23",
            //     amountwithtax: "988"
            // }, {
            //     orderid: "ORD24",
            //     amountwithtax: "902"
            // }, {
            //     orderid: "ORD25",
            //     amountwithtax: "899"
            // }]
            const res = await axios.get(`${APIs.baseURL}/order-service/v1/order/top-five-sales/${userInfo?.manufacturerCode}/${topFiveDates.start}/${topFiveDates.end}`,{
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${userInfo.token}`,
                }
              }
              )
            console.log(res)
            res.data.forEach(product => {
                const chartObj = {}
                chartObj[ product.customer.customerName ] = product.amountwithtax
                chartObj["label"] = product.customer.customerName
                chartObj["id"] =  product.orderid
                chartArray.push(chartObj)
            })
            setChartData(chartArray)
        }
    }, [topFiveDates])

    console.log(chartData)

    // const slice = [...chartData].splice  (0, 10)

    // const getFromDate = (data) => {
    //     if (data) {
    //         setDatePicker(data)
    //         // const startDateInput = moment(data).subtract(1, "days")
    //         // const endDateInput = moment();
    //         // const datas = tableResData.filter(item => {
    //         //   if (moment(item?.orderDate).isBetween(startDateInput, endDateInput)) return item
    //         // })
    //         //  setFilterTable(datas)
    //     }
    //     else {
    //         //  setFilterTable(tableResData)
    //     }

    // }
    // const getToDate = (data) => {
    //     if (data) {
    //         // setEndDate(data)
    //         const startDateInput = moment(datePicker.startDate).subtract(1, "days") || moment().subtract(1, "days")
    //         const endDateInput = moment(data);
    //         const datas = tableResData.filter(item => {
    //             if (moment(item?.orderDate).isBetween(startDateInput, endDateInput)) return item
    //         })
    //         // setFilterTable(datas)
    //     }
    //     else {
    //         // setFilterTable(tableResData)
    //     }

    // }


    //   const commonProps = {
    //   margin: { top: 60, right: 80, bottom: 60, left: 80 },
    //   padding: 0.2,
    //   labelTextColor: "inherit:darker(1.4)",
    //   labelSkipWidth: 16,
    //   labelSkipHeight: 16
    // };
    const { RangePicker } = DatePicker;
    const onRangeChange = (dates, dateStrings) => {
        if (dates) {
            console.log('From: ', dates[0], ', to: ', dates[1]);
            setTopFiveDates({ start: dateStrings[0], end: dateStrings[1] });
        } else {
            console.log('Clear');
        }
    };
    const rangePresets = [
        {
            label: 'Last 7 Days',
            value: [dayjs().add(-7, 'd'), dayjs()],
        },
        {
            label: 'Last 14 Days',
            value: [dayjs().add(-14, 'd'), dayjs()],
        },
        {
            label: 'Last 30 Days',
            value: [dayjs().add(-30, 'd'), dayjs()],
        },
        {
            label: 'Last 90 Days',
            value: [dayjs().add(-90, 'd'), dayjs()],
        },
    ];
    const thresholdKeys = ["Stock", "Utilized threshold"]
    const monthskeys = ["week 1","week 2","week 3","week 4","week 5",]
    const chartLen = chartData.length
    if(chartLen>249){
        const update = [...chartData].slice(0, 249)
        setChartData(update)
    }
    const keys = chartData.map((key) => key.label)
    return (
        <div className={currentTab === "MONTHLY" || currentTab==="THREEMONTHS"  ?"Bar-Chart barchart_monthly_container":currentTab==="DAILY" || currentTab==="WEEKLY"?"Bar-Chart barchart_daily_container" :"Bar-Chart" } >
            <div className="date_container">
                {currentTab === "TOPFIVE" &&
                   <div></div>
                }
                {currentTab === "TOPFIVE" &&
                    <RangePicker presets={rangePresets} onChange={onRangeChange} />
                }
                {currentTab !== "THRESHOLD" && currentTab !== "TOPFIVE" && <div className="total_sales">Total Sales : ₹ {totalamount}</div>}
                {currentTab === "DAILY" &&
                    <DatePicker
                        onChange={(data) => {
                            // console.log(data._d,"-----",new Date())
                            if (data) {
                                setDatePicker(data._d)
                            }
                        }
                        }
                        disabledDate={(current) => {
                            return current && current > moment()
                        }}
                    />}
            </div>

            <div className="chart_responsive" style={{ width: chartLen <= 5 ? "100%" : `${chartLen * 25}%` }}>
                <ResponsiveBar
                    // {...commonProps}
                    indexBy="id"
                    groupMode={currentTab === "THREEMONTHS"? "grouped" :"stacked"}
                    data={chartData}
                    keys={currentTab === "THRESHOLD" ? thresholdKeys :currentTab === "THREEMONTHS" ? monthskeys: keys}
                    enableGridX={false}
                    enableGridY={true}
                    // enableArcLinkLabels={false}
                    layout={"vertical"}
                    margin={{
                        top: 20,
                        right: 40,
                        bottom: 100,
                        left: 80
                    }}
                    borderColor={"silver"}
                    // borderRadius={5}
                    borderWidth={currentTab==="THREEMONTHS"?1:0}
                    // maxValue='auto'
                    // minValue='auto'
                    // width={480}
                    // height={450}  
                    // colorBy={currentTab ==="TOPFIVE"?"indexValue":"id"}
                    colors={currentTab === "THRESHOLD" ? { scheme: "category10" } : currentTab === "TOPFIVE" ? { scheme: "purple_orange" } : { scheme: 'nivo' }}
                    padding={currentTab==="THREEMONTHS"?0.3:chartLen<=1?0.82:chartLen<=2?0.78:chartLen<=3?0.67:chartLen <= 4?0.65:chartLen <= 5?0.58:0.7}
                    innerPadding={0}
                    isInteractive={true}
                    enableLabel={false}
                    // labelSkipWidth={0}
                    // labelSkipHeight={0.5}
                    labelTextColor={{
                        from: 'color',
                        modifiers: [
                            [
                                'darker',
                                3
                            ]
                        ]
                    }}
                    animate={true}
                    isFocusable={true}
                    motionStiffness={90}
                    motionDamping={15}
                    // enableSlicesLabels={false}
                    // enableSlices={false}
                    // sliceLabel={(item) => `${item.value}%`}
                    // enableLabel={true}
                    // labelMargin={50}
                    // label={0}
                    // labelFormat="ce"
                    // textAnchor="middle"
                    // alignmentBaseline="central"
                    // crosshairType="cross"
                    axisTop={null}
                    lineWidth={1}
                    pointSize={15}
                    useMesh={true}
                    // axisBottom={null}
                    axisBottom={currentTab === "TOPFIVE" ? {
                        tickSize: 0,
                        tickPadding: 10,
                        tickRotation: 0,
                    } : {
                        tickPadding: 20,
                        tickRotation: 0,
                        ticksPosition: 0,
                        legendOffset: 34
                    }}
                    axisLeft={currentTab === "TOPFIVE" ? {
                        tickPadding: 20,
                        tickRotation: 0,
                        ticksPosition: 0,
                        legendOffset: 34
                    } : {
                        tickSize: 0,
                        tickPadding: 10,
                        tickRotation: 0,
                    }}

                // legends={[
                //   {
                //     dataFrom: "keys",
                //     anchor: "bottom-left",
                //     direction: "row",
                //     justify: false,
                //     translateY: 55,
                //     translateX: 5,
                //     itemsSpacing: 25,
                //     itemWidth: 100,
                //     itemHeight: 20,
                //     itemDirection: "top-to-bottom",
                //     itemOpacity: 0.85,
                //     symbolSize: 20,
                //     //   legendOffset: 0,
                //     // legendPosition: "middle",
                //     effects: [
                //       {
                //         on: "hover",
                //         style: {
                //           itemOpacity: 1
                //         }
                //       }
                //     ]
                //   }
                // ]}
                />

            </div>
        </div>
    )
}

export default ResponsiveBarFunc