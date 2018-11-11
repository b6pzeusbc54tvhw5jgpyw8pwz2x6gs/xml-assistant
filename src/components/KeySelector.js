import React from 'react'
import styled from 'styled-components'
import { Box } from 'rebass'
import Select from 'react-select'
import find from 'lodash/find'
import { getUnionedKeyArr } from '../core'

const BoxComponent = styled(Box)`
  box-sizing: border-box;
  color: white;
  background-color: magenta;
  font-size: 24px;
  float: left;
`

const colourStyles = {
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return { ...styles, color: 'black' }
  },
}

class KeySelector extends React.Component {
  constructor(props) {
    super(props)
    this.state = { optionArr: [] }
  }
  componentDidMount() {
    const { xmlConfigArr } = this.props
    const xmlConfigTextArr = xmlConfigArr.map( xc => xc.text )
    getUnionedKeyArr( xmlConfigTextArr ).then( keyPathArr => {
      const optionArr = keyPathArr.map( p => ({ value: p, label: p }))
      this.setState({ optionArr })
    })
  }
  componentDidUpdate(prevProps, prevState) {
    const { xmlConfigArr } = this.props
    if(prevProps.xmlConfigArr === xmlConfigArr) {
      return
    }

    const xmlConfigTextArr = xmlConfigArr.map( xc => xc.text )
    getUnionedKeyArr( xmlConfigTextArr ).then( keyPathArr => {
      const optionArr = keyPathArr.map( p => ({ value: p, label: p }))
      this.setState({ optionArr })
    })
  }
  render() {
    const value = find(this.state.optionArr, { value: this.props.keyPath })
    return (
      <BoxComponent width={[1,0.6]}>
        <Select
          instanceId={this.props.id}
          options={this.state.optionArr}
          styles={colourStyles}
          onChange={this.props.onChange}
          value={value}
        />
      </BoxComponent>
    )
  }
}

export default KeySelector
