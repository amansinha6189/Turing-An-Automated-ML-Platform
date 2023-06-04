import React, { useState } from 'react'
import { Alert } from 'react-bootstrap'

function Message({ variant, children}) {
  const [show, setShow] = useState(true);
  return (
    <Alert variant={variant} onClose={() => setShow(false)} dismissible>
        {children}
    </Alert>
  )
}

export default Message
