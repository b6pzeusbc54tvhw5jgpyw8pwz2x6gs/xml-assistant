import React from 'react'
import styled from 'styled-components'
import Dropzone from 'react-dropzone'

const DropzoneBox = styled.div`
  width: 100%;
  margin-top: 0.5em;
  & .dropzone {
    width: 100%;
    border-width: 2px;
    border-color: rgb(102, 102, 102);
    border-style: dashed;
    border-radius: 5px;
    box-sizing: border-box;
  & p {
    padding: 10px;
  }
`

class DropZone extends React.Component {
  constructor(props) {
    super(props)
    this.onDrop = this.onDrop.bind(this)
  }
  onDrop(files) {
    files.forEach( file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.props.addXmlConfig({ text: e.target.result })
      }
      reader.readAsText(file)
    })
  }

  render() {
    return (
      <DropzoneBox>
        <Dropzone className='dropzone' onDrop={this.onDrop}>
          <p>+ Drags & Drop your xml file!</p>
        </Dropzone>
      </DropzoneBox>
    )
  }
}

export default DropZone

