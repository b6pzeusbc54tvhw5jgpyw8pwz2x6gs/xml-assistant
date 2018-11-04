import React from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { Flex, Box, Heading, Button } from 'rebass'
import XmlConfig from '../components/XmlConfig'
import KeySelector from '../components/KeySelector'

const GlobalStyle = createGlobalStyle`
  body {
    padding: 0px;
    margin: 0px;
  }
`

const Header = styled(Flex)`
  background-color: rgba(242, 206, 18, 0.6);
`

class IndexPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      xmlConfigArr: [
        {
          text: `<?xml><config-root><host>db.host</host></config-root>`,
          isSync: false,
          keyPath: 'host',
          cursor: 10,
        }
      ]
    }
  }

  render() {
    const { state } = this
    return (
      <Box>
        <GlobalStyle whiteColor />
        <Header px={4} py={4} alignItems='center'>
          <Heading fontSize={[ 4, 5 ]} color='blue'>Xml Config Reader</Heading>
        </Header>
        <KeySelector xmlConfigArr={state.xmlConfigArr}/>
        {state.xmlConfigArr.map( (xmlConfig,i) => {
          return <XmlConfig key={i} {...xmlConfig}/>
        })}
      </Box>
    )
  }
}

export default IndexPage
