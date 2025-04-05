import Image from 'next/image'
import React from 'react'


const InitialResult = () => {
  return (
    <div className='w-full flex flex-col items-center justify-center'>
    <div className='w-[350px] h-[350px] md:h-[600px] flex flex-col items-center justify-center'>
      <Image src="/assets/search/empty.svg" alt="empty-state" width={350} height={229} />
      <p className='text-[#667085] text-[16px] font-[500] mt-[24px]'>Start to lookup! Type something.</p>
    </div>
  </div>
  )
}

export default InitialResult