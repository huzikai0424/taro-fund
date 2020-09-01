import React, { Component } from 'react'
import {AtFloatLayout,AtInput, AtButton,AtToast} from 'taro-ui'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import {jsonp,getFundList,addFund} from '@/untils'
import "taro-ui/dist/style/components/list.scss";
import "taro-ui/dist/style/components/float-layout.scss";
import "taro-ui/dist/style/components/input.scss";
import "taro-ui/dist/style/components/icon.scss";
import "taro-ui/dist/style/components/toast.scss";
import './addFund.less'

class AddFund extends Component {
    constructor(props) {
        super(props)
        this.state = {
            code:null,
            num: null,
            money: null,
            historicalIncome: null,
            toastText:null
        }
        this.save = this.save.bind(this)
        this.delete = this.delete.bind(this)
    }
    componentDidMount() { 

    }
    save() {
        const fundList = getFundList()
        const { code,historicalIncome,money,num } = this.state
        if (!code||code.length < 6) {
            Taro.showToast({
                title: '基金代码输入有误，请重新输入',
                icon: 'warn',
                duration: 2000
            })
            return
        }
        if (fundList.includes(code)) {
            Taro.showToast({
                title: '此基金已添加，请尝试使用编辑功能',
                icon: 'warn',
                duration: 2000
            })
            return
        }
        
        jsonp(`https://fundgz.1234567.com.cn/js/${code}.js?rt=${new Date().getTime()}`).then(res => {
            console.log(res)
            Taro.showModal({
                title: '是否添加基金',
                content: `${res.name}(${res.fundcode})`,
                success: (item)=> {
                    if (item.confirm) {
                        const object = {
                            id: code,
                            historicalIncome: +historicalIncome || 0,
                            money:+money||0,
                            num:+num||0
                        }
                        addFund(object)
                        this.props.handleOpenAddFund(false)
                        this.props.onSuccess()
                    }
                }
            })
        }).catch(err => {
            Taro.showToast({
                title: '暂不支持此基金',
                icon: 'warn',
                duration: 2000
            })
            console.error(err)
        })
    }
    delete() {
        
    }
    handleInput(value, type) {
        switch (type) {
            case 'code': {
                this.setState({
                    code:value
                })
                break
            }
            case 'num': {
                this.setState({
                    num:+value
                })
                break
            }
            case 'money': {
                this.setState({
                    money:+value
                })
                break
            }
            case 'historicalIncome': {
                this.setState({
                    historicalIncome:+value
                })
                break
            }
            default:
                break;
        }
    }
    
    render() {
        const { code,num,money,historicalIncome,toastText} = this.state
        return (
            <View>
                <AtFloatLayout
                  title={this.props.type===0?'新增基金':'编辑基金'}
                  className='addFund'
                  isOpened={this.props.openAddFund}
                  onClose={()=>this.props.handleOpenAddFund(false)}
                >
                    <AtInput
                      name='code'
                      title='基金代码'
                      type='digit'
                      placeholder='基金代码'
                      value={code}
                      maxLength={6}
                      required
                      onChange={(e)=>this.handleInput(e,'code')}
                    />
                    <AtInput
                      name='num'
                      title='持仓份额'
                      type='digit'
                      placeholder='持有的基金份额'
                      value={num}
                      onChange={(e)=>this.handleInput(e,'num')}
                    />
                    <AtInput
                      name='money'
                      title='总投入'
                      type='digit'
                      placeholder='一共买了多少钱'
                      value={money}
                      onChange={(e)=>this.handleInput(e,'money')}
                    />
                    <AtInput
                      name='historicalIncome'
                      title='历史收益'
                      type='digit'
                      placeholder='如果从未卖出,请留空'
                      value={historicalIncome}
                      onChange={(e)=>this.handleInput(e,'historicalIncome')}
                    />
                    <View className='button-group'>
                        <AtButton className='button' type='primary' onClick={this.save}>保存</AtButton>
                        <AtButton className='button warning' onClick={this.delete}>删除</AtButton>
                    </View>
                </AtFloatLayout>
                <AtToast isOpened={toastText} text={toastText}></AtToast>
            </View>
        )
    }
}
export default AddFund;