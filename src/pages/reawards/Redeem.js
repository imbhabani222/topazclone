import { useState } from "react"
import Points from "./rewardsComponents/Points"
import PointsModal from "./rewardsComponents/PointsModal"

const Redeem = ({ showmodal, setShowmodal, selectedCustomers, codeOFcustomer, setSelectedCustomer }) => {
    const [selectAll, setSelectAll] = useState(false)
    return <>
        <Points
            currentpage="redeem"
            selectedCustomers={selectedCustomers}
            setSelectedCustomer={setSelectedCustomer}
            showmodal={showmodal}
            setShowmodal={setShowmodal}
            codeOFcustomer={codeOFcustomer}
            setSelectAll={setSelectAll}
            selectAll={selectAll}
        />
        <PointsModal
            redeem={true}
            showmodal={showmodal}
            setShowmodal={setShowmodal}
            selectedCustomers={selectedCustomers}
            setSelectedCustomer={setSelectedCustomer}
            setSelectAll={setSelectAll}
            codeOFcustomer={codeOFcustomer}
            selectAll={selectAll}
        />
    </>
}

export default Redeem