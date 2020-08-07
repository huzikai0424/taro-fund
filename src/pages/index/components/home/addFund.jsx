import React, { Component } from 'react'
import {AtFloatLayout,AtInput, AtButton, AtList, AtListItem } from 'taro-ui'
import { View, ScrollView,Picker } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'


import "taro-ui/dist/style/components/list.scss";
import "taro-ui/dist/style/components/float-layout.scss";
import "taro-ui/dist/style/components/input.scss";
import "taro-ui/dist/style/components/icon.scss";
import './addFund.less'

class AddFund extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            selector:['000001 银河成长创新','000002 诺安']
        }
        this.save = this.save.bind(this)
        this.delete = this.delete.bind(this)
    }
    componentDidMount() { 

    }
    save() {
        this.props.handleOpenAddFund(false)
        Taro.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 2000
        })
    }
    delete() {
        
    }
    
    render() {
        return(
            <AtFloatLayout
              title='新增基金'
              className='addFund'
              isOpened={this.props.openAddFund}
              onClose={()=>this.props.handleOpenAddFund(false)}
            >
                <Picker mode='selector' range={this.state.selector}>
                    <AtList>
                        <AtListItem
                          title='选择基金'
                            // extraText={this.state.selectorChecked}
                        />
                    </AtList>
                </Picker>
                <AtInput
                  name='code'
                  title='基金代码'
                  type='digit'
                  placeholder='请输入基金代码'
                />
                <AtInput
                  name='value1'
                  title='持仓份额'
                  type='digit'
                  placeholder='请输入持有的基金份额'
                />
                <AtInput
                  name='value2'
                  title='总投入'
                  type='digit'
                  placeholder='请输入一共买了多少钱'
                />
                <AtInput
                  name='value3'
                  title='历史收益'
                  type='digit'
                  placeholder='如果从未卖出,请留空'
                />
                <View className='button-group'>
                    <AtButton className='button' type='primary' onClick={this.save}>保存</AtButton>
                    <AtButton className='button warning' onClick={this.delete}>删除</AtButton>
                </View>
            </AtFloatLayout>
        )
    }
}
export default AddFund;