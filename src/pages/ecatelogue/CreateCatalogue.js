import React, { useState, useEffect } from "react"
import {
  pdf,
  Page,
  Text,
  usePDF,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Image,
  PDFDownloadLink
} from "@react-pdf/renderer"
import { APIs } from "../../worker"
import axios from "axios"
import { Row, Col, Button, Form, Upload, Input, message, Modal, Checkbox, Select } from "antd"

import { FilterOutlined, LeftOutlined, PlusOutlined, StarOutlined } from "@ant-design/icons"
import ProductImages from "./productImages"
import { useDispatch, useSelector } from "react-redux"
import { viewCategory } from "../../action/useraction"
import UploadCatelogue from "./uploadCatelogue";

// Create styles
const styles = StyleSheet.create({
  productList: {
    marginHorizontal: "auto",
    marginVertical: 16,
    height: 642.09,
    width: 500,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    justifyContent: "space-between",
    flexWrap: "wrap"
  },
  page: {
    flexDirection: "column",
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  section: {
    height: 50,
    marginHorizontal: 38,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    position: "relative",
    top: 18,
    borderBottom:"2px solid #c60000"
  },
  imageid: {
    fontWeight: 500,
    padding: 10,
    width:"50%"
  },
  title: {
    backgroundColor: "#c60000",
    fontSize: 19,
    height: "100%",
    fontWeight: '900',
    paddingTop: 15,
    paddingBottom: 5,
    color: "white",
    width: "40%",
    textAlign: 'center',
  },
  brand_name: {
    color: "red"
  },
  brand: {
    fontSize: 19,
    height: "100%",
    fontWeight: '900',
    paddingTop: 15,
    paddingBottom: 5,
    color: "black",
    width: "49%",
    textAlign: "left",
    position: "relative",
    left: -40,
  },
  arrow_left: {
    width: 0,
    height: 0,
    borderTop: "15px solid #f5f5f5",
    borderRight: "25px solid #c60000",
    position: "absolute",
    top: -15
  },
  arrow_down: {
    position:"absolute",
    top: -3,
    right:-20,
    width: 0,
    height: 0,
    borderLeft: "15px solid #f5f5f5",
    borderRight: "15px solid #f5f5f5",
    borderTop: "15px solid #c60000",
  },
  arrow_right: {
    position: "absolute",
    top: -20,
    right: -35,
    width: "15%",
    backgroundColor: "#c60000",
    textAlign: "center",
    color: "#fff",
    paddingVertical: 5,
    borderRadius: 5,
    fontSize:10,
  },
  description: {
    height: 97.8,
    // backgroundColor: "red"
  },
  desText: {
    width: 500,
    marginHorizontal: "auto",

  },
  imageStyles: {
    width: "100%",
    height: "100%"
  },
  temp1img1: {
    display: "block",
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  temp2img1: {
    width: "62%",
    height: "59%",
    overflow: "hidden",
  },
  temp2img2: {
    width: "40%",
    height: "40%",
    overflow: "hidden",
    position:'relative',
    left:"250px"
  },
  temp3img1: {
    width: "30%",
    height: "30%",
    overflow: "hidden",
  },
  temp3img2: {
    width: "55%",
    height: "55%",
    overflow: "hidden",
  },
  temp3img3: {
    width: "40%",
    height: "40%",
    overflow: "hidden",
    position:'relative',
    left:"60px"
  },
  temp4img1: {
    width: "49%",
    height: "49%",
    overflow: "hidden",
  },
  temp4img2: {
    width: "49%",
    height: "49%",
    overflow: "hidden",
  },
  temp4img3: {
    width: "49%",
    height: "49%",
    overflow: "hidden",
  },
  temp4img4: {
    width: "49%",
    height: "49%",
    overflow: "hidden",
  },
  temp5img1: {
    width: "40%",
    height: "40%",
    overflow: "hidden",
  },
  temp5img2: {
    width: "55%",
    height: "55%",
    overflow: "hidden",
  },
  temp5img3: {
    width: "32%",
    height: "32%",
    overflow: "hidden",
  },
  temp5img4: {
    width: "32%",
    height: "32%",
    overflow: "hidden",
  },
  temp5img5: {
    width: "32%",
    height: "32%",
    overflow: "hidden",
  },
})

function CreateCatalogue({ eCatalogue, setECatalogue, onKeyChange }) {
  const [productList, setProductList] = useState([])
  const [selectedProduct, setSelectedProduct] = useState([])
  const [categoryOptions, setCategoryOptions] = useState([])
  const [brandOptions, setBrandOptions] = useState([])
  const [brandCategory, setBrandCategory] = useState({ brand: "", category: "", brandOrCate: ["List All"] })
  const [showFilters, setShowFilters] = useState(false)
  const [createCat, setCreateCat] = useState(false)
  // const [pdfBlobData, setpdfBlobData] = useState()
  // const [temptrue, setTemptrue] = useState(true)
  const [fileNamePdf, setfileNamePdf] = useState("")
  const dispatch = useDispatch()
  const userInfo = JSON.parse(localStorage.getItem("userinfo"))


  const viewcategorys = useSelector(
    (state) => state.category.viewCategoryResponse
  )


  useEffect(() => {
    if (viewcategorys) {
      const categoryArr = []
      viewcategorys.forEach((category) => {
        categoryArr.push({ value: category.categoryName, label: category.categoryName })
      })
      setCategoryOptions(categoryArr)
      setBrandCategory({ ...brandCategory, category: categoryArr[0].label })
    }
  }, [viewcategorys])
  const discriptionHandler = (editor) => {
    let spdata = editor.replace("<p>", "")
    let epdata = spdata.replace("</p>", "")
    let ssdata = epdata.replace("<strong>", "")
    let esdata = ssdata.replace("</strong>", "")
    esdata = esdata.replace("</h2>", "")
    esdata = esdata.replace("<h2>", "")
    esdata = esdata.replace("<h3>", "")
    esdata = esdata.replace("<h4>", "")
    esdata = esdata.replace("</h4>", "")
    esdata = esdata.replace("</h3>", "")
    esdata = esdata.replace("<i>", "")
    esdata = esdata.replace("</i>", "")
    return esdata
  }



  useEffect(() => {
    // const getProducts = () => {
    axios
      .get(
        `${APIs.baseURL}/product-service/v1/product-brands/${userInfo.manufacturerCode}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userInfo.token}`,
          }
        }
      )
      .then((res) => {
        // console.log(res)
        const brandsArr = []
        res.data.forEach(brand => {
          brandsArr.push({ value: brand, label: brand })
        });
        setBrandOptions(brandsArr)
        setBrandCategory({ ...brandCategory, brand: brandsArr[0].label })
      })
    // }
    // getProducts()
    dispatch(viewCategory())
    filterApplyHandler()
    // https://topaz.hutechweb.com/topaz-webapp/get/brand/{manufacturerCode}
  }, [])


  const isListAll = () => {
    let listall = false;
    brandCategory.brandOrCate.forEach((item) => {
      if (item === "List All") {
        listall = true;
      }
    })
    return listall
  }
  const filterApplyHandler = () => {
    if (isListAll()) {
      axios
        .get(
          `${APIs.baseURL}/product-service/v1/product-detail/${userInfo.manufacturerCode}`, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${userInfo.token}`,
            }
          }        )
        .then((res) => {
          const list = res.data
          setProductList(list)
        })
    } else if (brandCategory.brandOrCate.length) {
      axios
        .get(
          `${APIs.baseURL}/filter/${userInfo.manufacturerCode}?category=${brandCategory.category ? brandCategory.category : ""}&brand=${brandCategory.brand ? brandCategory.brand : ""}`
        )
        .then((res) => {
          console.log(res)
          setProductList(res.data)
        })
    }

  }
  // console.log(brandCategory,brandOptions)
  // const alreadySelected = (id) => {
  //   return selectedProduct.find((product) => product.productid === id)
  // }

  const removeSelected = (id) => {
    return selectedProduct.filter((product) => product.productid !== id)
    // color change after remove
  }

  const addRemoveProduct = (product) => {
    if (selectedProduct.length === 0) {
      setSelectedProduct([product])
    } else {
      // if (!alreadySelected(product.productid)) {
      setSelectedProduct([...selectedProduct, product])
      //color change after add
      // }
      // else {
      //   setSelectedProduct(removeSelected(product.productid))
      // }
    }
  }


  const getBase64FromUrl = async (url) => {


    //   const data = await fetch(url)
    // const blob = await data.blob()
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsDataURL(url.blob)
      reader.onloadend = () => {
        const base64data = reader.result
        resolve(base64data)
        console.log(base64data)
      }
    })
  }
  // getBase64FromUrl(pdfBlobData)
  // console.log("pdfblob------------  ",pdfBlobData)
  let temp;
  let img;

  // const file = {
  //   url: url,
  //   withCredentials: true
  // };
  // console.log("file-----------",selectedProduct)
  // onRender={(url) => {
  //   // if (temptrue) {
  //   //   // const pdf = new FormData()
  //   //   // pdf.append("file", blob.blob)
  //   //   setpdfBlobData(blob)
  //   //   setTemptrue(false)
  //   console.log("blob----------", url)
  //   // }
  // }}
  //   children={({ blob, url, loading, error }) => {
  //     console.log(blob)
  //   }}
  const MyDoc = (
    <PDFViewer>
      <Document style={styles.document}>
        <Page size="A4" style={styles.page}>
          {selectedProduct
            ? selectedProduct.map((product) => (
              <div key={product.productid}>
                {img = 0}
                <View style={styles.section}>
                  <View style={styles.arrow_left}></View>
                  <View style={styles.arrow_down}></View>
                  <View style={styles.arrow_right}><Text>{product.collection}</Text></View>
                  <Text style={styles.title}>{product.productTitle}</Text>
                  <Text style={styles.brand}>Brand : <Text style={styles.brand_name}>{product.brand}</Text ></Text>
                </View>
                <View>
                  <div style={styles.productList}>
                    {temp = product.productimage.length}
                    {product.productimage.map((image) => {
                      img++
                      return (
                        <View
                          style={temp === 1 && img === 1 ? styles.temp1img1 : temp === 2 && img === 1 ? styles.temp2img1 : temp === 2 && img === 2 ? styles.temp2img2 : temp === 3 && img === 1 ? styles.temp3img1 : temp === 3 && img === 2 ? styles.temp3img2 : temp === 3 && img === 3 ? styles.temp3img3 : temp === 4 && img === 1 ? styles.temp4img1 : temp === 4 && img === 2 ? styles.temp4img2 : temp === 4 && img === 3 ? styles.temp4img3 : temp === 4 && img === 4 ? styles.temp4img4 : temp === 5 && img === 1 ? styles.temp5img1 : temp === 5 && img === 2 ? styles.temp5img2 : temp === 5 && img === 3 ? styles.temp5img3 : temp === 5 && img === 4 ? styles.temp5img4 : temp === 5 && img === 5 ? styles.temp5img5 : ""}
                          key={image.imageId}
                        >
                          <Text style={styles.imageid}>{image.imageId}</Text>
                          <Image
                            crossorigin="anonymous"
                            key={image.imageId}
                            style={styles.imageStyles}
                            src={{
                              uri: image.url,
                              method: "GET",
                              headers: { "Cache-Control": "no-cache" },
                              body: "",
                            }}
                          />
                        </View>
                      )
                    })}
                  </div>
                </View>
                <View style={styles.description} >
                  <Text style={styles.desText} >
                    {product?.discription &&discriptionHandler(product?.discription)}
                  </Text>
                </View>
              </div>
            ))
            : ""}
        </Page>
      </Document>
    </PDFViewer>
  )
  console.log(fileNamePdf)

  return (
    <>
      {/* <UploadCatelogue
        setECatalogue={setECatalogue}
        onKeyChange={() => onKeyChange("2")}
        eCatalogue={eCatalogue}
        createPage={true}
        fileListtemp={[]}
        MyDoc={MyDoc}
        createCat={createCat}
        setCreateCat={setCreateCat}
      // pdfBlobData={pdfBlobData}
      /> */}
      <div className="generatebox">
        <div className="generator">
          <div className="product_header">
            <h3>Products</h3>
            <h3 className="filter_products" onClick={() => showFilters ? setShowFilters(false) : setShowFilters(true)}>Filter <FilterOutlined /></h3>
            {showFilters && <div className="filters_container">
              <div className="catBrandContainer catBrandHead">
                <h3>Filter</h3>
                <Button onClick={() => setShowFilters(false)}>X</Button>
              </div>
              <Select
                mode="tags"
                size="large"
                placeholder="Select"
                defaultValue={brandCategory.brandOrCate}
                onChange={(value) => setBrandCategory({ ...brandCategory, brandOrCate: value })}
                className="selector_filter"
                options={[{ value: "Brand", label: "Brand" }, { value: "Category", label: "Category" }, { value: "List All", label: "List All" }]}
              />
              <div className="catBrandContainer">
                <h4>
                  Category
                </h4>
                <Select
                  size="large"
                  defaultValue={brandCategory.category}
                  onChange={(value) => setBrandCategory({ ...brandCategory, category: value })}
                  className="selector_names"
                  options={categoryOptions}
                  disabled={isListAll()}
                />
              </div>
              <div className="catBrandContainer">
                <h4>
                  Brand
                </h4>
                <Select
                  size="large"
                  defaultValue={brandCategory.brand}
                  onChange={(value) => setBrandCategory({ ...brandCategory, brand: value })}
                  className="selector_names"
                  options={brandOptions}
                  disabled={isListAll()}
                />
              </div>
              <div className="filter_applybtn">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="nextbtn"
                  onClick={() => {
                    setShowFilters(false)
                    filterApplyHandler()
                  }}
                >
                  Apply
                </Button>
              </div>
            </div>}
          </div>
          {productList
            ? productList.map((product) => {
              console.log("pro----", product)
              return (
                <div className="productTitle" key={product.productTitle}>
                  <Row gutter={[10, 10]}>
                    <Col xs={24} sm={24} md={24} lg={15} xl={15} className="poductCol">
                      <Checkbox
                        id={product.productTitle}
                        onChange={(e) => {
                          if (e.target.checked) {
                            addRemoveProduct(product)
                          } else {
                            setSelectedProduct(removeSelected(product.productid))
                          }
                        }}></Checkbox>
                      <label for={product.productTitle}>{product.productTitle}</label>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={9} xl={9} className="poductCol">
                      <ProductImages product={product} />
                    </Col>
                  </Row>
                </div>
              )
            })
            : ""}
        </div>
        <div className="preview">{MyDoc}</div>
      </div >
      <div className="uploadk_cat_container">
        <span>After Downloading <b>E-catalogue PDF ,</b> Please Upload Recently <b>Downloaded PDF</b></span>
      </div>
    </>
  )
}

export default CreateCatalogue