import React from 'react'
import Select from 'react-select';

export default function ProDescList({ childobj, isLoading, childRef, childOptions, childMenuIsOpen, HandleChildChange, setChildMenuIsOpen }) {

  return (
    <Select
      value={{ value: childobj.Description, label: childobj.Description }}
      isClearable 
      isLoading={isLoading} 
      ref={childRef} 
      options={childOptions} 
      menuIsOpen={childMenuIsOpen} 
      onChange={HandleChildChange} 
      onBlur={() => setChildMenuIsOpen(false)} 
      onFocus={() => setChildMenuIsOpen(true)} />
  )
}
