import React, { Component } from 'react'
import {AtActionSheet, AtActionSheetItem } from 'taro-ui'
import { View, ScrollView,Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import dayjs from 'dayjs'
import axios from 'axios'
import classnames from 'classnames'
import "taro-ui/dist/style/components/action-sheet.scss";
import "taro-ui/dist/style/components/toast.scss";
import "taro-ui/dist/style/components/icon.scss";
import "taro-ui/dist/style/components/button.scss";
import "taro-ui/dist/style/components/loading.scss";
import "taro-ui/dist/style/components/fab.scss";
import { getAllFundData,deleteFundById,jsonp } from '@/untils'
import AddFund from './addFund'
import './home.less'
import Picker from './picker'

// localStorage.setItem('fund','[{"id":"001740","num":"4890.1","money":"7000"},{"id":"400015","num":"2008.45","money":"3000"},{"id":"005939","num":"3222.71","money":"5000"},{"id":"519674","num":"809.59","money":"4500"},{"id":"320007","num":"3955.54","money":"6000"},{"id":"001645","num":"1436.54","money":"4000"},{"id":"000522","num":"871.67","money":"2000"},{"id":"008087","num":"1669.24","money":"1900"},{"money":"1410","id":"501090","num":"1332.87"},{"id":"003095","num":"368.31","money":"1000"},{"id":"001052","num":"17474.42","money":"12500"},{"id":"160221","num":"4379.62","money":"4000"},{"id":"001557","num":"3867.26","money":"4815"}]')

class Home extends Component {
    constructor() {
        super()
        this.state = { 
            boardData: [],
            showList: JSON.parse(localStorage.getItem('fund')) || [],
            flag: 0,
            openAddFund: false,
            isShowActionToast: false,
            range: [],
            modalType: 0, //0新增 1修改
            initData: {}
          
        }
        this.pickerChange = this.pickerChange.bind(this)
        this.getFundApiData = this.getFundApiData.bind(this)
    }
    componentDidMount() {
       this.getFundApiData()
        // this.getBoardIndex()
        // this.getFundDatas()
    }
    getFundApiData() {
        Taro.showLoading({
            title: '加载中',
        })
        getAllFundData().forEach(item => {
            this.jsonp(`https://fundgz.1234567.com.cn/js/${item.id}.js?rt=${new Date().getTime()}`)
        })
    }
    showActionToast(boolean=true) {
        this.setState({
            isShowActionToast:boolean
        })
    }
    /**
     * 精确四舍五入
     */
    round = (num)=>{
        return (Math.round((+num + Number.EPSILON) * 100) / 100).toFixed(2)
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
            // this.setState({
            //     fundData:res.data.data
            // })
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
            console.log(this.state.flag,this.state.showList.length)
            if (this.state.flag < this.state.showList.length-1) {
                this.setState({
                    flag:this.state.flag+1
                })
            } else {
                const range = []
                showList.forEach((item) => {
                    range.push(`${item.id} ${item.name}`)
                })
                this.setState({
                    range,
                    flag:0
                })
                Taro.hideLoading()
            }
            this.setState({
                showList
            })
        }
        document.body.appendChild(script)
    }
    handleOpenAddFund (boolean=true){
        this.setState({
            openAddFund:boolean
        })
    }
    selectAction(type) {
        switch (type) {
            case 'add': {
                this.setState({
                    modalType:0
                })
                this.showActionToast(false)
                this.handleOpenAddFund(true)
                break;
            }
            case 'editor': {
                this.setState({
                    modalType:1
                })
                // this.showActionToast(false)
                // this.handleOpenAddFund(true)
                break;
            }
            case 'edirotAll': {
                break;
            }
            case 'delete': {
                break;
            }
            default:
                break;
        }
    }
    /**
     * 选择框回调函数
     */
    pickerChange(value,type) {
        this.showActionToast(false)
        if (type === 'editor') {
            
        } else if(type==='delete') {
            Taro.showModal({
                title: '确定删除基金？',
                content: value,
                confirmColor:'#ff0000',
                success: (item)=> {
                    if (item.confirm) {
                        const fundCode = value.split(' ')[0]
                        deleteFundById(fundCode)
                        let { showList } = this.state
                        showList = showList.filter((item2) => {
                            return item2.fundcode!=fundCode
                        })
                        console.log(showList)
                        this.setState({
                            showList
                        }, () => {
                            this.getFundApiData()
                        })
                    }
                }
            })
        }
    }
    render() {
        const { round } = this
        const { boardData, showList,isShowActionToast,range,modalType,initData } = this.state
        let _today = 0
        let _all = 0
        let _allMoney = 0
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
                        <View className='fundName'>{item.name}</View>
                        <View className='fundCode'>{item.fundcode}</View>
                    </View>
                </View>
            )
        })
        const rightList = showList.map(item => {
            const isRed = item.dwjz <= item.gsz ? 'red' : 'green'
            const today = round(item.dwjz * item.num * item.gszzl / 100)
            const all = round(item.gsz * item.num - item.money)
            _today += Number(today)
            _all += Number(all)
            _allMoney += Number(item.money)
            return (
                <View className='tr body' key={item.id}>
                    <View className='td'>{item.dwjz}</View>
                    <View className={classnames('td',isRed)}>{item.gsz}</View>
                    <View className={classnames('td',isRed)}>{item.gszzl}%</View>
                    <View className='td num'>{item.num}</View>
                    <View className='td money'>{item.money}</View>
                    <View className={classnames('td', isRed)}>{today}</View>
                    <View className={classnames('td', isRed)}>{all}</View>
                    <View className='td updateTime'>{item.gztime}</View>
                </View>
            )
        })
        return (
            <View className='home'>
                <View className='topInfo'>
                    <View className='board_SZ'></View>
                    {/* <View className='boardList'>
                        {boardList}
                    </View> */}
                    <View className='operate'>
                        <View className='button at-icon at-icon-reload' onClick={()=>this.getFundApiData()}>刷新</View>
                        {/* <View className='button at-icon at-icon-add' onClick={()=>this.handleOpenAddFund(true)}>新增</View> */}
                        <View className='button at-icon at-icon-edit' onClick={()=>this.showActionToast()}>
                            编辑
                        </View>
                        {/* <View className='button' onClick={()=>this.showActionToast()}>
                            <Picker range={['银河', '诺安']} onOk={this.pickerChange}>
                            </Picker>
                        </View> */}
                        {/* <View className='button at-icon at-icon-subtract'>删除</View> */}
                    </View>
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
                                <View className='td'>百分比</View>
                                <View className='td num'>持仓份额</View>
                                <View className='td money'>总投入</View>
                                {/* <View className='td'>历史收益</View> */}
                                <View className='td'>今日收益</View>
                                <View className='td'>总收益</View>
                                <View className='td updateTime'>更新时间</View>
                            </View>
                        </View>
                        <View className='tbody'>
                            {rightList}
                        </View>
                    </ScrollView>
                </View>
                <View className='summary'>
                    <View className='item'>
                        <View className='title'>总投入</View>
                        <View className='num'>{round(_allMoney)}</View>
                    </View>
                    <View className='item'>
                        <View className='title'>今日总收益</View>
                        <View className={classnames('num',_today>=0?'red':'green')}>{round(_today||0)}</View>
                    </View>
                    <View className='item'>
                        <View className='title'>历史总收益</View>
                        <View className={classnames('num',_all>=0?'red':'green')}>{round(_all||0)}</View>
                    </View>
                </View>
                
                <AtActionSheet isOpened={isShowActionToast} cancelText='取消' title='在下方选择你的操作'>
                    <AtActionSheetItem onClick={() => this.selectAction('add')}>
                        新增基金
                    </AtActionSheetItem>
                    <AtActionSheetItem onClick={() => this.selectAction('editor')}>
                        <Picker range={range} onOk={(value)=>this.pickerChange(value,'editor')}>
                            编辑基金
                        </Picker>
                    </AtActionSheetItem>
                    <AtActionSheetItem onClick={()=>this.selectAction('editorAll')}>
                        编辑总收益
                    </AtActionSheetItem>
                    <AtActionSheetItem onClick={() => this.selectAction('delete')}>
                        <Picker range={range} onOk={(value)=>this.pickerChange(value,'delete')}>
                            <Text className='red'>删除基金</Text>
                        </Picker>
                    </AtActionSheetItem>
                </AtActionSheet>
                <AddFund
                  openAddFund={this.state.openAddFund}
                  handleOpenAddFund={(boolean) => this.handleOpenAddFund(boolean)}
                  type={modalType}
                  initData={initData}
                  onSuccess={this.getFundApiData}
                />
            </View>
        );
    }
}

export default Home;