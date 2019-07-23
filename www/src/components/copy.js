/** @jsx jsx */
import { jsx } from "theme-ui"
import React, { useState } from "react"
import PropTypes from "prop-types"

import { ScreenReaderText } from "./feedback-widget/styled-elements"

const copyToClipboard = content => {
  const textarea = document.createElement(`textarea`)
  textarea.value = content
  textarea.setAttribute(`readonly`, true)
  textarea.setAttribute(`contenteditable`, true)
  textarea.style.position = `absolute`
  textarea.style.left = `-9999px`
  document.body.appendChild(textarea)
  textarea.select()
  const range = document.createRange()
  const sel = window.getSelection()
  sel.removeAllRanges()
  sel.addRange(range)
  textarea.setSelectionRange(0, textarea.value.length)
  document.execCommand(`copy`)
  document.body.removeChild(textarea)
}

const delay = duration => new Promise(resolve => setTimeout(resolve, duration))

function Copy({ className, content, duration, fileName, trim = false }) {
  const [copied, setCopied] = useState(false)

  const label = copied
    ? `${fileName ? fileName + ` ` : ``}copied to clipboard`
    : `${fileName ? fileName + `: ` : ``}copy code to clipboard`

  return (
    <button
      name={label}
      className={className}
      disabled={copied}
      sx={{
        backgroundColor: `transparent`,
        border: `none`,
        color: `grey.60`,
        cursor: `pointer`,
        fontSize: 2,
        fontFamily: `header`,
        lineHeight: `solid`,
        p: 2,
        transition: t =>
          `${t.transition.speed.default} ${t.transition.curve.default}`,
        "&[disabled]": {
          cursor: `not-allowed`,
        },
        ":not([disabled]):hover": {
          bg: `purple.60`,
          boxShadow: `raised`,
          color: `white`,
        },
        ":active": {
          boxShadow: `floating`,
        },
      }}
      onClick={async () => {
        copyToClipboard(trim ? content.trim() : content)

        setCopied(true)

        await delay(duration)

        setCopied(false)
      }}
    >
      {copied ? `Copied` : `Copy`}
      <ScreenReaderText aria-roledescription="status">{label}</ScreenReaderText>
    </button>
  )
}

Copy.propTypes = {
  content: PropTypes.string.isRequired,
  duration: PropTypes.number,
  trim: PropTypes.bool,
}

Copy.defaultProps = {
  duration: 5000,
  fileName: ``,
}

export default Copy
