import React from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { Flex, Box, Heading } from 'rebass'
import reject from 'lodash/reject'
import isObject from 'lodash/isObject'
import XmlConfig from '../components/XmlConfig'
import KeySelector from '../components/KeySelector'
import DropZone from '../components/DropZone'
import store from '../browser/customStore'
import uniqid from 'uniqid'


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

const ResetAll = styled(Box)`
  background-color: rgba(22, 206, 222, 0.6);
  float: right;
  box-sizing: border-box;
  color: white;
  padding: 16px;
  font-size: 24px;
  cursor: pointer;
`

const CenteralToolBox = styled.div`
  height: 52px;
  background-color: rgba(255, 0, 0, 0.28);
`

class IndexPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      keyPath: '',
      xmlConfigArr: [],
    }

    this.addXmlConfig = this.addXmlConfig.bind(this)
    this.deleteXmlConfig = this.deleteXmlConfig.bind(this)
    this.setAllXmlConfigKeyPath = this.setAllXmlConfigKeyPath.bind(this)
    this.resetAll = this.resetAll.bind(this)
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
    const id = uniqid('xmlConfig:')
    const { name, text, size } = info
    const xmlConfig = { id, name, text, size, keyPath: '', cursor: -1 }
    this.setState({ xmlConfigArr: [ ...this.state.xmlConfigArr, xmlConfig ]})
  }
  resetAll() {
    this.setState({ xmlConfigArr: [] })
    store.set('state', this.state)
  }
  deleteXmlConfig(id) {
    const { xmlConfigArr } = this.state

    this.setState({
      xmlConfigArr: reject( xmlConfigArr, xc => xc.id === id ),
    })
  }
  setAllXmlConfigKeyPath( option ) {
    const { xmlConfigArr } = this.state
    const keyPath = option.value
    this.setState({
      keyPath,
      xmlConfigArr: xmlConfigArr.map( xc => ({ ...xc, keyPath })),
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
          <CenteralToolBox>
            <KeySelector
              id={'CenteralSelector'}
              xmlConfigArr={state.xmlConfigArr}
              keyPath={this.state.keyPath}
              onChange={this.setAllXmlConfigKeyPath}
            />
            <ResetAll>
              <div onClick={this.resetAll}>reset all</div>
            </ResetAll>
          </CenteralToolBox>
          {state.xmlConfigArr.map( (xmlConfig,i) =>
            <XmlConfig
              key={xmlConfig.id}
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

