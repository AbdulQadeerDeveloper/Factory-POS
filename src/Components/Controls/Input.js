import React from 'react'
import { Field, ErrorMessage } from 'formik'
import TextError from './TextError'

function Input (props) {
  const { label, name, ...rest } = props
  return (
    <div className='form-control'>
      <label htmlFor={name}>{label}</label>
      <Field id={name} name={name} {...rest} autoComplete="off" style={{borderRadius: "2px", textAlign: "center", color: "#036"}} />
      <ErrorMessage component={TextError} name={name} />
    </div>
  )
}

export default Input
