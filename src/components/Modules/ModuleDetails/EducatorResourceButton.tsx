'use client';
import BaseButton from '@/atomics/button/BaseButton';
import { ResourceCollection } from '@/lib/modules/subjects/data';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import React from 'react';

type Props = {
  resource?: ResourceCollection;
};

const EducatorResourceButton = (props: Props) => {
  const { resource } = props;
  const router = useRouter();
  const goToEducatorResources = () => {
    const educatorResourceId = resource?.educator_resource?.id;
    router.push(`/resource-detail/${educatorResourceId}`);
  };

  return (
    <div className="flex flex-row items-center gap-2">
      <BaseButton
        onClick={goToEducatorResources}
        className="!px-[16px] !py-[8px] !shadow-none !gap-[0px] !rounded-[8px] !bg-[#0F72F31A] flex flex-row !gap-[12px] !items-center"
      >
        <Image src="/assets/icon/download.svg" alt="arrow-right" width={20} height={20} />
        <div className="flex flex-col !items-start">
          <span className="text-[#667085] text-[12px] font-[400]">Check out this</span>
          <span className="text-[#475467] text-[16px] font-[700]">Educator Resources</span>
        </div>
      </BaseButton>
    </div>
  );
};

export default EducatorResourceButton;
