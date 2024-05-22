import React, { useState, useEffect } from "react";
import { ResponsivePie } from '@nivo/pie';
//import { Col, Row } from 'antd';
import './DonutPo.css'
import { shallowEqual, useSelector } from "react-redux";
import { message } from "antd";
import axios from "axios";
import { APIs } from "../../../worker";





const DonutPo = () => {

  const [mostView, setMostView] = useState([])

  useEffect(async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userinfo"))
      const { data } = await axios.get(
        `${APIs.baseURL}/product-service/v1/product-count/${userInfo?.manufacturerCode}`,{
          headers: {
            "Content-Type": "application/json",
            "MNF-CODE": `${userInfo?.manufacturerCode}`,
            "Authorization": `Bearer ${userInfo.token}`,
          }
        }
        );
      data.sort((a, b) => {
        if (a.count > b.count) return -1
        if (a.count < b.count) return 1
        else return 0
      })
      let mostViewData = [];

      for (let d of data) {
        const tempObj = {
          id: `${d.productTitle} ${d.id}`,
          label: d.productTitle,
          // color: "#42ABE7",
          value: d.count
        }
        mostViewData.push(tempObj)
        // mostViewData.push(tempObj)
      }
      setMostView(mostViewData)
    } catch (err) {
      message.error(err.responce && err.responce.data.message
        ? err.responce.data.message
        : err.message)
    }

  }, [])


  // const [isMobile,setIsMobile]=useState(false);

  // const windowVw = useSelector(state=>state.resizeWidthVw.size || null, shallowEqual)

  // useEffect(()=>{
  //   setIsMobile(windowVw<= 700?true:false)
  // },[windowVw])


  // console.log(isMobile,"ismobile")
  // const margin = { top: 40, right: 150, bottom: 40, left: 40 };
  // const styles = {
  //   root: {
  //     fontFamily: "consolas, sans-serif",
  //     textAlign: "center",
  //     position: "relative",
  //     width: 500,
  //     height: 400,
  //     //border:"1px solid black"
  //   },
  //   overlay: {
  //     position: "absolute",
  //     top: 0,
  //     right: margin.right,
  //     bottom: 0,
  //     left: margin.left,
  //     display: "flex",
  //     flexDirection: "column",
  //     alignItems: "center",
  //     justifyContent: "center",
  //     fontSize: 50,
  //     // color: "#FFFFFF",
  //     // background: "#FFFFFF33",
  //     textAlign: "center",
  //     // This is important to preserve the chart interactivity
  //     pointerEvents: "none"
  //   },
  //   totalLabel: {
  //     fontSize: 12
  //   }
  // };

  // const data = [
  //   {
  //     id: "Marin Plywood",
  //     label: "Marin Plywood",
  //     color: "#F2B04D",
  //     value: 30
  //   },
  //   {
  //     id: "Teak Veneer",
  //     label: "Teak Veneer",
  //     color: " #81CC46",
  //     value: 12
  //   },
  //   {
  //     id: "PVC ",
  //     label: "PVC ",
  //     color: " #3B5EDB",
  //     value: 8
  //   },
  //   {
  //     id: "Veneer ",
  //     label: "Veneer ",
  //     color: " #9586F0",
  //     value: 25
  //   },
  //   {
  //     id: "Poplar",
  //     label: "Poplar",
  //     color: "#42ABE7",
  //     value: 25
  //   }
  // ];


  // const theme = {
  //   background: "#ffff",
  //   axis: {
  //     fontSize: "14px",
  //     tickColor: "#eee",
  //     ticks: {
  //       line: {
  //         stroke: "#555555"
  //       },
  //       text: {
  //         fill: "#ffffff"
  //       }
  //     },
  //     legend: {
  //       text: {
  //         fill: "#aaaaaa"
  //       }
  //     }
  //   },
  //   grid: {
  //     line: {
  //       stroke: "#555555"
  //     }
  //   }
  // };
  // const commonProps = {
  //   // margin: { top: 10, right: 100, bottom: 80, left: 100 },
  //   // padding: 0.2,
  //   labelTextColor: "inherit:darker(1.4)",
  //   labelSkipWidth: 16,
  //   labelSkipHeight: 16
  // };
  if(mostView.length> 15){
    const updated = mostView.slice(0, 15)
    setMostView(updated)
  }
  return (

    // <Col xs={24} sm={24} md={24} lg={12} xl={12}>  
    <div className="container-dash">
      <h3 className="donut_header">Most view Products</h3>
      <ResponsivePie
        activeOuterRadiusOffset={10}
        animate
        data={mostView}
        colors={{ scheme: 'spectral' }}
        enableArcLinkLabels={false}
        patterns={true}
        legends={[
          {

            anchor: 'left',
            direction: 'column',
            effects: [
              {
                on: 'hover',
                style: {
                  itemTextColor: '#000',
                }
              }
            ],
            itemHeight: 70,
            itemTextColor: '#999',
            // itemWidth: 70,
            symbolShape: 'circle',
            symbolSize: 18,

            // toggleSerie: true,
            // translateY:  0,
            translateX: -140,
            itemsSpacing: -50,
            justify: false,
          }
        ]}
        arcLabelsRadiusOffset={.65}
        // margin={{
        //   bottom: isMobile ? 500: 80,
        //   left: isMobile ? 20 : 20,
        //   right: isMobile ? 20: 50,
        //   top: isMobile ? 20: 0,
        // }}
        margin={{ top: 40, right: 40, bottom: 80, left: 150 }}
        theme={{
          text: {
            fontFamily: '\'SFMono-Regular\', Consolas, \'Liberation Mono\', Menlo, Courier, monospace'
          }
        }}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]]
        }}
        borderWidth={1}
        defs={[
          {
              id: 'dots',
              type: 'patternDots',
              background: 'inherit',
              color: 'rgba(255, 255, 255, 0.3)',
              size: 4,
              padding: 1,
              stagger: true
          },
          {
              id: 'lines',
              type: 'patternLines',
              background: 'inherit',
              color: 'rgba(255, 255, 255, 0.3)',
              rotation: -45,
              lineWidth: 6,
              spacing: 10
          }
      ]}
      // width={500}
      // height={500}
      />
      {/* <ResponsivePie
        {...commonProps}
        data={mostViewData}
        //  width={480}
        height={450}

        margin={{
          top: 20,
          right: 100,
          bottom: 100,
          left: 100,
        }}
        maxValue='auto'
        minValue='auto'
        innerRadius={0.8}
        padAngle={0}
        cornerRadius={1}
        colors={{
          scheme: "nivo"
        }}
        borderWidth={1}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]]
        }}
        radialLabelsSkipAngle={10}
        radialLabelsTextXOffset={6}
        radialLabelsTextColor="#333333"
        radialLabelsLinkOffset={0}
        radialLabelsLinkDiagonalLength={16}
        enableSlicesLabels={true}
        sliceLabel={(item) => `${item.value}%`}
        radialLabelsLinkHorizontalLength={24}
        radialLabelsLinkStrokeWidth={1}
        radialLabelsLinkColor={{
          from: "color"
        }}
        slicesLabelsSkipAngle={10}
        slicesLabelsTextColor="#333333"
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        theme={theme}
        defs={[
          {
            id: "dots",
            type: "patternDots",
            background: "inherit",
            color: "rgba(255, 255, 255, 0.3)",
            size: 4,
            padding: 1,
            stagger: true
          },
          {
            id: "lines",
            type: "patternLines",
            background: "inherit",
            color: "rgba(255, 255, 255, 0.3)",
            rotation: -45,
            lineWidth: 6,
            spacing: 10
          }
        ]}
        fill={[
          {
            match: {
              id: "ruby"
            },
            id: "dots"
          },
          {
            match: {
              id: "c"
            },
            id: "dots"
          },
          {
            match: {
              id: "go"
            },
            id: "dots"
          },
          {
            match: {
              id: "python"
            },
            id: "dots"
          },
          {
            match: {
              id: "scala"
            },
            id: "lines"
          },
          {
            match: {
              id: "lisp"
            },
            id: "lines"
          },
          {
            match: {
              id: "elixir"
            },
            id: "lines"
          },
          {
            match: {
              id: "javascript"
            },
            id: "lines"
          }
        ]}
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            translateY: 40,
            translateX: 20,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: "#999",
            symbolSize: 18,
            itemsSpacing: 4,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#000"
                }
              }
            ]
          }
        ]}
      /> */}
      {/* <div style={styles.overlay}>
    <span>5</span>
   <span style={styles.totalLabel}>total components</span>
 </div>  */}


    </div>
    // </Col>
  )
}









export default DonutPo;


