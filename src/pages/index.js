import React from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { Flex, Box, Heading } from 'rebass'
import reject from 'lodash/reject'
import isObject from 'lodash/isObject'
import XmlConfig from '../components/XmlConfig'
import KeySelector from '../components/KeySelector'
import DropZone from '../components/DropZone'
import store from '../browser/customStore'

const GlobalStyle = createGlobalStyle`
  body {
    padding: 0px;
    margin: 0px;
  }
`

const Header = styled(Flex)`
  background-color: rgba(242, 206, 18, 0.6);
`

const Main = styled(Box)`
  background-color: rgba(202, 206, 18, 0.6);
`

class IndexPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      xmlConfigArr: [
        {
          filename: 'a.xml',
          text: `<?xml><config-root><host>db.host</host></config-root>`,
          keyPath: 'host',
          cursor: 10,
        },
      ],
    }

    this.addXmlConfig = this.addXmlConfig.bind(this)
    this.deleteXmlConfig = this.deleteXmlConfig.bind(this)
    this.setAllXmlConfigKeyPath = this.setAllXmlConfigKeyPath.bind(this)
  }

  componentDidMount() {
    const state = store.get('state')
    if( isObject( state )) {
      this.setState({
        xmlConfigArr: state.xmlConfigArr || [],
      })
    }
  }

  componentDidUpdate() {
    store.set('state', this.state)
  }

  addXmlConfig(info) {
    const { filename, text } = info
    const xmlConfig = { filename, text, keyPath: '', cursor: -1 }
    this.setState({ xmlConfigArr: [ ...this.state.xmlConfigArr, xmlConfig ]})
  }
  deleteXmlConfig(info) {
    const { xmlConfigArr } = this.state
    this.state({
      xmlConfigArr: reject( xmlConfigArr, xmlConfig => xmlConfig === info ),
    })
  }
  setAllXmlConfigKeyPath(keyPath) {
    const { xmlConfigArr } = this.state
    this.state({
      xmlConfigArr: xmlConfigArr.map( xmlConfig => ({ ...xmlConfig, keyPath })),
    })
  }

  render() {
    const { state } = this
    return (
      <Box>
        <GlobalStyle whiteColor />
        <Header px={4} py={4} alignItems='center'>
          <Heading fontSize={[ 4, 5 ]} color='blue'>Xml Config Reader</Heading>
        </Header>
        <Main px={3}>
          <KeySelector
            xmlConfigArr={state.xmlConfigArr}
            setAllXmlConfigKeyPath={this.setAllXmlConfigKeyPath}
          />
          {state.xmlConfigArr.map( (xmlConfig,i) =>
            <XmlConfig
              key={i}
              xmlConfig={xmlConfig}
              deleteXmlConfig={this.deleteXmlConfig}
            />
          )}
          <DropZone addXmlConfig={this.addXmlConfig}/>
        </Main>
      </Box>
    )
  }
}

export default IndexPage

