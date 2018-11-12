import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Flex, Box, Button } from 'rebass'
import dynamic from 'next/dynamic'
import aniUC from 'animation-uc'

import KeySelector from './KeySelector'
import { findLineByKey, findByLine, findByKey } from '../core'
import Text from './Text'

const MonacoEditor = dynamic(import('./MonacoEditor'), { ssr: false })

const ConfigBox = styled(Flex)`
  box-sizing: border-box;
  height: 340px;
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
  padding: 0.5em;
  background-color: rgba(218,11,200,0.4);
  display: flex;
  flex-direction: column;
`

const BottomBase = styled(Box)`
  box-sizing: border-box;
  background-color: rgba(218,11,200,0.4);
  margin-top: auto;
`

const DeleteButton = styled(Button)`
  width: 100%;
  height: 45px;
  margin-bottom: 0.2em;
  box-sizing: border-box;
  background-color: red;
`

const KeySelectorBox = styled(Box)`
  width: 100%;
  height: 45px;
  margin-bottom: 0.2em;
  box-sizing: border-box;
`

class XmlConfig extends React.Component {
  constructor(props) {
    super(props)
    this.onClickDelete = this.onClickDelete.bind(this)
    this.onChangedKeyPath = this.onChangedKeyPath.bind(this)
    this.onCreateEditor = this.onCreateEditor.bind(this)
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
  onCreateEditor(editor) {
    const { lineNumber } = this.props.xmlConfig
    editor.setPosition({ lineNumber, column: 1 })
    const scrollTop = editor.getTopForLineNumber(lineNumber)
    editor.setScrollTop(scrollTop-100)

    editor.onDidChangeCursorPosition( ({ position }) => {
      const { lineNumber } = position
      if( lineNumber === this.props.xmlConfig.lineNumber ) return

      const { text } = this.props.xmlConfig
      let newXmlConfig = { ...this.props.xmlConfig, lineNumber }

      // 이경우 select 가 릴리스 되어야함
      const currentKeyPath = findByLine(text, lineNumber)
      if( this.props.xmlConfig.keyPath !== currentKeyPath ) {
        newXmlConfig = { ...newXmlConfig, keyPath: '' }
      }

      this.props.setXmlConfig( newXmlConfig.id, newXmlConfig )
    })

    this.editor = editor
  }
  render() {
    const { id, text, keyPath, lineNumber, name, size } = this.props.xmlConfig
    const currentKeyPath = findByLine(text, lineNumber)
    const value = findByKey([text], currentKeyPath) || 'NOT_FOUND'

    return (
      <ConfigBox width={[ 1 ]}>
        <EditorBox width={[ 1, 0.6 ]}>
          <MonacoEditor onCreateEditor={this.onCreateEditor} text={text}/>
        </EditorBox>
        <ToolBox width={[ 1, 0.4 ]}>
          <Text label='name' value={name}/>
          <Text label='size' value={size + ' Byte'}/>
          <BottomBase>
            <DeleteButton>
              <div onClick={this.onClickDelete}>delete!!</div>
            </DeleteButton>
            <KeySelectorBox>
              <KeySelector
                id={id}
                xmlConfigArr={[ this.props.xmlConfig ]}
                keyPath={keyPath}
                onChange={this.onChangedKeyPath}
              />
            </KeySelectorBox>
            <Text label='current line' value={lineNumber}/>
            <Text
              label='current keyPath:value'
              value={`${currentKeyPath}: ${value}`}
              style={{ color: value === 'NOT_FOUND' ? 'red' : 'green' }}
            />
          </BottomBase>
        </ToolBox>
      </ConfigBox>
    )
  }
}

XmlConfig.propTypes = {
  xmlConfig: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    keyPath: PropTypes.string.isRequired,
    lineNumber: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
  }),
  deleteXmlConfig: PropTypes.func.isRequired,
  setXmlConfig: PropTypes.func.isRequired,
}

export default XmlConfig

