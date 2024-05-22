import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import UpdateProduct from "../product/UpdateProduct"
import ProductDetails from "../product_popup/product_details/product_details"
import EditPrice from "../product_popup/edit_price"
import Barcode from "../product_popup/barcode_gen/barcode_gen"
import Stock from "../product_popup/stock/stock"
import {
  Row,
  Col,
  Table,
  Space,
  Button,
  Form,
  Select,
  Divider,
  Popover,
  Input,
  message,
  Image,
  Tooltip,
  Modal,
} from "antd"
import {
  EditFilled,
  PlusCircleOutlined,
  EyeInvisibleOutlined,
  SearchOutlined,
  QrcodeOutlined,
  SyncOutlined,
} from "@ant-design/icons"
import "./viewproduct.css"
import { useDispatch, useSelector } from "react-redux"
import { viewProduct } from "../../action/useraction"
import AddProduct from "../product/AddProduct"
import axios from "axios"
import { APIs } from "../../worker"
import ViewCategory from "../ViewCategory/ViewCategory"
import { viewCategory } from "../../action/useraction"

function ViewProduct(props) {
  let navigate = useNavigate()
  let dispatch = useDispatch()
  const [isEditProduct, setEditProduct] = useState(false)
  const [isViewProductDetails, setIsViewProductDetails] = useState(false)
  const [isBarcode, setIsBarcode] = useState(false)
  const [editPrice, setEditPrice] = useState(false)
  const [isStock, setIsStock] = useState(false)
  const [addPro, setAddPro] = useState(false)
  const [prodInfo, setProdInfo] = useState()
  const [viewId, setViewId] = useState(null)
  const [idForPrice, setIdForPrice] = useState(null)
  const [stockAndThreeshold, setstockAndThreeshold] = useState(null)
  const [view, setView] = useState("list")
  const [filterTable, setFilterTable] = useState([])
  const [value, setValue] = useState("")
  const [page, setPage] = React.useState(1)
  const [tableTotal, setTableTotal] = useState(0)
  const [allImages, setAllImages] = useState([])
  const [visible, setVisible] = useState(false)
  const viewcategorys = useSelector(
    (state) => state.category.viewCategoryResponse
  )
  const userInfo = JSON.parse(localStorage.getItem("userinfo"))

  const tableLoading = {
    spinning: useSelector((state) => state.category.loading),
    indicator: <SyncOutlined spin />,
  }
  const viewDetails = useSelector((state) => state.viewProduct)

  useEffect(() => {
    if (isStock === false) {
      dispatch(viewProduct())
      dispatch(viewCategory())
    }
  }, [dispatch, isEditProduct, idForPrice, editPrice, isStock])
  useEffect(() => {
    setFilterTable(filterTable)
  }, [filterTable])

  const handleChangeSearch = (e) => {
    const currValue = e.target.value
    setValue(currValue)

    const filteredData = newArr.filter((o) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(currValue.toLowerCase())
      )
    )
    setFilterTable(filteredData)
  }

  const getSingleProductData = (id) => {
    setIsViewProductDetails(true)
    setViewId(id)
  }
  const backToViewProduct = () => {
    setIsViewProductDetails(false)
    setView("list")
  }
  const addProduct = () => {
    setAddPro(true)
    setView("add")
  }
  const priceEdit = (id, price) => {
    setIdForPrice({ id: id, price: price })
    setViewId(id)
    setEditPrice(true)
  }
  const backToProduct = () => {
    setEditPrice(false)
  }

  const stockAndThreshold = (record) => {
    setIsStock(true)
    setstockAndThreeshold(record)
  }

  let { viewProductResponse } = viewDetails
  let newArr = []
  if (viewProductResponse !== undefined) {
    let { viewProductResponse } = viewDetails
    viewProductResponse.map((e) =>
      newArr.push({
        active: e.active,
        brand: e.brand,
        categoryid: e.categoryType.categoryid,
        categoryName: e.categoryType.categoryName,
        image: e.image,
        collection: e.collection,
        color: e.color,
        currency: e.currency,
        discription: e.discription,
        maxOrderQty: e.maxOrderQty,
        minOrderQty: e.minOrderQty,
        price: e.price,
        productImage: e.productimage,
        productTitle: e.productTitle,
        productid: e.productid,
        size: e.size,
        sku: e.sku,
        stock: e.stock,
        tag: e.tag,
        thickness: e.thickness,
        threshold: e.threshold,
        unitMeasure: e.unitMeasure,
        woodType: e.woodType,
        sqFeetPrice: e.sqFeetPrice,
        subcategory: {
          subid: e.subcategory,
        },
      })
    )
  }
  const editProdct = (proDetails) => {
    setProdInfo(proDetails)
    if (proDetails.active === true) {
      setEditProduct(true)
    }
  }
  const apiCall = async (rec) => {
    let url = `${APIs.baseURL}/product-service/v1/product-image/${rec[0]?.productid}`
    axios
      .get(url,{
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userInfo.token}`,
        }
      }
      )
      .then((res) => {
        setAllImages(res?.data)
        setVisible(true)
      })
      .catch((err) => console.log("err++", err))
  }
  const columns = [
    {
      title: "SI No",
      dataIndex: "index",
      width: "0.7%",
      fixed: "left",
      render: (text, record, index) => {
        setTableTotal((page - 1) * 10 + index + 1)
        return (page - 1) * 10 + index + 1
      },
    },
    {
      title: "Image",
      dataIndex: "productImage",
      key: "productImage",
      render: (record, index) => (
        <>
          <Image
            preview={{
              visible: false,
            }}
            width={39}
            height={32}
            src={record?.at(0)?.url}
            onClick={async () => {
              apiCall(record)
            }}
            onChange={(e) => console.log(e)}
          />
          <div
            style={{
              display: "none",
            }}
          >
            <Image.PreviewGroup
              preview={{
                visible,
                onVisibleChange: (vis) => setVisible(vis),
              }}
            >
              {allImages?.map((img, i) => (
                <Image
                  width={100}
                  key={i}
                  src={img.url}
                  style={{ width: "100%", height: "100%" }}
                />
              ))}
            </Image.PreviewGroup>
          </div>
        </>
      ),
      width: "0.7%",
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
      sorter: (a, b) => {
        let aCat = parseInt(a.sku.replace("TOP-PRD-", ""))
        let bCat = parseInt(b.sku.replace("TOP-PRD-", ""))
        if (aCat > bCat) return 1
        else if (aCat < bCat) return -1
      },
      // sorter: {
      //   compare: (a, b) => a.sku.localeCompare(b.sku),
      //   multiple: 2,
      // },
      width: "1%",
    },
    {
      title: "Name",
      dataIndex: "productTitle",
      width: "1.2%",
      sorter: {
        compare: (a, b) => a.productTitle.localeCompare(b.productTitle),
        multiple: 2,
      },
    },
    {
      title: "Price",
      dataIndex: "price",
      width: "1%",
      key: "1",
      sorter: {
        compare: (a, b) => parseInt(a.price) - parseInt(b.price),
        multiple: 1,
      },
      render: (text, record) =>
        record.currency === "Rupees" ? `₹${text.toFixed(2)}` : text.toFixed(2),
    },
    {
      title: "Size",
      dataIndex: "size",
      width: "1%",
      sorter: (a, b) => {
        let aSize = a?.size
          ?.replaceAll("ft", "")
          ?.split("*")
          ?.reduce((acc, curr) => {
            return acc * parseInt(curr)
          }, 1)
        let bSize = b?.size
          ?.replaceAll("ft", "")
          ?.split("*")
          ?.reduce((acc, curr) => {
            return acc * parseInt(curr)
          }, 1)
        if (aSize > bSize) return 1
        else if (aSize === bSize) return 0
        else if (aSize < bSize) return -1
      },
    },
    {
      title: "Thickness",
      dataIndex: "thickness",
      width: "0.7%",
      align: "center",
      sorter: {
        compare: (a, b) => parseInt(a.thickness) - parseInt(b.thickness),
        multiple: 1,
      },
    },
    {
      title: "Min Quantity",
      dataIndex: "minOrderQty",
      width: "1%",
      align: "center",
      sorter: {
        compare: (a, b) => parseInt(a.minOrderQty) - parseInt(b.minOrderQty),
        multiple: 1,
      },
    },

    {
      title: "Stock",
      dataIndex: "stock",
      width: "0.5%",
      align: "center",
      sorter: {
        compare: (a, b) => parseInt(a.stock) - parseInt(b.stock),
        multiple: 1,
      },
    },
    {
      title: "Threshold",
      dataIndex: "threshold",
      width: "1%",
      align: "center",
      sorter: {
        compare: (a, b) => a.threshold - b.threshold,
        multiple: 1,
      },
    },
    {
      title: "Status",
      width: "1%",
      dataIndex: "active",
      align: "center",
      render: (data) => (
        <>
          <div
            style={
              data
                ? {
                  background: "#58B510",
                  color: "#fff",
                  padding: "5px 14px",
                  borderRadius: "4px",
                  textAlign: "center",
                  fontSize: "12px",
                  fontWeight: 600,
                  width: "5rem",
                  margin: "0 auto",
                }
                : {
                  background: "gray",
                  color: "#fff",
                  padding: "5px 14px",
                  borderRadius: "4px",
                  textAlign: "center",
                  fontSize: "12px",
                  fontWeight: 600,
                  width: "5rem",
                  margin: "0 auto",
                }
            }
          >
            {data ? "Active" : "In-Active"}
          </div>
        </>
      ),
    },
    {
      title: "Action",
      width: "1%",
      fixed: "right",
      align: "center",
      render: (record) => (
        <Space size="middle">
          <a onClick={() => editProdct(record)}>
            <Tooltip placement="topLeft" title="Edit" arrowPointAtCenter>
              <svg
                width="14"
                height="14"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.5903 6.05716C15.7856 6.25242 16.1022 6.25242 16.2974 6.05716L17.0997 5.25486C18.3001 4.05448 18.3001 2.1009 17.0997 0.900048C16.5185 0.31928 15.7459 0 14.9221 0C14.0983 0 13.3252 0.319754 12.7444 0.900522L11.9426 1.70235C11.7473 1.89761 11.7473 2.21419 11.9426 2.40945L15.5903 6.05716ZM10.9379 3.41415C10.7426 3.21891 10.426 3.21892 10.2308 3.41417L2.02485 11.6201C1.84248 11.8025 1.70368 12.0275 1.62315 12.2714L0.0362214 17.0659C-0.0485726 17.3207 0.0182204 17.6016 0.208178 17.7916C0.344133 17.9271 0.52509 17.9995 0.710784 17.9995C0.78563 17.9995 0.86095 17.9877 0.934375 17.9635L5.72737 16.3761C5.97228 16.2956 6.19776 16.1568 6.38014 15.974L14.5856 7.76855C14.7808 7.57328 14.7808 7.25668 14.5855 7.06142L10.9379 3.41415Z"
                  fill="#0A7CA7"
                />
              </svg>
            </Tooltip>
          </a>
          <a onClick={() => disableProduct(record)}>
            <Tooltip
              placement="topLeft"
              title={record.active === true ? "Disable" : "Enable"}
              arrowPointAtCenter
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.24605 15.0439C0.205656 12.7133 -0.504458 9.50286 0.363145 6.5291C1.23069 3.55569 3.55584 1.23055 6.52914 0.363115C9.50278 -0.504431 12.713 0.205659 15.0439 2.24602L2.24605 15.0439ZM2.96158 15.7594C5.29346 17.798 8.50487 18.5055 11.4775 17.6356C14.4503 16.7658 16.7736 14.4388 17.6389 11.4644C18.504 8.49038 17.7916 5.28001 15.7493 2.95136L2.96158 15.7594Z"
                  fill="#0A7CA7"
                />
              </svg>
            </Tooltip>
          </a>
          <Popover
            placement="bottomRight"
            className={record.active ? "" : "popoverDisable"}
            style={{ background: "#0A7CA7", width: "3.69px", height: "3.69px" }}
            content={
              <div className="table-popUp">
                <div
                  className="view-row-details"
                  onClick={() => getSingleProductData(record.productid)}
                  style={{ cursor: "pointer" }}
                >
                  <EyeInvisibleOutlined />
                  <p>View Details</p>
                </div>
                <div
                  className="view-row-details"
                  onClick={() => priceEdit(record.productid, record.price)}
                  style={{ cursor: "pointer" }}
                >
                  <EditFilled />
                  <p>Edit Price</p>
                </div>
                <div
                  className="share-details"
                  onClick={() => stockAndThreshold(record)}
                  style={{ cursor: "pointer" }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0.425781 8.98103V3.52L8.10578 0L15.9991 3.52V12.2667L8.10578 15.68L4.97949 13.9432C5.5936 13.3466 5.97236 12.5288 5.97236 11.6267C5.97236 9.80044 4.42028 8.32 2.50569 8.32C1.72531 8.32 1.00516 8.56595 0.425781 8.98103ZM8.31902 6.29333L2.87902 3.73333L8.31902 1.49333L13.5457 3.73333L8.31902 6.29333Z"
                      fill="#0A7CA7"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M2.56 14.1867C3.97385 14.1867 5.12 13.0405 5.12 11.6267C5.12 10.2128 3.97385 9.06665 2.56 9.06665C1.14615 9.06665 0 10.2128 0 11.6267C0 13.0405 1.14615 14.1867 2.56 14.1867ZM2.76906 11.8656H3.67956V11.4362H2.76906V10.474H2.29738V11.4362H1.39156V11.8656H2.29738V12.8324H2.76906V11.8656Z"
                      fill="#0A7CA7"
                    />
                  </svg>

                  <p style={{ paddingLeft: "6px" }}>Add Stock/Threshold</p>
                </div>
                <div
                  className="view-row-details"
                  style={{ cursor: "pointer" }}
                  id="barcode"
                  onClick={
                    () =>
                      window.open(
                        `/product-preview-qr/${record.productid}`,
                        "_blank",
                        "noreferrer"
                      )
                    // navigate(`/product-preview-qr/${record.productid}`)
                  }
                >
                  <QrcodeOutlined />
                  <p>View QR Code</p>
                </div>
              </div>
            }
            trigger="hover"
          >
            <a>
              <svg
                width="16"
                height="4"
                viewBox="0 0 16 4"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginBottom: "5px" }}
              >
                <circle cx="1.84617" cy="1.84617" r="1.84617" fill="#0A7CA7" />
                <circle cx="8.00047" cy="1.84617" r="1.84617" fill="#0A7CA7" />
                <circle cx="14.1538" cy="1.84617" r="1.84617" fill="#0A7CA7" />
              </svg>
            </a>
          </Popover>
        </Space>
      ),
    },
  ]

  const backArrowClick = () => {
    setEditProduct(false)
    setView("list")
    dispatch(viewProduct())
  }
  const disableProduct = async (record) => {
    let res = await axios.put(
      `${APIs.baseURL}/product-service/v1/status/` + record.productid,{},{
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userInfo.token}`,
        }
      }      
    )
    if (res.status === 200) {
      dispatch(viewProduct())
      message.success(res.data)
    }
  }

  return (
    <>
      {isEditProduct && (
        <UpdateProduct
          backArrowClick={() => backArrowClick()}
          prodInfo={prodInfo}
          updateTableData={() => dispatch(viewProduct())}
          viewcategorys={viewcategorys}
        />
      )}
      {
        <Modal
          title="Product Details"
          centered
          visible={isViewProductDetails}
          onCancel={backToViewProduct}
          maskClosable={false}
          footer={null}
          width={730}
          destroyOnClose
          closeIcon={
            <div className="product_details_prod">
              {" "}
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.5912 14.4788L22.0783 8.99175C22.2016 8.84776 22.2661 8.66254 22.2588 8.47311C22.2514 8.28367 22.1729 8.10398 22.0389 7.96993C21.9048 7.83588 21.7251 7.75735 21.5357 7.75003C21.3463 7.74271 21.161 7.80715 21.017 7.93046L15.5299 13.4176L10.0429 7.92293C9.89886 7.79962 9.71364 7.73519 9.52421 7.7425C9.33478 7.74982 9.15508 7.82835 9.02103 7.9624C8.88698 8.09645 8.80845 8.27615 8.80113 8.46558C8.79382 8.65501 8.85825 8.84023 8.98156 8.98422L14.4687 14.4788L8.97404 19.9659C8.89524 20.0334 8.83125 20.1165 8.78607 20.2098C8.74089 20.3032 8.7155 20.4049 8.7115 20.5086C8.70749 20.6123 8.72496 20.7156 8.7628 20.8122C8.80064 20.9088 8.85804 20.9965 8.9314 21.0699C9.00475 21.1432 9.09247 21.2006 9.18906 21.2385C9.28565 21.2763 9.38902 21.2938 9.49268 21.2898C9.59634 21.2858 9.69805 21.2604 9.79143 21.2152C9.88481 21.17 9.96785 21.106 10.0353 21.0272L15.5299 15.5401L21.017 21.0272C21.161 21.1505 21.3463 21.215 21.5357 21.2077C21.7251 21.2003 21.9048 21.1218 22.0389 20.9878C22.1729 20.8537 22.2514 20.674 22.2588 20.4846C22.2661 20.2952 22.2016 20.1099 22.0783 19.9659L16.5912 14.4788Z"
                  fill="#0A7CA7"
                />
                <rect
                  x="0.5"
                  y="0.5"
                  width="29"
                  height="29"
                  rx="3.5"
                  stroke="#0A7CA7"
                />
              </svg>
            </div>
          }
        >
          <ProductDetails
            // backToViewProduct={() => backToViewProduct()}
            isViewProductDetails={isViewProductDetails}
            viewId={viewId}
          />
        </Modal>
      }
      {
        <Modal
          className="editPriceModal"
          title="Edit Price"
          centered
          visible={editPrice}
          maskClosable={false}
          onCancel={() => setEditPrice()}
          footer={null}
          destroyOnClose
          // className="title-edit"
          width={427}
          height={321}
          closeIcon={
            <div className="product_details_prod">
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.5912 14.4788L22.0783 8.99175C22.2016 8.84776 22.2661 8.66254 22.2588 8.47311C22.2514 8.28367 22.1729 8.10398 22.0389 7.96993C21.9048 7.83588 21.7251 7.75735 21.5357 7.75003C21.3463 7.74271 21.161 7.80715 21.017 7.93046L15.5299 13.4176L10.0429 7.92293C9.89886 7.79962 9.71364 7.73519 9.52421 7.7425C9.33478 7.74982 9.15508 7.82835 9.02103 7.9624C8.88698 8.09645 8.80845 8.27615 8.80113 8.46558C8.79382 8.65501 8.85825 8.84023 8.98156 8.98422L14.4687 14.4788L8.97404 19.9659C8.89524 20.0334 8.83125 20.1165 8.78607 20.2098C8.74089 20.3032 8.7155 20.4049 8.7115 20.5086C8.70749 20.6123 8.72496 20.7156 8.7628 20.8122C8.80064 20.9088 8.85804 20.9965 8.9314 21.0699C9.00475 21.1432 9.09247 21.2006 9.18906 21.2385C9.28565 21.2763 9.38902 21.2938 9.49268 21.2898C9.59634 21.2858 9.69805 21.2604 9.79143 21.2152C9.88481 21.17 9.96785 21.106 10.0353 21.0272L15.5299 15.5401L21.017 21.0272C21.161 21.1505 21.3463 21.215 21.5357 21.2077C21.7251 21.2003 21.9048 21.1218 22.0389 20.9878C22.1729 20.8537 22.2514 20.674 22.2588 20.4846C22.2661 20.2952 22.2016 20.1099 22.0783 19.9659L16.5912 14.4788Z"
                  fill="#0A7CA7"
                />
                <rect
                  x="0.5"
                  y="0.5"
                  width="29"
                  height="29"
                  rx="3.5"
                  stroke="#0A7CA7"
                />
              </svg>
            </div>
          }
        >
          <EditPrice
            editPrice={editPrice}
            setEditPrice={backToProduct}
            idForPrice={idForPrice}
            viewId={viewId}
          />
        </Modal>
      }
      {
        <Modal
          title="Barcode"
          centered
          visible={isBarcode}
          // onOk={handleOk}
          onCancel={() => setIsBarcode()}
          className="title-barcode"
          footer={[
            <Button
              key="back"
              onClick={() => setIsBarcode()}
              className="sharebtn"
            >
              Share
            </Button>,
            <Button
              key="submit"
              type="primary"
              // onClick={handleOk}
              className="download-btn"
            >
              Download
            </Button>,
          ]}
        >
          <Barcode isBarcode={isBarcode} setIsBarcode={setIsBarcode} />
        </Modal>
      }
      {/* {addPro && (<AddProduct/>)} */}
      {
        <div className="stockcss">
          <Modal
            title="Add Stock and Threshold"
            centered
            visible={isStock}
            maskClosable={false}
            width={494}
            height={321}
            // onOk={handleOk}
            onCancel={() => setIsStock()}
            footer={null}
            destroyOnClose
            // className="modalup"
            closeIcon={
              <div className="product_details_prod">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.5912 14.4788L22.0783 8.99175C22.2016 8.84776 22.2661 8.66254 22.2588 8.47311C22.2514 8.28367 22.1729 8.10398 22.0389 7.96993C21.9048 7.83588 21.7251 7.75735 21.5357 7.75003C21.3463 7.74271 21.161 7.80715 21.017 7.93046L15.5299 13.4176L10.0429 7.92293C9.89886 7.79962 9.71364 7.73519 9.52421 7.7425C9.33478 7.74982 9.15508 7.82835 9.02103 7.9624C8.88698 8.09645 8.80845 8.27615 8.80113 8.46558C8.79382 8.65501 8.85825 8.84023 8.98156 8.98422L14.4687 14.4788L8.97404 19.9659C8.89524 20.0334 8.83125 20.1165 8.78607 20.2098C8.74089 20.3032 8.7155 20.4049 8.7115 20.5086C8.70749 20.6123 8.72496 20.7156 8.7628 20.8122C8.80064 20.9088 8.85804 20.9965 8.9314 21.0699C9.00475 21.1432 9.09247 21.2006 9.18906 21.2385C9.28565 21.2763 9.38902 21.2938 9.49268 21.2898C9.59634 21.2858 9.69805 21.2604 9.79143 21.2152C9.88481 21.17 9.96785 21.106 10.0353 21.0272L15.5299 15.5401L21.017 21.0272C21.161 21.1505 21.3463 21.215 21.5357 21.2077C21.7251 21.2003 21.9048 21.1218 22.0389 20.9878C22.1729 20.8537 22.2514 20.674 22.2588 20.4846C22.2661 20.2952 22.2016 20.1099 22.0783 19.9659L16.5912 14.4788Z"
                    fill="#0A7CA7"
                  />
                  <rect
                    x="0.5"
                    y="0.5"
                    width="29"
                    height="29"
                    rx="3.5"
                    stroke="#0A7CA7"
                  />
                </svg>
              </div>
            }
          >
            <Stock
              isStock={isStock}
              setIsStock={setIsStock}
              stockAndThreeshold={stockAndThreeshold}
            />
          </Modal>
        </div>
      }
      {!isEditProduct && (
        <div className="view-product-container">
          <div className="view-manufacturer-tops">
            {view === "list" ? (
              <div className="viewcategory_header">
                <Row>
                  <Col xs={24} sm={14} md={16} lg={16} xl={16}>
                    <h4 className="manufacturer-text">View Product</h4>
                  </Col>
                  <Col
                    xs={24}
                    sm={10}
                    md={8}
                    lg={8}
                    xl={8}
                    className="cat-head-Col"
                  >
                    <Button
                      type="primary"
                      className="add-category-btn"
                      icon={<PlusCircleOutlined style={{ fontSize: "16px" }} />}
                      onClick={addProduct}
                    >
                      Add Product
                    </Button>
                  </Col>
                </Row>
              </div>
            ) : (
              ""
            )}
            {view === "list" ? <Divider className="viewTableTopdivider" /> : ""}
            {view === "list" ? (
              <Input
                className="search_bar"
                placeholder="Search"
                bordered
                value={value}
                onChange={handleChangeSearch}
                style={{ borderRadius: "5px" }}
                prefix={
                  <SearchOutlined
                    style={{
                      color: "#CCCCCC",
                      height: "13.12",
                      width: "20px",
                    }}
                  />
                }
              />
              // // <>
              //   {/* <Row >
              //  <Col  xs={8}
              //     sm={6}
              //     md={4}
              //     lg={3}  xl={3} xxl={2} className="showCol">
              //  <div className="pagination">
              //       <Form form={form}>
              //         <Form.Item name="show" label="Show ">
              //           <Select
              //             placeholder={pagination}
              //             onChange={onhandlePagination}
              //           >
              //             <Option value={5}>5</Option>
              //             <Option value={10}>10</Option>
              //             <Option value={15}>15</Option>
              //             <Option value={20}>20</Option>
              //           </Select>
              //         </Form.Item>
              //       </Form>
              //     </div>
              // </Col>
              // <div className="filterDiv">
              // <Col  xs={8}
              //     sm={6}
              //     md={3}
              //     lg={2} xl={2} xxl={2}>
              //       <div className="filterbox">
              //     <div className="filterTitle1">
              //     <p >
              //           {" "}
              //           <svg
              //             width="12"
              //             height="12"
              //             style={{marginRight:"5px"}}
              //             viewBox="0 0 12 12"
              //             fill="none"
              //             xmlns="http://www.w3.org/2000/svg"
              //           >
              //             <path
              //               d="M11.975 0.134419C11.9343 0.0503925 11.8502 0 11.7591 0H0.238722C0.147546 0 0.0635229 0.0503925 0.0250828 0.134419C-0.0157004 0.215985 -0.00609158 0.314424 0.0491064 0.386378L4.67884 6.36735V11.3643C4.67884 11.4531 4.72924 11.5372 4.8108 11.5779C4.84443 11.5947 4.88275 11.6043 4.91885 11.6043C4.96924 11.6043 5.01729 11.5876 5.06042 11.5563L7.22048 9.98181C7.28294 9.93623 7.32127 9.86427 7.32127 9.78739V6.36729L11.9486 0.386316C12.0063 0.314478 12.0159 0.216037 11.9751 0.134473L11.975 0.134419Z"
              //               fill="#00ADEF"
              //             />
              //           </svg>

              //           Fliter
              //         </p>
              //       </div>
              //       </div>
              // </Col>
              // </div>
              // <Col  xs={8}
              //     sm={6}
              //     md={6}
              //     lg={3} xl={3} xxl={3} > 
              //    <div className="filterSelect">
              //         <Select
              //           defaultValue="1000"
              //           style={{ width: "100%" }}
              //           onChange={handleChange}
              //         >
              //           <Option value="1000">0 to 2000</Option>
              //         </Select>
              //       </div>
              // </Col>
              // <Col  xs={8}
              //     sm={6}
              //     md={5}
              //     lg={3} xl={3} xxl={3}>
              //    <div className="filterSelect">
              //         <Select
              //           defaultValue="Plywood"
              //           style={{ width: "100%" }}
              //           onChange={handleChange}
              //         >
              //           <Option value="Plywood">Plywood</Option>
              //         </Select>
              //       </div>
              // </Col>
              // <Col  xs={8}
              //     sm={6}
              //     md={5}
              //     lg={3} xl={3} xxl={3}>
              //  <div className="filterSelect">
              //         <Select
              //           defaultValue="Brand"
              //           style={{ width: "100%" }}
              //           onChange={handleChange}
              //         >
              //           <Option value="Brand">Brand</Option>
              //         </Select>
              //       </div>
              // </Col>
              // <Col  xs={8}
              //     sm={5}
              //     md={6}
              //     lg={3} xl={2} xxl={2} className="filter-last">
              //   <div className="filterSelect">
              //         <Select
              //           defaultValue="1mm"
              //           style={{ width: "100%" }}
              //           onChange={handleChange}
              //         >
              //           <Option value="1mm">1mm to 18mm</Option>
              //         </Select>
              //       </div>
              // </Col>
              // <Col  xs={8}
              //     sm={6}
              //     md={6}
              //     lg={3} xl={4} xxl={3} className="filter-last">
              //    <div className="filterSelect">
              //         <Select
              //           defaultValue="jack"
              //            style={{ width: "100%" }}
              //           onChange={handleChange}
              //         >
              //           <Option value="jack">8.00 ftx</Option>
              //         </Select>
              //       </div>
              // </Col>
              // <Col  xs={8}
              //     sm={6}
              //     md={5}
              //     lg={3} xl={3} xxl={3} className="filter-last">
              //         <div className="filterbtn">
              //       <Button>Apply Fliter</Button>
              //     </div>
              // </Col>

              //   <Divider className="view-table-divider" />


              // </Row> */}
              // {/* <Row justify="center">
              //     <Col
              //       xs={18}
              //       sm={14}
              //       md={14}
              //       lg={14}
              //       xl={14}
              //     > */}

              // {/* </Col>
              //   </Row> */}
              // {/* </> */}
            ) : (
              ""
            )}
          </div>

          {view === "add" ? (
            <AddProduct backArrowClick={() => backArrowClick()} />
          ) : (
            <Table
              className="prodctu-table"
              columns={columns}
              rowKey="sku"
              loading={tableLoading}
              dataSource={value.length === 0 ? newArr : filterTable}
              rowClassName={(record) =>
                record.active === false ? "disable-row" : ""
              }
              pagination={{
                onChange(current) {
                  setPage(current)
                },
              }}
              scroll={{
                x: 1500,
                xs: 500,
              }}
            />
          )}
          {view !== "add" ? (
            <div className="below-table-paginatio">
              Showing{" "}
              {+tableTotal % 10 === 0
                ? tableTotal - 9
                : tableTotal.toString().length === 1
                  ? tableTotal - (tableTotal - 1)
                  : tableTotal - (+tableTotal.toString().split("")[1] - 1)}{" "}
              to {tableTotal} of {newArr.length} entries
            </div>
          ) : null}
        </div>
      )}
    </>
  )
}

export default ViewProduct
