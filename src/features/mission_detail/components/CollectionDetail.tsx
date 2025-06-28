'use client';

import { ResourceCollectionResponse } from "@/lib/interfaces/resource";
import AssociatedResource from "./AssociatedResource";

type Props = {
  collection: ResourceCollectionResponse | undefined;
};

const CollectionDetail = ({ collection }: Props) => {
  return (
    <div className="px-[16px] py-[16px] md:px-[40px] md:py-[24px] bg-white rounded-lg h-full">
      <div className="flex flex-col gap-[24px]">
        {collection?.associated_resources?.map((associatedResource) => (
          <AssociatedResource
            key={associatedResource.id}
            associatedResource={associatedResource}
          />
        ))}
      </div>
    </div>
  );
};

export default CollectionDetail;
