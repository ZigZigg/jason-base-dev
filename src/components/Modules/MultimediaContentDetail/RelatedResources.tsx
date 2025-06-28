import AssociatedResource from '@/features/mission_detail/components/AssociatedResource'
import { ExtendedResourceAsset } from '@/lib/interfaces/resource'
import React from 'react'

type Props = {
    associated_resources: ExtendedResourceAsset[]
}

const RelatedResources = (props: Props) => {
    const { associated_resources } = props;
  return (
    <div className='p-[16px] rounded-[12px] bg-[#fff] w-full border border-[#EAECF0]'>
        <h3>Related Resources</h3>
        <div className='w-full h-[1px] bg-[#eee] my-[16px]' />
        <div className="flex flex-col gap-[24px]">
        {associated_resources?.map((associatedResource) => (
          <AssociatedResource
            key={associatedResource.id}
            associatedResource={associatedResource}
          />
        ))}
      </div>
    </div>
  )
}

export default RelatedResources