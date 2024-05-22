import React, { useState } from "react";
import { Modal, Button, Input } from "antd";
import { useBarcode } from "react-barcodes";
import "antd/dist/antd.css";
import "./barcode_gen.css";

const BarcodeGen = ({ isBarcode, setIsBarcode }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { inputRef } = useBarcode({
    value: "12345 678",
    options: {
      background: "#ffff",
    },
  });
  return (
    <div>
      <div style={{ textAlign: "center" }}>
        <svg ref={inputRef} style={{ marginLeft: "20%" }} />
      </div>
      {/* </Modal> */}
    </div>
  );
};

export default BarcodeGen;
