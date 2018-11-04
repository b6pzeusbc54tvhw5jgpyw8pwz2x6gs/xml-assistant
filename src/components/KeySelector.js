import React from 'react'
import styled from 'styled-components'
import { Flex, Box, Button } from 'rebass'

const BoxComponent = styled(Box)`
  box-sizing: border-box;
  color: white;
  background-color: magenta;
  padding: 16px;
  font-size: 24px;
`

class KeySelector extends React.Component {
  constructor(props) {
    super(props)
    console.log(props.xmlConfigArr)
  }

  render() {
    const { props } = this
    return (
      <BoxComponent width={[1,0.6]}>
        key selector
      </BoxComponent>
    )
  }
}

export default KeySelector
