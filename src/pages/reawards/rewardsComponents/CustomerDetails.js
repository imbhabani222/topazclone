import Points from "./Points"

const CustomerDetails = ({ customerKey , setkey }) => {
    return <>
        <Points
            setkey={setkey}
            customerKey={customerKey}
            currentpage="customerDetails"
        />
    </>
}

export default CustomerDetails