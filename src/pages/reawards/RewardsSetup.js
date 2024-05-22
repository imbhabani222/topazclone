import { Button, Col, DatePicker, Divider, Form, Input, Row, message } from 'antd';
import "./Rewards.css"
import moment from 'moment';
import { Fragment, useEffect, useRef, useState } from 'react';
import { RightCircleOutlined } from '@ant-design/icons';
import { rewardsSetupPointsAction, newRewardSetupAction } from '../../action/useraction';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

const RewardSetup = () => {
    const amountSpentRef = useRef()
    const rewardPointsRef = useRef()
    const dispatch = useDispatch()
    const defaultPoints = useSelector((state) => state.getRewardSetPointReducer)

    const { data, loading } = defaultPoints

    useEffect(() => {
        dispatch(rewardsSetupPointsAction())
    }, [])

    useEffect(() => {
        if (data) {
            amountSpentRef.current.value = data.amountSpent
            rewardPointsRef.current.value = data.rewardPoints
        }
    }, [defaultPoints])

    const rewardSetupHandler = (e) => {
        e.preventDefault()
        const valToInt = { amountSpent: parseInt(amountSpentRef.current.value), rewardPoints: parseInt(rewardPointsRef.current.value) }
        if (!amountSpentRef.current.value || !rewardPointsRef.current.value) {
            message.error("Please Enter Input Feilds")
        }
        console.log(valToInt)
        dispatch(newRewardSetupAction({ valToInt }))
        message.success("Reward Setup Successfull")
    }
    return <form className='reawards_container' onSubmit={rewardSetupHandler} >
        <div className='rewards_inner_container'>
            <h4>Enter Points</h4>
            <div className='reward_points_div'>
                <div className='reward_points_amount'>
                    <h6>AMOUNT</h6>
                    <input type='number' ref={amountSpentRef} />
                    <RightCircleOutlined className='right_circle_rewards' />
                </div>
                <div className=' '>
                    <h6>POINTS</h6>
                    <input type='number' ref={rewardPointsRef} />
                </div>
            </div>
        </div>
        <div className='rewards_footer_container'>
            <Divider
                className="rewards_divider"
            />
            <Button
                type="primary"
                htmlType="submit"
                className="rewards_submit"
            >
                Set Reward
            </Button>
        </div>
    </form>
}

export default RewardSetup