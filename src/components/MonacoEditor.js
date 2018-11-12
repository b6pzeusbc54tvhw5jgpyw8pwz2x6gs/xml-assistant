import React from 'react'
import styled from 'styled-components'

import * as monaco from 'monaco-editor'

const Box = styled.div`
  height: 100%;
  width: 100%;
`

// https://microsoft.github.io/monaco-editor/playground.html

class MonacoEditor extends React.Component {
  constructor(props) {
    super(props)
    this.editorRef = React.createRef()
  }
  componentDidMount() {
    monaco.editor.defineTheme('myTheme', {
      base: 'vs',
      inherit: true,
      rules: [{ background: 'EDF9FA' }],
      colors: {
        'editor.foreground': '#000000',
        'editor.background': '#EDF9FA',
        'editorCursor.foreground': '#8B0000',
        'editor.lineHighlightBackground': '#0000FF20',
        'editorLineNumber.foreground': '#008800',
        'editor.selectionBackground': '#88000030',
        'editor.inactiveSelectionBackground': '#88000015',
      },
    })
    // monaco.editor.setTheme('myTheme')
    this.editor = monaco.editor.create( this.editorRef.current, {
      value: this.props.text,
      language: 'xml',
      theme: 'myTheme',
    })
    this.props.onRef(this.editor)
  }
  /*
  componentDidUpdate(prevProps, prevState) {
    if( prevProps.text !== this.props.text ) {
      this.editor.setValue(this.props.text)
    }
  }
  */
  render() {
    const { props } = this
    return (
      <Box ref={this.editorRef}/>
    )
  }
}

export default MonacoEditor
