import React, { Component } from 'react'
import { View,AtToast,ScrollView } from '@tarojs/components'
import dayjs from 'dayjs'
import axios from 'axios'
import classnames from 'classnames'
import "taro-ui/dist/style/components/toast.scss";
import "taro-ui/dist/style/components/icon.scss";
import './home.less'

class Home extends Component {
    constructor() {
        super()
        this.state = { 
            boardData: [],
            codes: ['519674', '501090', '400015', '320007', '160221', '008087'],
            fundData: []
        }
    }
    componentDidMount() {
        this.getBoardIndex()
        this.getFundDatas()
    }
    /**
     * 精确四舍五入
     */
    round = (num)=>{
        return Math.round((+num + Number.EPSILON) * 100) / 100
    }
    /**
     * https://api.doctorxiong.club/v1/stock/board
     * 大盘指数
     */
    getBoardIndex() {
        axios.get('https://api.doctorxiong.club/v1/stock/board').then(res => {
            console.log(res)
            this.setState({
                boardData:res.data.data
            })
        }).catch(err => {
            console.log(err)
        })
    }
    /**
     * https://api.doctorxiong.club/v1/fund?code=${code}
     * 基金详情合集
     */
    getFundDatas() {
        const codes = this.state.codes.toString()
        axios.get(`https://api.doctorxiong.club/v1/fund?code=${codes}`).then(res => { 
            console.log(res.data)
            this.setState({
                fundData:res.data.data
            })
        }).catch(err => {
            console.error(err)
        })
    }
    render() {
        const { boardData,fundData } = this.state
        const boardList = boardData.map(item => {
            return (
                <View className={classnames('board', item.changePercent < 0 ? 'green' : 'red')} key={item.code}>
                    <View className='boardName'>{item.name}</View>
                    <View className='price'>{item.price}</View>
                    <View className='change'>
                    <View>{item.priceChange}</View>
                    <View>{item.changePercent}%</View>
                    </View>
                </View>
            )
        })
        const fundList = fundData.map(item => {
            return (
                <View className='fundItem' key={item.code}>
                    <ScrollView>
                        
                    </ScrollView>
                    <View className='lineContainer'>
                        <View className='leftPart'>
                            <View className='fundName'>{item.name}</View>
                            <View className='fundCode'>{item.code}</View>
                        </View>
                        <View className='rightPart'>
                            <View className='td'>
                                <View className='netWorth'>{item.netWorth}</View>
                                <View className='dayGrowth'>{item.dayGrowth}</View>
                            </View>
                            <View className='td'>
                                <View className='expectWorth'>{item.expectWorth}</View>
                                <View className='expectGrowth'>{item.expectGrowth}</View>
                            </View>
                            <View className='td'>0</View>
                            <View className='td'>0</View>
                            <View className='td'>0</View>
                            <View className='td'>100</View>
                            <View className='td'>200</View>
                            <View className='td updateTime'>{item.expectWorthDate}</View>
                        </View>
                    </View>
                </View>
            )
        })
        return (
            <View className='home'>
                <View className='boardList'>
                    {boardList}
                </View>
                <View className='fundList'>
                    <View className='thead'>
                        <View className='lineContainer'>
                            <View className='leftPart'>基金代码</View>
                            <View className='rightPart'>
                                <View className='td'>净值</View>
                                <View className='td'>估值</View>
                                <View className='td'>持仓份额</View>
                                <View className='td'>总投入</View>
                                <View className='td'>历史收益</View>
                                <View className='td'>今日收益</View>
                                <View className='td'>总收益</View>
                                <View className='td'>更新时间</View>
                            </View>
                        </View>
                    </View>
                    <View className='tbody'>
                        {fundList}
                    </View>
                </View>
            </View>
        );
    }
}

export default Home;