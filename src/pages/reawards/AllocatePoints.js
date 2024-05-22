import { useState } from "react"
import Points from "./rewardsComponents/Points"
import PointsModal from "./rewardsComponents/PointsModal"



const AllocatePoints = ({ showmodal, setShowmodal, selectedCustomers,codeOFcustomer, setSelectedCustomer }) => {
    const [selectAll, setSelectAll] = useState(false)
    return <>
        <Points
            currentpage="allocate"
            setShowmodal={setShowmodal}
            selectedCustomers={selectedCustomers}
            setSelectedCustomer={setSelectedCustomer}
            setSelectAll={setSelectAll}
            selectAll={selectAll}
            codeOFcustomer={codeOFcustomer}
        />
        <PointsModal
            showmodal={showmodal}
            setShowmodal={setShowmodal}
            selectedCustomers={selectedCustomers}
            setSelectedCustomer={setSelectedCustomer}
            setSelectAll={setSelectAll}
            selectAll={selectAll}
            codeOFcustomer={codeOFcustomer}
        />
    </>
}

export default AllocatePoints

