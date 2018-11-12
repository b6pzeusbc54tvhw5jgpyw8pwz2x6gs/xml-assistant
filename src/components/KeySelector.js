import React from 'react'
import PropTypes from 'prop-types'
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
    return {
      ...styles,
      color: 'black',
      fontSize: 15,
    }
  },
  singleValue: (styles) => {
    return {
      ...styles,
      color: 'black',
      fontSize: 16,
    }
  },
  control: (styles) => {
    return {
      ...styles,
      width: '100%',
      height: '100%',
    }
  },
  container: (styles) => {
    return {
      ...styles,
      width: '100%',
      height: '100%',
    }
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
      <Select
        instanceId={this.props.id}
        options={this.state.optionArr}
        styles={colourStyles}
        onChange={this.props.onChange}
        value={value}
      />
    )
  }
}

KeySelector.propTypes = {
  xmlConfigArr: PropTypes.array.isRequired,
  keyPath: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default KeySelector
