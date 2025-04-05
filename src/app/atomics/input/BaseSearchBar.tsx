import React from 'react'
import BaseInput from './BaseInput'
import Image from 'next/image'
import { InputProps } from 'antd'

const BaseSearchBar = (props: InputProps) => {
  return (
    <BaseInput {...props} className='h-[56px]! text-base!' prefix={<Image src="/assets/icon/search-icon.svg" alt="Search icon" width={16} height={16} />  } />
  )
}

export default BaseSearchBar