import React from 'react'
import styled from 'styled-components'
import { Flex, Box, Button } from 'rebass'
import dynamic from 'next/dynamic'
import KeySelector from './KeySelector'
import { findLineByKey } from '../core'
import aniUC from 'animation-uc'


const MonacoEditor = dynamic(import('./MonacoEditor'), { ssr: false })

const ConfigBox = styled(Flex)`
  box-sizing: border-box;
  height: 300px;
  background-color: rgba(222,222,11,0.4);
  flex-wrap: wrap;
  margin-top: 0.5em;
`

const EditorBox = styled(Box)`
  overflow: hidden;
  box-sizing: border-box;
  background-color: rgba(11,222,200,0.4);
`

const ToolBox = styled(Box)`
  box-sizing: border-box;
  background-color: rgba(218,11,200,0.4);
`

class XmlConfig extends React.Component {
  constructor(props) {
    super(props)
    this.onClickDelete = this.onClickDelete.bind(this)
    this.onChangedKeyPath = this.onChangedKeyPath.bind(this)
    this.onRef = this.onRef.bind(this)
  }
  onClickDelete() {
    this.props.deleteXmlConfig(this.props.xmlConfig.id)
  }
  onChangedKeyPath(option) {
    const keyPath = option.value
    const newXmlConfig = { ...this.props.xmlConfig, keyPath }
    this.props.setXmlConfig( newXmlConfig.id, newXmlConfig )
  }
  componentDidUpdate(prevProps) {
    if( prevProps.xmlConfig.keyPath !== this.props.xmlConfig.keyPath) {
      const { text, keyPath } = this.props.xmlConfig
      const line = findLineByKey( text, keyPath )
      if( ! line ) return

      const scrollTop = this.editor.getTopForLineNumber(line)
      aniUC.from( this.editor.getScrollTop()).to( scrollTop - 100, {
        duration: 500,
        ease: 'out-quad',
        step: p => this.editor.setScrollTop(p),
        done: () => this.editor.setPosition({ lineNumber: line, column: 1 }),
      })
    }
  }
  onRef(editor) {
    this.editor = editor
  }
  render() {
    const { text, keyPath, cursor, name, size } = this.props.xmlConfig
    return (
      <ConfigBox width={[ 1 ]}>
        <EditorBox width={[ 1, 0.6 ]}>
          <MonacoEditor onRef={this.onRef} text={text}/>
        </EditorBox>
        <ToolBox width={[ 1, 0.4 ]}>
          <div>{`name: ${name}`}</div>
          <div>{`size: ${size} Byte`}</div>
          <div>{`keyPath: ${keyPath}`}</div>
          <Button>
            <div onClick={this.onClickDelete}>delete!!</div>
          </Button>
          <div style={{ height: 52 }}>
            <KeySelector
              xmlConfigArr={[ this.props.xmlConfig ]}
              keyPath={keyPath}
              onChange={this.onChangedKeyPath}
            />
          </div>
          <div>{cursor}</div>
        </ToolBox>
      </ConfigBox>
    )
  }
}

export default XmlConfig

