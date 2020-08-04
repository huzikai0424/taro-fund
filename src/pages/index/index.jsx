import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtTabBar } from 'taro-ui'
import 'taro-ui/dist/style/index.scss'
// import "taro-ui/dist/style/components/button.scss" 
// import "taro-ui/dist/style/components/tab-bar.scss"
// import "taro-ui/dist/style/components/badge.scss"
// import "taro-ui/dist/style/components/icon.scss"
import './index.less'
import Home from './components/home/home'
import Profit from './components/profit/index'
import Settings from './components/settings/index'

export default class Index extends Component {
  constructor() {
    super()
    this.state = {
      current:0
    }
    this.handleClick = this.handleClick.bind(this)
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide() { }
  
  handleClick (value) {
    this.setState({
      current: value
    })
  }
  


  render() {
    const {current} = this.state
    return (
      <View className='index'>
        <View className='container'>
          {current===0?<Home />:current===1?<Profit />:<Settings />}
        </View>
        <AtTabBar
          fixed
          tabList={[
            { title: '总览', iconType: 'bullet-list'},
            { title: '收益', iconType: 'analytics'},
            { title: '设置', iconType: 'settings'}
          ]}
          onClick={this.handleClick}
          current={current}
        />
      </View>
    )
  }
}
