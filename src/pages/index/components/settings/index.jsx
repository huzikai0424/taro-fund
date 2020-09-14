import React, { Component } from 'react'
import { View ,Checkbox} from '@tarojs/components'
import { AtForm, AtSwitch, AtCheckbox,AtButton,AtList, AtListItem,AtAccordion } from 'taro-ui'
import "taro-ui/dist/style/components/checkbox.scss";
import "taro-ui/dist/style/components/icon.scss";
import "taro-ui/dist/style/components/list.scss";
import './index.less'

class Settings extends Component {
    constructor() {
        super()
        this.state = { 
            autoRefresh: false,
            boardList: [],
            openBoardList:true
        }
        this.checkboxOption = [{
            value: '000001',
            label: '上证指数'
        },{
            value: '000300',
            label: '沪深300'
        },{
            value: '000905',
            label: '中证500'
        },{
            value: '000016',
            label: '上证50'
        }, {
            value: '399001',
            label: '深证成指'
        }, {
            value: '399006',
            label: '创业板指'
        }]
    }
    handleChange = value => {
        this.setState({ autoRefresh:value })
    }
    handleBoardChange = (value)=>{
        this.setState({
            boardList: value
        })
    }
    handleClick = (value) => {
        console.log(value)
        this.setState({
            openBoardList: value
        })
      }
    render() {
        const { openBoardList } = this.state
        return (
            <View className='settings'>
                <View className='panel'>
                    <View className='panel-title'>个性设置</View>
                    <AtForm>
                        <AtSwitch title='自动更新' size='small' checked={this.state.autoRefresh} onChange={this.handleChange} />
                        <AtSwitch title='收益置左' size='small' border={false} checked={this.state.autoRefresh} onChange={this.handleChange} />
                    </AtForm>
                </View>

                <View className='panel'>
                    <View className='panel-title'>大盘指数</View>
                    {/* <AtAccordion
                      open={openBoardList}
                      onClick={this.handleClick}
                      title='大盘指数'
                    >
                    </AtAccordion> */}
                    <AtCheckbox
                      options={this.checkboxOption}
                      selectedList={this.state.boardList}
                      onChange={this.handleBoardChange}
                    />
                    {/* {_checkboxOption} */}
                </View>

                <View className='panel'>
                    <View className='panel-title'>关于</View>
                    <AtList>
                        <AtListItem title='使用帮助' arrow='right' />
                        <AtListItem title='意见反馈' arrow='right' />
                        <AtListItem title='捐赠' arrow='right' />
                        <AtListItem title='关于' arrow='right' />
                    </AtList>
                </View>
            </View>
        );
    }
}

export default Settings;