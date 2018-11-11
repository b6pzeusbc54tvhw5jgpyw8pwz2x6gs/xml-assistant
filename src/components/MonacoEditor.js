import React from 'react'
import styled from 'styled-components'

import * as monaco from 'monaco-editor'

const Box = styled.div`
  height: 100%;
  width: 100%;
`

class MonacoEditor extends React.Component {
  constructor(props) {
    super(props)
    this.monacoRef = React.createRef()
  }
  componentDidMount() {
    monaco.editor.create( this.monacoRef.current, {
      value: this.props.text,
      language: 'xml',
      theme: 'vs-light',
    })
  }
  render() {
    const { props } = this
    return (
      <Box ref={this.monacoRef}/>
    )
  }
}

export default MonacoEditor
