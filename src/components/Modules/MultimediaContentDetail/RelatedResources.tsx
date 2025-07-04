import AssociatedResource from '@/features/mission_detail/components/AssociatedResource'
import { ExtendedResourceAsset } from '@/lib/interfaces/resource'
import React from 'react'

type Props = {
    associated_resources: ExtendedResourceAsset[]
}

const RelatedResources = (props: Props) => {
    const { associated_resources } = props;
  return (
    <div className='w-full px-[16px] xl:px-[0px]'>
    <div className='p-[16px] rounded-[12px] bg-[#fff] w-full border border-[#EAECF0] mt-[24px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.2)]'>
        <h3 className='text-[24px] font-bold text-[#101828]'>Related Resources</h3>
        <div className='w-full h-[1px] bg-[#eee] my-[16px]' />
        <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-1 gap-[24px]">
        {associated_resources?.map((associatedResource) => (
          <AssociatedResource
            key={associatedResource.id}
            associatedResource={associatedResource}
          />
        ))}
      </div>
    </div>

    </div>

  )
}

export default RelatedResources