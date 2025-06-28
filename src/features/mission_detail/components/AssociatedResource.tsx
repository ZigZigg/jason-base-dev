'use client';

import { ExtendedResourceAsset } from "@/app/lib/interfaces/resource";
import Image from "next/image";
import { useMemo } from "react";
import { getAssociatedResourceThumbnail } from "../selectors";

type Props = {
  associatedResource: ExtendedResourceAsset;
};

const AssociatedResource = ({ associatedResource }: Props) => {
  const thumbnail = useMemo(() => getAssociatedResourceThumbnail(associatedResource), [associatedResource]);

  return (
    <div
        key={associatedResource.id}
        className="flex flex-col lg:flex-row gap-[30px]"
      >
        <div className="w-1/2 lg:w-1/4 relative">
          <Image
            src={thumbnail}
            alt={associatedResource.title}
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto"
          /></div>
        <div className="w-full lg:w-3/4">
          <p className="font-medium text-lg">{associatedResource.title}</p>
          <p className="font-medium text-[#DE1514]">{associatedResource.type.name}</p>
          <p className="mt-2 text-base text-[#667085]">{associatedResource.description}</p>
        </div>
      </div>
  );
};

export default AssociatedResource;
