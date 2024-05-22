
import React, { useState } from 'react';
import './Chathere.css'
import { Row, Col, Divider } from 'antd';
import { Input, Button, Form } from 'antd';
import { Layout } from 'antd';
import { PaperClipOutlined, SearchOutlined } from '@ant-design/icons';
import { List } from 'antd';






const Chathere = () => {
  const { Header, Footer, Content } = Layout;
  // const [Subject, setSubject] = useState([]);
  // const [status, setStatus] = useState(false);
  const [userchat, setChat] = useState([]);


  // const chatdata = [{
  //   key: '01',
  //   message: 'Hi, I have question regarding water proof plywood',
  //   userType: 'Customer',
  //   time: '2min',
  //   userName: 'Manoj Kumar',
  //   avatar: "https://randomuser.me/api/portraits/thumb/men/86.jpg",

  // }, {
  //   key: '02',
  //   message: 'I am here, How can help you?',
  //   userType: 'Product Owner',
  //   userName: 'Samir Bit',
  //   time: '1 day',
  //   avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIwMIGTutu1jpkhgNCLM-Rd2gz3d0MRSXuPw&usqp=CAU'
  // }, {
  //   key: '03',
  //   message: 'Hi, I need hardwood plywood 12mm and 8/4 size per square feet 45 rupess.',
  //   userType: 'Customer',
  //   userName: 'Manoj Kumar',
  //   time: '1week',
  //   avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIwMIGTutu1jpkhgNCLM-Rd2gz3d0MRSXuPw&usqp=CAU'
  // }]


  const data = [
    {
      key: '1',
      name: 'Manoj',
      email: 'manoj_kumar@gmail.com',
      status: 'Active',
      image: "https://randomuser.me/api/portraits/thumb/men/86.jpg",
      time: '1min',
      chat: [{
        message: 'Hi, I have question regarding water proof plywood',
        userType: 'Customer',
        userName: 'Manoj Kumar',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIwMIGTutu1jpkhgNCLM-Rd2gz3d0MRSXuPw&usqp=CAU'
      }, {
        message: 'I am here, How can help you?',
        userType: 'Product Owner',
        userName: 'Samir Bit',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIwMIGTutu1jpkhgNCLM-Rd2gz3d0MRSXuPw&usqp=CAU'
      }, {
        message: 'Hi, I need hardwood plywood 12mm and 8/4 size per square feet 45 rupess.',
        userType: 'Customer',
        userName: 'Manoj Kumar',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIwMIGTutu1jpkhgNCLM-Rd2gz3d0MRSXuPw&usqp=CAU'
      }]

    },
    {
      key: '2',
      name: 'Rakesh',
      email: "rakesh.ratan@gmail.com",
      status: "Offline",
      image: "https://randomuser.me/api/portraits/thumb/men/74.jpg",
      time: '3hrs',
      chat: [{
        message: 'Hi, How are you',
        userType: 'Customer',
        userName: 'Rakesh',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIwMIGTutu1jpkhgNCLM-Rd2gz3d0MRSXuPw&usqp=CAU'
      }, {
        message: 'I am Good.',
        userType: 'Product Owner',
        userName: 'Samir Kumar',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIwMIGTutu1jpkhgNCLM-Rd2gz3d0MRSXuPw&usqp=CAU'
      }, {
        message: 'Hi, I need hardwood plywood 12mm and 8/4 size per square feet 45 rupess.',
        userType: 'Customer',
        userName: 'Rakesh',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIwMIGTutu1jpkhgNCLM-Rd2gz3d0MRSXuPw&usqp=CAU'
      }]

    },
    {
      key: '3',
      name: 'Julia',
      email: "julia@gmail.com",
      status: 'Active',
      image: 'https://randomuser.me/api/portraits/thumb/women/24.jpg',
      time: '1week',
      chat: [{
        message: 'Hi, I have question regarding water proof plywood',
        userType: 'Customer',
        userName: 'Manoj Kumar',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIwMIGTutu1jpkhgNCLM-Rd2gz3d0MRSXuPw&usqp=CAU'
      }, {
        message: 'I am here, How can help you?',
        userType: 'Product Owner',
        userName: 'Samir Bit',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIwMIGTutu1jpkhgNCLM-Rd2gz3d0MRSXuPw&usqp=CAU'
      }, {
        message: 'Hi, I need hardwood plywood 12mm and 8/4 size per square feet 45 rupess.',
        userType: 'Customer',
        userName: 'Manoj Kumar',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIwMIGTutu1jpkhgNCLM-Rd2gz3d0MRSXuPw&usqp=CAU'
      }]

    },
    {
      key: '4',
      name: 'Andrew',
      email: "Andrew@gmail.com",
      status: 'Active',
      image: "https://randomuser.me/api/portraits/thumb/men/26.jpg",
      time: '1day',
      chat: [{
        message: 'Hi, I have question regarding water proof plywood',
        userType: 'Customer',
        userName: 'Manoj Kumar',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIwMIGTutu1jpkhgNCLM-Rd2gz3d0MRSXuPw&usqp=CAU'
      }, {
        message: 'I am here, How can help you?',
        userType: 'Product Owner',
        userName: 'Samir Bit',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIwMIGTutu1jpkhgNCLM-Rd2gz3d0MRSXuPw&usqp=CAU'
      }, {
        message: 'Hi, I need hardwood plywood 12mm and 8/4 size per square feet 45 rupess.',
        userType: 'Customer',
        userName: 'Manoj Kumar',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIwMIGTutu1jpkhgNCLM-Rd2gz3d0MRSXuPw&usqp=CAU'
      }]

    },
    {
      key: '5',
      name: 'Rose',
      email: "rose@gmail.com",
      status: "Offline",
      image: "https://randomuser.me/api/portraits/med/women/71.jpg",
      time: '2days',
      chat: [{
        message: 'Hi, I have question regarding water proof plywood',
        userType: 'Customer',
        userName: 'Manoj Kumar',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIwMIGTutu1jpkhgNCLM-Rd2gz3d0MRSXuPw&usqp=CAU'
      }, {
        message: 'I am here, How can help you?',
        userType: 'Product Owner',
        userName: 'Samir Bit',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIwMIGTutu1jpkhgNCLM-Rd2gz3d0MRSXuPw&usqp=CAU'
      }, {
        message: 'Hi, I need hardwood plywood 12mm and 8/4 size per square feet 45 rupess.',
        userType: 'Customer',
        userName: 'Manoj Kumar',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIwMIGTutu1jpkhgNCLM-Rd2gz3d0MRSXuPw&usqp=CAU'
      }]

    },
    {
      key: '6',
      name: 'Martina',
      email: "martina@gmail.com",
      status: 'Active',
      image: "https://randomuser.me/api/portraits/thumb/women/73.jpg",
      time: '30min',
      chat: [{
        message: 'Hi, I have question regarding water proof plywood',
        userType: 'Customer',
        userName: 'Manoj Kumar',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIwMIGTutu1jpkhgNCLM-Rd2gz3d0MRSXuPw&usqp=CAU'
      }, {
        message: 'I am here, How can help you?',
        userType: 'Product Owner',
        userName: 'Samir Bit',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIwMIGTutu1jpkhgNCLM-Rd2gz3d0MRSXuPw&usqp=CAU'
      }, {
        message: 'Hi, I need hardwood plywood 12mm and 8/4 size per square feet 45 rupess.',
        userType: 'Customer',
        userName: 'Manoj Kumar',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIwMIGTutu1jpkhgNCLM-Rd2gz3d0MRSXuPw&usqp=CAU'
      }]

    },
    {
      key: '7',
      name: 'Rose',
      email: "julia.rose@gmail.com",
      status: "Offline",
      image: "https://randomuser.me/api/portraits/med/women/71.jpg",
      time: '2days',
      chat: [{
        message: 'Hi, I have question regarding water proof plywood',
        userType: 'Customer',
        userName: 'Manoj Kumar',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIwMIGTutu1jpkhgNCLM-Rd2gz3d0MRSXuPw&usqp=CAU'
      }, {
        message: 'I am here, How can help you?',
        userType: 'Product Owner',
        userName: 'Samir Bit',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIwMIGTutu1jpkhgNCLM-Rd2gz3d0MRSXuPw&usqp=CAU'
      }, {
        message: 'Hi, I need hardwood plywood 12mm and 8/4 size per square feet 45 rupess.',
        userType: 'Customer',
        userName: 'Manoj Kumar',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIwMIGTutu1jpkhgNCLM-Rd2gz3d0MRSXuPw&usqp=CAU'
      }]

    },
    {
      key: '8',
      name: 'Martina',
      email: "julia.rose@gmail.com",
      status: 'Active',
      image: "https://randomuser.me/api/portraits/thumb/women/73.jpg",
      time: '30min',
      chat: [{
        message: 'Hi, I have question regarding water proof plywood',
        userType: 'Customer',
        userName: 'Manoj Kumar',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIwMIGTutu1jpkhgNCLM-Rd2gz3d0MRSXuPw&usqp=CAU'
      }, {
        message: 'I am here, How can help you?',
        userType: 'Product Owner',
        userName: 'Samir Bit',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIwMIGTutu1jpkhgNCLM-Rd2gz3d0MRSXuPw&usqp=CAU'
      }, {
        message: 'Hi, I need hardwood plywood 12mm and 8/4 size per square feet 45 rupess.',
        userType: 'Customer',
        userName: 'Manoj Kumar',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIwMIGTutu1jpkhgNCLM-Rd2gz3d0MRSXuPw&usqp=CAU'
      }]

    },
  ];

  const columns = [


    {
      title: 'status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'image',
      dataIndex: 'image',
      key: 'image',
    },
    {
      title: 'email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'chat',
      dataIndex: 'chat',
      key: 'chat',
    },
    {
      title: 'message',
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: 'userType',
      dataIndex: 'userType',
      key: 'userType',
    },
    {
      title: 'userName',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'avatar',
      dataIndex: 'avatar',
      key: 'avatar',
    }
  ];





  const { TextArea } = Input;

  const showChat = (key) => {
    // const ChatData = { userName: userchat.userName, userType: chat.userName, Avatar: chat.Avatar, message: chat.message, time: chat.time }
    let FoundData = data.find((e) => e.key === key).chat;
    console.log(FoundData)
    setChat(FoundData);

  }



  // const { Search } = Input;
  const onSearch = value => console.log(value);
  const onChange = e => {
    console.log('Change:', e.target.value);

  };

  // const ChatFunction = (item) => {
  //   const datasourse = { name: Subject.name, email: Subject.email, status: Subject.status, image: Subject.image, time: Subject.time }
  //   console.log(item);
  //   setSubject(datasourse);
  //   // alert('Hi');
  //   setStatus(true);

  // }



  return (
    <div className="Main-chat-container">
      <Row gutter={[8, 8]}>
        <Col xs={24} xm={24} md={24} lg={9} xl={9} >
          <Layout className='Chat-scroll'>
            <Header className='chat-header'>

              <Col xs={24} sm={24} md={24} lg={24} xl={24}  >
                <Input type="text" icon={<SearchOutlined />} className="search-input" placeholder="Search" onPressEnter={onSearch}  >
                  {/* <Search placeholder="Search" onPressEnter={onSearch} /> */}
                </Input>
              </Col>
            </Header>
            <Content>
              <div className='Chat-list'>
                <div className="Chat-box">

                  {data.map(item => {

                    return (

                      <List
                        className="Chat-box-list"
                        key={item.id}
                        bordered={false}
                        // onClick={ChatFunction}
                        grid={{
                          gutter: 16,
                          xs: 1,
                          sm: 2,
                          md: 4,
                          lg: 4,
                          xl: 4,
                          xxl: 3,
                        }}
                      >


                        <Row gutter={[16, 16]} style={{ cursor: "pointer" }} onClick={() => showChat(item.key)}>

                          <Col xs={8} xm={24} md={8} lg={8} xl={8} >
                            <img className='resizeimg' src={item.image} alt="" />
                          </Col>

                          {/* <span className='dot-status'></span */}

                          {/* {item.status} */}
                          {item.status === "Active" ? <p className="dot-status green"></p> : <p className="dot-status red"></p>}

                          <Col xs={8} xm={24} md={8} lg={8} xl={8} className="name_list" >

                            {item.name}
                            <br />
                            <p className="email_list" >
                              {item.email}
                            </p>

                          </Col>

                          <Col xs={8} xm={24} md={8} lg={8} xl={8} className="timelist">
                            {item.time}
                          </Col>

                        </Row>

                      </List>
                    )

                  })
                  }
                </div>


              </div>


            </Content>
            <Footer className='Chat-scroll-footer'></Footer>
          </Layout>
        </Col>


        <Col xs={24} xm={24} md={24} lg={15} xl={15}>
          <div className='Chat-area'>
            <Header className='chat-header' >
              {/* <Col xs={24} xm={24} md={24} lg={24} xl={15}> */}
              <div className="header-text">

                <h2>Manoj Kumar</h2>
                <h3><span className="dot-status active"></span> Active</h3>
                <span className="Icons"> <img
                  alt="example"
                  width="50"
                  src=" ../../../Icons/menu.png"
                /></span>

              </div>
              {/* </Col> */}

            </Header>
            <Divider />
            <Content>

              <div className="Message">


                {userchat.map(user => {

                  return (

                    <div>

                      <img src={user.avatar} alt="" width="50" height="50" />
                      <br />
                      <p > {user.userName}</p>
                      <br />
                      {/* <p>{user.time}</p> */}
                      <p> {user.message}</p>
                      <br />

                      {/* <p> {user.userType}</p> */}

                    </div>
                  )

                })
                }
                <ul id="chat">
                  <li class="you">
                    <img src="https://randomuser.me/api/portraits/thumb/men/86.jpg" alt="" className='resizeimg' />&nbsp;
                    <h2>Manoj Kumar</h2>  &nbsp;
                    <h3>2 mins</h3>
                    <br />
                    <div class="msg">
                      Hi, I have question regarding water proof plywood
                    </div>
                  </li>

                  <li class="me">
                    <h3>5 mins</h3>&nbsp;
                    <h2>Rakesh Ratan</h2>

                    <img src="https://randomuser.me/api/portraits/thumb/men/74.jpg" alt="" className='resizeimg' />&nbsp;


                    <br />
                    <div class="msg">
                      I am here, How can help you?
                    </div>
                  </li>

                </ul>


              </div>
            </Content>

            <Divider />
            <Footer className='Chat-footer'>
              <Form>
                <Form.Item>
                  <TextArea type="text" className='Chat-footer-textarea' bordered={false} showCount maxLength={100} onChange={onChange} allowClear={true} />
                  <PaperClipOutlined style={{ float: "left", margin: '25px' }} />
                  <Button className="btn-footer" type="primary" htmltype="submit" >Send</Button>
                </Form.Item>
              </Form>


            </Footer>
          </div>

        </Col >
      </Row >
    </div >
  )
}

export default Chathere


