import React from 'react'
import styled from 'styled-components'
import { Flex, Box, Button } from 'rebass'

const ConfigBox = styled(Flex)`
  box-sizing: border-box;
  height: 200px;
  background-color: rgba(222,222,11,0.4);
  flex-wrap: wrap;
`

const EditorBox = styled(Box)`
  box-sizing: border-box;
  height: 200px;
  background-color: rgba(11,222,200,0.4);
`

const ToolBox = styled(Box)`
  box-sizing: border-box;
  height: 200px;
  background-color: rgba(218,11,200,0.4);
`

class XmlConfig extends React.Component {

  render() {
    const { props } = this
    return (
      <ConfigBox width={[ 1 ]}>
        <EditorBox width={[ 1, 0.6 ]}>
          <div>{props.text}</div>
        </EditorBox>
        <ToolBox width={[ 1, 0.4 ]}>
          <Button>delete</Button>
          <div>{JSON.stringify(props.isSync)}</div>
          <div>{props.keyPath}</div>
          <div>{props.cursor}</div>
        </ToolBox>
      </ConfigBox>
    )
  }
}

export default XmlConfig
