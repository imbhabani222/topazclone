import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  Row,
  Col,
  Table,
  Space,
  Button,
  Tooltip,
  Form,
  Select,
  Divider,
  Input,
  message,
  Image,
} from "antd"
import {
  PlusCircleOutlined,
  SearchOutlined,
  SyncOutlined,
} from "@ant-design/icons"
import AddCategory from "../AddCategory/AddCategory"
import EditCategory from "../EditCategory/EditCategory"
import { viewCategory } from "../../action/useraction"
import axios from "axios"
import { APIs } from "../../worker"
import "./ViewCategory.css"

function ViewCategory() {
  let dispatch = useDispatch()
  const [form] = Form.useForm()
  const [isaddCategory, setIsAddCategory] = useState(false)
  const [isEditCategory, setEditCategory] = useState(false)
  const [catInfo, setCatInfo] = useState()
  const [value, setValue] = useState("")
  const [filterTable, setFilterTable] = useState("")
  const [page, setPage] = useState(1)
  const [tableTotal, setTableTotal] = useState([])
  const [pagination, setPagination] = useState(10)
  const [selectedVal, setSelectedVal] = useState(10)
  const userInfo = JSON.parse(localStorage.getItem("userinfo"))

  const viewcategorys = useSelector(
    (state) => state.category.viewCategoryResponse
  )

  const tableLoading = {
    spinning: useSelector((state) => state.category.loading),
    indicator: <SyncOutlined spin />,
  }

  useEffect(() => {
    dispatch(viewCategory())
  }, [dispatch, isaddCategory, isEditCategory, page, pagination, selectedVal])

  useEffect(() => {
    setFilterTable(filterTable)
  }, [filterTable])

  let newArr = []
  if (viewcategorys !== undefined) {
    viewcategorys.map((e, index) =>
      newArr.push({
        slNo: index + 1,
        categoryimage: e.categoryimage.url,
        categoryid: e.categoryid,
        categoryName: e.categoryName,
        active: e.active,
        subcategory: e.subcategory,
        tags: e.tags,
        discription: e.discription,
      })
    )
  }
  const options = []
  for (let i = 5; i < newArr?.length + 5; i++) {
    options.push({
      value: i,
      label: i,
    })
    i = i + 4
  }

  const editCategory = (catDetail) => {
    setCatInfo(catDetail)
    console.log(catDetail)

    if (catDetail.active == true) {
      setEditCategory(true)
    }
  }
  const disableCategory = async (record) => {
    let res = await axios.put(
      `${APIs.baseURL}/category-service/v1/category/status/` + record.categoryid,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userInfo.token}`,
        }
      })

    if (res.status === 200) {
      dispatch(viewCategory())
      message.success(res.data)
    }
  }

  const columns = [
    {
      title: "Sl No",
      dataIndex: "slNo",
      key: "slNo",
      // sorter: (a, b) => a.slNo - b.slNo,
      width: "1%",
      fixed: "left",
    },
    {
      title: "Image",
      dataIndex: "categoryimage",
      key: "categoryimage",
      render: (v, _record) => (
        <Image
          width={39}
          height={32}
          src={_record?.categoryimage}
          preview={{
            src: _record?.categoryimage,
          }}
        />
      ),
      width: "1%",
    },
    {
      title: "Category ID",
      dataIndex: "categoryid",
      key: "categoryid",
      // sorter: (a, b) => a.categoryid.length - b.categoryid.length,
      sorter: (a, b) => {
        let aCat = parseInt(a.categoryid.replace("CAT", ""))
        let bCat = parseInt(b.categoryid.replace("CAT", ""))
        console.log(aCat, bCat, "Category")
        if (aCat > bCat) return 1
        else if (aCat < bCat) return -1
      },
      width: "1.3%",
    },
    {
      title: "Category Name",
      dataIndex: "categoryName",
      sorter: (a, b) => a.categoryName.localeCompare(b.categoryName),
      render: (data) => <>{data.charAt(0).toUpperCase() + data.slice(1)}</>,
      key: "categoryName",
      width: "2%",
    },
    {
      title: "Sub Category",
      dataIndex: "subcategory",
      key: "subcategory",
      // sorter: (a, b) => a.subcategory.length - b.subcategory.length,
      // sorter: (a, b) => a.subcategory.localeCompare(b.subcategory),
      sorter: function (a, b) {
        return a.subcategory[0].subcategory.localeCompare(
          b.subcategory[0].subcategory
        )
      },
      render: (data) => (
        <Tooltip>{data?.map((sub) => sub.subcategory).join(", ")}</Tooltip>
      ),
      ellipsis: true,
      width: "2%",
    },
    {
      title: "Status",
      dataIndex: "active",
      key: "active",
      width: "2.5%",
      align: "center",
      render: (active) => (
        <div
          style={
            active
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
          {active === true ? "Active" : "Inactive"}
        </div>
      ),
    },

    {
      title: "Action",
      key: "action",
      width: "1%",
      fixed: "right",
      render: (text, record) => (
        <Space size="middle">
          <a>
            <Tooltip placement="topLeft" title="Edit" arrowPointAtCenter>
              <svg
                width="14"
                height="14"
                onClick={() => {
                  editCategory(record)
                }}
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
          <a
            onClick={() => {
              disableCategory(record)
            }}
          >
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
        </Space>
      ),
    },
    Table.SELECTION_COLUMN,
  ]

  const onhandlePagination = (value) => {
    console.log(value)
    setPagination(value)
    setSelectedVal(value)
  }

  const backArrowClick = () => {
    setIsAddCategory(false)
    dispatch(viewCategory())
  }

  const editedCatInfo = () => {
    setEditCategory(false)
  }

  return (
    <>
      <div>
        {isaddCategory && (
          <AddCategory backArrowClick={() => backArrowClick()} />
        )}
        {isEditCategory && (
          <EditCategory catInfo={catInfo} editedCatInfo={editedCatInfo} />
        )}
        {!isaddCategory && !isEditCategory && (
          <div className="view-category-container">
            <div className="view-categoty-header">
              <Row>
                <Col xs={24} sm={14} md={16} lg={16} xl={16}>
                  <h4 className="categoryHeading">View Categories</h4>
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
                    onClick={() => setIsAddCategory(true)}
                  >
                    Add Category
                  </Button>
                </Col>
              </Row>
            </div>
            <Divider className="view-divider" />
            <div className="pagination-and-searchBox">
              <Row>
                <Col xs={24} sm={10} md={16} lg={18} xl={18}>
                  <div className="pagination-category">
                    <Form form={form}>
                      <Form.Item label="Show">
                        <div className="pagination-input">
                          <Select
                            placeholder={pagination}
                            onChange={onhandlePagination}
                            options={options}
                          ></Select>
                        </div>
                      </Form.Item>
                    </Form>
                  </div>
                </Col>
                <Col
                  xs={24}
                  sm={10}
                  md={8}
                  lg={6}
                  xl={6}
                  className="cat-search-Col"
                >
                  <Input
                    placeholder="Search"
                    bordered
                    value={value}
                    onChange={(e) => {
                      const currValue = e.target.value
                      setValue(currValue)

                      const filteredData = newArr.filter((o) =>
                        Object.keys(o).some((k) =>
                          String(o[k])
                            .toLowerCase()
                            .includes(currValue.toLowerCase())
                        )
                      )
                      setFilterTable(filteredData)
                    }}
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
                </Col>
              </Row>
            </div>
            <Table
              className="category-table"
              rowKey="categoryid"
              columns={columns}
              scroll={{
                x: 1000,
                xs: 500,
              }}
              rowClassName={(record, p2) => {
                return record.active === false ? "disable-row" : ""
              }}
              dataSource={value.length === 0 ? newArr : filterTable}
              pagination={{
                total: newArr?.length,
                pageSize: selectedVal,
                onChange(current) {
                  setPage(current)
                },
              }}
              loading={tableLoading}
            />
            <div className="below-table-paginatio">
              Showing {page * selectedVal - selectedVal + 1} to{" "}
              {page * selectedVal < newArr.length
                ? page * selectedVal
                : newArr.length}
              of {newArr.length} entries
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default ViewCategory
