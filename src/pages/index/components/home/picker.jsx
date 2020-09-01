import React, { Component } from 'react'
import { Picker } from '@tarojs/components'

import "taro-ui/dist/style/components/list.scss"

class PickerComponent extends Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this)
    }
    onChange(e) {
        this.props.onOk(this.props.range[e.detail.value])
    }
    render() {
        return (
            <Picker className='picker' mode='selector' range={this.props.range} onChange={this.onChange}>
                {this.props.children}
            </Picker>
        );
    }
}

export default PickerComponent;