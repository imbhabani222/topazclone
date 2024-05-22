import React, { useState } from "react";
import './PODashboard.css'
import ResponsiveBarFunc from "./ResponsiveBarFunc";
import { Tabs } from "antd";
//import AutoSizer from "react-virtualized-auto-sizer";

// const sales = []



// let tempdata = [];
// let tempkeys = [] 
// for(let i=1; i<=50; i++){
//   let tempObj = {}
//   const title = async()=>{
//     // const data = await axios.get("https://randomuser.me/api")
//     // const name = data.data.results[0].name.first
//     // console.log(data)
//     tempObj[i.toString()] = i
//     tempObj["label"] = i
//     tempObj["id"] = i
//     tempkeys.push(i)
//     tempdata.push(tempObj)
//   }
//   title()
// }

// console.log(tempdata,tempkeys)



const PODashboard = () => {

  const { TabPane } = Tabs;

  const date = new Date("2023-06-09")
  const [currentTab, setCurrentTab] = useState("DAILY")

  // const [sales, setsales] = useState({
  //   daily: [],
  //   weekly: [],
  //   topfive: [],
  //   threshold: [],
  // })
  // const thresholdstock = []
  // const dailySales = {}
  // const weeklySales = {}
  // const topfiveSales = {}
  // useEffect(() => {
  //   if (Object.keys(data).length > 0) {
  //     console.log("data-=---", data)
  //     for (let key in data) {
  //       if (key in topfiveSales) {
  //         topfiveSales[key] += data[key].quantity
  //       } else {
  //         topfiveSales[key] = data[key].quantity
  //       }
  //       if (data[key].threshold < 100) {
  //         const tempThreshold = {
  //           id: key,
  //           label: key,
  //           color: "#42ABE7",
  //         }
  //         tempThreshold[key] = data[key].threshold
  //         thresholdstock.push(tempThreshold)
  //       }
  //       data[key].dates.forEach(itemDate => {
  //         const idate = new Date(itemDate)
  //         if (idate.getMonth() === todaymonth && idate.getFullYear() === todayyear && idate.getDate() === todayday) {
  //           if (key in dailySales) {
  //             dailySales[key] += data[key].quantity
  //           } else {
  //             dailySales[key] = data[key].quantity
  //           }
  //         }
  //         if (idate >= sevenDaysAgo && idate >= sevenDaysAgo && idate <= d <= d) {
  //           if (key in weeklySales) {
  //             weeklySales[key] += data[key].quantity
  //           } else {
  //             weeklySales[key] = data[key].quantity
  //           }
  //         }

  //       });
  //     }
  //     let tempdaily = []
  //     for (let key in dailySales) {
  //       const tempobj = {
  //         id: key,
  //         label: key,
  //         color: "#42ABE7",
  //       }
  //       tempobj[key] = dailySales[key]
  //       tempdaily.push(tempobj)
  //     }
  //     let tempweekly = []
  //     for (let key in weeklySales) {
  //       const tempobj = {
  //         id: key,
  //         label: key,
  //         color: "#42ABE7",
  //       }
  //       tempobj[key] = weeklySales[key]
  //       tempweekly.push(tempobj)
  //     }
  //     let temptopfive = []
  //     for (let key in topfiveSales) {
  //       const tempobj = {
  //         id: key,
  //         label: key,
  //         color: "#42ABE7",
  //       }
  //       tempobj[key] = topfiveSales[key]
  //       temptopfive.push(tempobj)
  //     }
  //     temptopfive.sort((a, b) => {
  //       if (Object.values(a)[3] > Object.values(b)[3]) {
  //         return -1
  //       } else if (Object.values(a)[3] < Object.values(b)[3]) {
  //         return 1
  //       } else {
  //         return 0
  //       }
  //     })
  //     thresholdstock.sort((a, b) => {
  //       if (Object.values(a)[3] > Object.values(b)[3]) {
  //         return 1
  //       } else if (Object.values(a)[3] < Object.values(b)[3]) {
  //         return -1
  //       } else {
  //         return 0
  //       }
  //     })
  //     temptopfive = temptopfive.slice(0, 5)
  //     setsales({ topfive: temptopfive, weekly: tempweekly, daily: tempdaily, threshold: thresholdstock })
  //   }
  // }, [data])
  // console.log("sales-----------", sales)
  // const changeHeaderHandler = (e) => {
  //   // setSalesHeader()
  // }




  return (
    <Tabs
      defaultActiveKey="DAILY"
      onChange={(key) => setCurrentTab(key)}
      className="chart_bar_container"
    >
      <TabPane tab="Daily Sales" key="DAILY" >
        <ResponsiveBarFunc currentTab={currentTab} />
      </TabPane>
      <TabPane tab="Weekly Sales" key="WEEKLY" className="chart_bar_tabs">
        <ResponsiveBarFunc currentTab={currentTab} />
      </TabPane>
      <TabPane tab="Monthly Sales" key="MONTHLY" >
        <Tabs
          defaultActiveKey="MONTHLY"
          onChange={(key) => setCurrentTab(key)}
        >
          <TabPane tab="Current Month" key="MONTHLY">
            <ResponsiveBarFunc currentTab={currentTab} />
          </TabPane>
          <TabPane tab="Last Three Months" key="THREEMONTHS">
            <ResponsiveBarFunc currentTab={currentTab} />
          </TabPane>
        </Tabs>
      </TabPane>
      {/* <TabPane tab="Top 5 Sales" key="TOPFIVE" >
        <ResponsiveBarFunc currentTab={currentTab} />
      </TabPane>
      <TabPane tab="Threshold" key="THRESHOLD" >
        <ResponsiveBarFunc currentTab={currentTab} />
      </TabPane> */}
    </Tabs>

  )
}

export default PODashboard






