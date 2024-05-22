import React, { useEffect, useRef, useState } from "react"
import moment from "moment"
import { Row, Input, Avatar, Col, Typography, Modal, Button, Form } from "antd"
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  ReloadOutlined,
  SendOutlined,
} from "@ant-design/icons"
import { useSelector, useDispatch, shallowEqual } from "react-redux"
import {
  manufacturerConversation,
  getManufacturerConversation,
  deleteManufatureMessage,
  editManufatureMessage,
} from "../../../action/useraction"
import "./chatConversation.css"
import axios from "axios"

const ChatConversation = ({ orderId, orderItemId }) => {
  const [EditandDelete, setEditandDelete] = useState({
    show: null,
    edit: null,
    delete: null,
  })
  console.log("EditandDelete-------------", EditandDelete)
  const [changeConversation, setChangeConversation] = useState("")
  // const [editchat,setEditChat] = useState(43)
  // console.log("changeConversation--------", changeConversation)
  const { Title, Text } = Typography
  const { TextArea } = Input
  const dispatch = useDispatch()
  const [sendMessage, setSendMessage] = useState(null)
  const reducerData = useSelector((state) => state || null, shallowEqual)
  const {
    sentConversation: { resultData, loading },
    getConversation: { resultData: getMessageList },
  } = reducerData
  // console.log("red---------------------", reducerData)
  console.log(getMessageList, "getMessageList")
  const refreshChatHandler = ()=>{
    dispatch(getManufacturerConversation({ params: orderItemId }))
  }
  useEffect(() => {
    if (resultData) {
      refreshChatHandler()
    }
  }, [resultData])
  useEffect(() => {
    if (orderItemId) {
      refreshChatHandler()
    }
  }, [orderItemId])
  const onSendMessage = () => {
    dispatch(
      manufacturerConversation({
        body: { manufactureConversation: sendMessage },
        params: { orderId, orderItemId },
      })
    )
    setSendMessage(null)
  }
  console.log("get-----------------m-------", getMessageList)

  const deleteMessageHandler = (messageId) => {
    setEditandDelete({ ...EditandDelete, delete: messageId })
    const { confirm } = Modal
    return new Promise((resolve, reject) => {
      confirm({
        title: "Are you sure you want to Delete ?",
        onOk: () => {
          resolve(true)
          const ind = getMessageList.findIndex(
            (chat) => chat.messageId === messageId
          )
          getMessageList.splice(ind, 1)
          dispatch(
            deleteManufatureMessage({ messageId, newChatData: getMessageList })
          )
        },
        onCancel: () => {
          reject(true)
        },
      })
    })
  }
  const changeEditMessageHandler = (messageId) => {
    // setEditandDelete({ ...EditandDelete, edit: null })
    if (changeConversation === "") {
      return setEditandDelete({ ...EditandDelete, edit: null })
    } else {
      const ind = getMessageList.findIndex(
        (chat) => chat.messageId === messageId
      )
      getMessageList[ind].manufactureConversation = changeConversation
      console.log("edit---------------", getMessageList[ind])
      dispatch(
        editManufatureMessage({
          messageId,
          changeConversation,
          newChatData: getMessageList,
        })
      )
      return setEditandDelete({ ...EditandDelete, edit: null })
    }
  }
  const ChatBoxRef = useRef(null);

  useEffect(() => {
    if (ChatBoxRef.current) {
      ChatBoxRef.current.scrollTop = ChatBoxRef.current.scrollHeight;
    }
  });

  return (
    <Row style={{ position: "relative" }}>
      <div className="reload_icon_chatbox" onClick={refreshChatHandler}>
        <ReloadOutlined />
      </div>
      <Row className="chatBox" ref={ChatBoxRef} >
        {getMessageList &&
          getMessageList?.map(
            ({
              name,
              manufactureConversation,
              customerConversation,
              url,
              timeStamp,
              messageId,
            }) => (
              <>
                {customerConversation && (
                  <div className="customerChat">
                    <div className="customerInfo">
                      <Col span={1}>
                        {url ? (
                          <Avatar
                            src={url}
                            size={40}
                            className="chat-profile-icon"
                          />
                        ) : (
                          <Avatar
                            size={40}
                            style={{
                              backgroundColor: "#E5F2F6",
                              color: "#40a9ff",
                            }}
                            className="chat-profile-icon"
                          >
                            {name.toString().toUpperCase().charAt(0)}
                          </Avatar>
                        )}
                      </Col>

                      <Col span={12}>
                        <Title level={5} className="user-name">
                          {name}
                        </Title>
                      </Col>
                      {/* <Col span={4}> */}
                      <Text className="chat_date">
                        {moment(timeStamp).format("dddd hh:mm A")}
                      </Text>
                      {/* </Col> */}
                    </div>

                    <div className="customerMessage">
                      <Col span={16} offset={1}>
                        <Input
                          className="receive-msg-box"
                          value={customerConversation}
                          disabled={true}
                        />
                      </Col>
                    </div>
                  </div>
                )}
                {manufactureConversation && (
                  <div className="manufacturerChat">
                    {" "}
                    <div className="manufaturerInfo">
                      <Col span={1} offset={14}>
                        {url ? (
                          <Avatar
                            src={url}
                            size={40}
                            className="chat-profile-icon"
                          />
                        ) : (
                          <Avatar
                            size={40}
                            style={{
                              backgroundColor: "#E5F2F6",
                              color: "#40a9ff",
                            }}
                            className="chat-profile-icon"
                          >
                            {name.toString().toUpperCase().charAt(0)}
                          </Avatar>
                        )}
                      </Col>

                      <Col span={4}>
                        <Title className="user-name" level={5}>
                          {name}
                        </Title>
                      </Col>
                      <Col span={4}>
                        {/* <Title className="time-stamp" level={5}> */}
                        <Text className="chat_date">
                          {moment(timeStamp).format("dddd hh:mm A")}
                        </Text>
                        {/* </Title> */}
                      </Col>
                      {/* <Col span={4}
                      //  onMouseEnter={() => setEditandDelete({ ...EditandDelete, show: messageId })} onMouseLeave={() => setEditandDelete({ ...EditandDe  lete, show: null })}
                        > */}
                      {/* <Text type="link" >
                          <EllipsisOutlined className="edit_ellipsis" />
                        </Text> */}
                      {/* {EditandDelete.show === messageId || true &&  */}
                      <div className="editon_hover_chat">
                        <EditOutlined
                          onClick={() => {
                            if (EditandDelete.edit !== "") {
                              return setEditandDelete({
                                ...EditandDelete,
                                edit: "",
                              })
                            }
                            setEditandDelete({
                              ...EditandDelete,
                              edit: messageId,
                            })
                          }}
                        />
                        <DeleteOutlined
                          onClick={() => deleteMessageHandler(messageId)}
                        />
                      </div>
                      {/* // } */}
                      {/* </Col> */}
                    </div>
                    <div className="manufacturerMessage">
                      <Col
                        span={9}
                        offset={15}
                        className={
                          messageId === EditandDelete.edit
                            ? "send-msg-box send_msg_edit"
                            : "send-msg-box"
                        }
                      >
                        <TextArea
                          defaultValue={manufactureConversation}
                          onChange={(e) =>
                            setChangeConversation(e.target.value)
                          }
                          disabled={messageId !== EditandDelete.edit}
                          autoSize
                          style={{ height: "100% !important" }}
                        />
                        {messageId === EditandDelete.edit ? (
                          <SendOutlined
                            onClick={() => changeEditMessageHandler(messageId)}
                          />
                        ) : (
                          ""
                        )}
                      </Col>
                    </div>
                  </div>
                )}
              </>
            )
          )}
      </Row>
      <Col span={24}>
        <Form
          onFinish={() => onSendMessage()}
        >
          <Form.Item>
            <Input
              value={sendMessage}
              onChange={(e) => setSendMessage(e.target.value)}
              placeholder="Send a Message"
              className="input-msg-box"
              suffix={
                <Button htmlType="submit">
                  <SendOutlined
                    className={sendMessage ? "send-icon" : "send-icon-disable"}
                  />
                </Button>
              }
            />
          </Form.Item>
        </Form>
      </Col>
    </Row>
  )
}
export default ChatConversation

// <span className="edit_chat_span" onClick={() => setEditandDelete({ ...EditandDelete, edit: messageId })}>
// <svg
//   width="24"
//   height="24"
//   viewBox="0 0 24 24"
//   fill="none"
//   xmlns="http://www.w3.org/2000/svg"

// >
//   <path
//     d="M6.96777 15.3655V17.1306C6.96777 17.2932 7.09552 17.421 7.2581 17.421H9.02326C9.09874 17.421 9.17423 17.3919 9.22648 17.3339L15.5671 10.999L13.3897 8.82161L7.05487 15.1564C6.99681 15.2145 6.96777 15.2842 6.96777 15.3655ZM17.251 9.31515C17.4775 9.0887 17.4775 8.7229 17.251 8.49644L15.8923 7.13773C15.6658 6.91128 15.3 6.91128 15.0736 7.13773L14.011 8.20031L16.1884 10.3777L17.251 9.31515Z"
//     fill="#0A7CA7"
//   />
//   <rect
//     x="0.5"
//     y="0.5"
//     width="23"
//     height="23"
//     rx="3.5"
//     stroke="#0A7CA7"
//   />
// </svg>
// </span>
// <span className="edit_chat_span" onClick={() => deleteMessageHandler(messageId)}>
// <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//   <rect x="0.5" y="0.5" width="23" height="23" rx="3.5" stroke="#0A7CA7" />
//   <path d="M15.4572 9.35925H8.54199V16.3016C8.67216 17.2779 9.53634 17.4496 9.95216 17.4135H14.3996C15.3759 17.2399 15.5115 16.5999 15.4572 16.3016V9.35925Z" fill="#0A7CA7" />
//   <path d="M8 7.56949V8.70847H16V7.56949H14.0746L13.4508 7H10.5492L10.0068 7.56949H8Z" fill="#0A7CA7" />
// </svg>
// </span>
