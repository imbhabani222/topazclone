import React, { useState } from "react";
import { Modal, Button, Input } from "antd";
import { Alert } from "antd";
import { Anchor } from "antd";
import "antd/dist/antd.css";
import { useBarcode } from "react-barcodes";
import "./ActivationLink.css";
const { Link } = Anchor;

const ActivationLink = ({ isActive, setIsActive, activationLink }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  console.log(activationLink.data);
  // const showModal = () => {
  //   setIsModalVisible(true);
  // };

  // const handleOk = () => {
  //   setIsModalVisible(false);
  // };

  // const handleCancel = () => {
  //   setIsModalVisible(false);
  // };

  return (
    <div>
      {/* <div style={{ display: "none" }}>
        <svg ref={inputRef} />
      </div>
      <Button type="primary" onClick={isBarcode}>
        Barcode
      </Button> */}
      <Modal
        title="Registration Link"
        centered
        visible={isActive}
        // onOk={handleOk}
        className="edit_details"
        maskClosable={false}
        onCancel={() => setIsActive(false)}
        closeIcon={
          <svg
            width="31"
            height="31"
            marginTop="5px"
            viewBox="0 0 31 31"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.143 14.9615L22.813 9.29147C22.9404 9.14268 23.007 8.95128 22.9994 8.75554C22.9919 8.55979 22.9107 8.3741 22.7722 8.23558C22.6337 8.09707 22.448 8.01592 22.2522 8.00836C22.0565 8.0008 21.8651 8.06738 21.7163 8.1948L16.0463 13.8648L10.3763 8.18702C10.2275 8.0596 10.0361 7.99302 9.84038 8.00058C9.64463 8.00814 9.45895 8.08929 9.32043 8.22781C9.18191 8.36632 9.10076 8.55201 9.0932 8.74776C9.08564 8.94351 9.15222 9.1349 9.27965 9.28369L14.9496 14.9615L9.27187 20.6315C9.19045 20.7012 9.12432 20.787 9.07764 20.8835C9.03095 20.98 9.00472 21.0851 9.00058 21.1922C8.99644 21.2993 9.01449 21.4061 9.05359 21.5059C9.0927 21.6057 9.15201 21.6964 9.22781 21.7722C9.3036 21.848 9.39425 21.9073 9.49406 21.9464C9.59387 21.9855 9.70068 22.0036 9.8078 21.9994C9.91491 21.9953 10.02 21.969 10.1165 21.9224C10.213 21.8757 10.2988 21.8096 10.3685 21.7281L16.0463 16.0581L21.7163 21.7281C21.8651 21.8556 22.0565 21.9221 22.2522 21.9146C22.448 21.907 22.6337 21.8259 22.7722 21.6873C22.9107 21.5488 22.9919 21.3631 22.9994 21.1674C23.007 20.9716 22.9404 20.7803 22.813 20.6315L17.143 14.9615Z"
              fill="#0A7CA7"
            />
            <rect
              x="0.5"
              y="0.5"
              width="30"
              height="30"
              rx="3.5"
              stroke="#0A7CA7"
            />
          </svg>
        }
        width={757}
        footer={null}
      >
        <div style={{ textAlign: "center", width: "80%", margin: "0 auto" }}>
          <Alert
            description={
              <a href={activationLink.data}>{activationLink.data}</a>
            }
            type="info"
          />
          <div className="center">
            <Button
              key="submit"
              type="primary"
              onClick={() => setIsActive(false)}
              className="download-btn"
            >
              Send
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ActivationLink;
