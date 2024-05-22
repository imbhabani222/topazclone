import { GiftOutlined } from "@ant-design/icons";

const RewardComp = ({ setKey }) => {
    return <div className="reward_select_outer">
        <div className="select_reward_container" onClick={() => setKey("1")}>
            <span>
                <GiftOutlined className="rewards_gift_comp" />
            </span>
            <span>
                Reward Setup
            </span>
        </div>
        <div className="select_reward_container" onClick={() => setKey("2")}>
            <span>
                <GiftOutlined className="rewards_gift_comp" />
            </span>
            <span>
                Create Reward
            </span>
        </div>
        <div className="select_reward_container" onClick={() => setKey("3")}>
            <span>
                <GiftOutlined className="rewards_gift_comp" />
            </span>
            <span>
                Allocate Points
            </span>
        </div>
        <div className="select_reward_container" onClick={() => setKey("4")}>
            <span>
                <GiftOutlined className="rewards_gift_comp" />
            </span>
            <span>
                Redeem Points
            </span>
        </div>
        <div className="select_reward_container" onClick={() => setKey("5")}>
            <span>
                <GiftOutlined className="rewards_gift_comp" />
            </span>
            <span>
                Customer Reward Info
            </span>
        </div>
    </div>
}
export default RewardComp;