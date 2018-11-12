import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box } from 'rebass'

const TextBox = styled(Box)`
  box-sizing: border-box;
  background-color: rgba(18,211,100,0.3);
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  margin-bottom: 0.2em;
  padding-top: 0.2em;
`
const Label = styled(Box)`
  color: rgba(0, 0, 0, 0.54);
  padding: 0;
  font-size: 0.85rem;
  line-height: 1;
`
const Value = styled(Box)`
  font: inherit;
  color: currentColor;
  width: 100%;
  border: 0;
  margin: 0;
  padding: 2px 0 7px 0;
  display: block;
  min-width: 0;
  box-sizing: content-box;
  background: none;
  -webkit-tap-highlight-color: transparent;
  font-size: 1.1em;
`

const Text = (props) => {
  return (
    <TextBox>
      <Label>{props.label}</Label>
      <Value style={props.style}>{props.value}</Value>
    </TextBox>
  )
}

Text.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  style: PropTypes.object,
}

export default Text

