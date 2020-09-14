import React, { Component } from 'react';
import { View, ScrollView,Text } from '@tarojs/components'
import axios from 'axios'
import classnames from 'classnames'
import './boardList.less'

class BoardList extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            boardList: []
        };
        this.toggleExtend = this.toggleExtend.bind(this)
    }
    componentDidMount() {
        axios.get(`https://push2.eastmoney.com/api/qt/ulist.np/get?fltt=2&fields=f2,f3,f4,f12,f14&secids=1.000001,1.000300,1.000905,1.000016,0.399001,0.399006&_=${new Date().getTime()}`).then(res => {
            console.log(res.data)
            this.setState({
                boardList:res.data.data.diff
            })
        }).catch(err => {
            console.log(err)
        })
    }
    toggleExtend () {
        this.setState({
            extend: !this.state.extend
        })
    }
    render() {
        const {boardList} = this.state
        const _boardList = boardList.map((item) => (
            <View key={item.f12} className='boardData'>
                <View className='item1'>{item.f14}</View>
                <View className={classnames('item2', item.f4 >= 0 ? 'red' : 'green')}>
                    {item.f2}
                    {item.f4 >= 0?'↑':'↓'}
                </View>
                <View className={classnames('item3',item.f4>=0?'red':'green')}>
                    {item.f4} {item.f3}
                </View>
            </View>
        ))
        return (
            <ScrollView className={classnames('boardListContainer')} scrollX>
                {_boardList}
            </ScrollView>
            // <View className='boardListContainer'>
            // </View>
        );
    }
}

export default BoardList;