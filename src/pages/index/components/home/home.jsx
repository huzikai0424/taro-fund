import React, { Component } from 'react'
import { View,AtToast,ScrollView } from '@tarojs/components'
import dayjs from 'dayjs'
import axios from 'axios'
import classnames from 'classnames'
import "taro-ui/dist/style/components/toast.scss";
import "taro-ui/dist/style/components/icon.scss";
import './home.less'

localStorage.setItem('fund','[{"id":"001740","num":"4890.1","money":"7000"},{"id":"400015","num":"2008.45","money":"3000"},{"id":"005939","num":"3222.71","money":"5000"},{"id":"519674","num":"809.59","money":"4500"},{"id":"320007","num":"3955.54","money":"6000"},{"id":"001645","num":"1436.54","money":"4000"},{"id":"000522","num":"871.67","money":"2000"},{"id":"008087","num":"1669.24","money":"1900"},{"money":"1410","id":"501090","num":"1332.87"},{"id":"003095","num":"368.31","money":"1000"},{"id":"001052","num":"17474.42","money":"12500"},{"id":"160221","num":"4379.62","money":"4000"},{"id":"001557","num":"3867.26","money":"4815"}]')

class Home extends Component {
    constructor() {
        super()
        this.state = { 
            boardData: [],
            fundData: [],
            showList: JSON.parse(localStorage.getItem('fund')) || [],
            fundList: JSON.parse(localStorage.getItem('fund')) || []
        }
    }
    componentDidMount() {
        this.state.fundList.forEach(item => {
            this.jsonp(`https://fundgz.1234567.com.cn/js/${item.id}.js?rt=${new Date().getTime()}`)
        })
        // axios.get('https://fundgz.1234567.com.cn/js/005939.js?rt=1596615836579').then(res => {
            // console.log(res)
        // }).catch(err => {
            // console.error(err)
        // })
        // console.log(this.state.fundList)
        // this.getBoardIndex()
        // this.getFundDatas()
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
    /**
     * jsonp请求接口
     * @param {*} url 
     * @param {*} jsonpCallback 
     */
    jsonp(url, jsonpCallback = 'jsonpgz') {
        const script = document.createElement('script')
        script.src = url
        script.onload = (e)=> {
          e.currentTarget.remove()
        }
        const { showList } = this.state
        window[jsonpCallback] = data => {
            if (!data) return
            let targetIndex = showList.findIndex((item) => item.id == data.fundcode)
            showList[targetIndex] = {
                ...showList[targetIndex],
                ...data
            }
            this.setState({
                showList
            })
        }
        document.body.appendChild(script)
    }
    render() {
        const { boardData,showList } = this.state
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
        const leftList = showList.map(item => {
            return (
                <View className='tr' key={item.id}>
                    <View className='td'>
                        <View>{item.name}</View>
                        <View>{item.fundcode}</View>
                    </View>
                </View>
            )
        })
        const rightList = showList.map(item => {
            return (
                <View className='tr body' key={item.id}>
                    <View className='td'>{item.dwjz}</View>
                    <View className='td'>{item.gsz}</View>
                    <View className='td'>{item.gszzl}%</View>
                    <View className='td'>{item.num}</View>
                    <View className='td'>{item.money}</View>
                    <View className='td'>today</View>
                    <View className='td'>all</View>
                    <View className='td'>{item.gztime}</View>
                </View>
            )
        })
        return (
            <View className='home'>
                <View className='boardList'>
                    {boardList}
                </View>
                <View className='fundList'>
                    <View className='leftPart'>
                        <View className='thead'>
                            <View className='td'>基金代码</View>
                        </View>
                        <View className='tbody'>{leftList}</View>
                    </View>
                    <ScrollView className='rightPart' scrollX>
                        <View className='thead'>
                            <View className='tr'>
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
                        <View className='tbody'>
                            {rightList}
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}

export default Home;