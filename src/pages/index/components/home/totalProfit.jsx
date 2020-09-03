import React, { Component } from 'react'
import {View,Input } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import './totalProfit.less'

export default class TotalProfit extends Component {
    constructor (props) {
        super(props)
        this.state = {
            totalProfit: +localStorage.getItem('totalProfit')||0
        }
    }
    componentDidMount() {
        console.log(+localStorage.getItem('totalProfit')||0)
    }
    confirmOk() {
        localStorage.setItem('totalProfit', +this.state.totalProfit)
        this.props.onClose()
    }
    changeHandle(e) {
        this.setState({
            totalProfit:e.detail.value
        })
    }
    render() {
        const { totalProfit } = this.state
        return (
            <View id='totalProfit' className='active'>
                <View className='mainBox'>
                    <View className='title'>输入历史总收益</View>
                    <View className='content'>请排除当前已经录入的收益</View>
                    <Input type='text' className='input' onInput={(e) => this.changeHandle(e)} value={totalProfit} />
                    <View className='buttonActions'>
                        <AtButton type='primary' onClick={()=>this.confirmOk()}>确定</AtButton>
                        <AtButton type='secondary' onClick={()=>this.props.onClose()}>取消</AtButton>
                    </View>
                </View>
            </View>
        )
    }
}