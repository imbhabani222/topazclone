const RecentTransactions = (page) => [
    {
        title: "SI No",
        dataIndex: "key",
        render: (text, record, index) => {
            return (page - 1) * 10 + index + 1
        },
        width: ".8%",
        key: "key",
        fixed: "left"
    },
    {
        title: "Date",
        dataIndex: "date",
        render: (text, record,) => {
            return record.date.split("T")[0].split("-").reverse().join("/")
        },
        sorter: ((a, b) => new Date(a.date) - new Date(b.date)),
        width: ".8%",
        key: "key",
    },
    {
        title: "Points Allocated",
        dataIndex: "pointsAllocated",
        key: "pointsAllocated",
        sorter: function (a, b) {
            if (a.pointsAllocated > b.pointsAllocated) return 1
            else if (a.pointsAllocated < b.pointsAllocated) return -1
        },
        width: "1.5%",
        render: (text, record,) => {
            if (record.pointsAllocated === null) {
                return "-"
            } else return record.pointsAllocated
        },
    },
    {
        title: "Points Redeemed",
        dataIndex: "pointsRedeem",
        key: "pointsRedeem",
        sorter: function (a, b) {
            if (a.pointsRedeem > b.pointsRedeem) return 1
            else if (a.pointsRedeem < b.pointsRedeem) return -1
        },
        width: "1.5%",
        render: (text, record,) => {
            if (record.pointsRedeem === null) {
                return "-"
            } else return record.pointsRedeem
        },
    },
    {
        title: "Reward for Redemption",
        dataIndex: "rewardredemption",
        key: "rewardredemption",
        sorter: function (a, b) {
            if (a.rewardredemption > b.rewardredemption) return 1
            else if (a.rewardredemption < b.rewardredemption) return -1
        },
        width: "1.5%",
        render: (text, record,) => {
            if (record.rewardredemption === null) {
                return "-"
            } else return record.rewardredemption
        },
    },
    {
        title: "Total Points",
        dataIndex: "totalPoint",
        key: "totalPoint",
        sorter: function (a, b) {
            if (a.totalPoint > b.totalPoint) return 1
            else if (a.totalPoint < b.totalPoint) return -1
        },
        width: "1.5%",
        fixed: "right",
    },
]


export default RecentTransactions



