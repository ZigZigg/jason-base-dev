'use client';

import { ResourceCollectionResponse } from "@/lib/interfaces/resource";
import { useMemo } from "react";
import AssociatedResource from "./AssociatedResource";

type Props = {
  collection: ResourceCollectionResponse | undefined;
};

const CollectionDetail = ({ collection }: Props) => {
  const resources = useMemo(() => {
    return collection?.associated_resources?.filter((resource => resource.id !== collection.resource?.id)) || [];
  }, [collection]);

  return (
    <div className="px-[16px] py-[16px] md:px-[40px] md:py-[24px] bg-white rounded-lg h-full">
      <div className="flex flex-col gap-[24px]">
        {resources.map((associatedResource) => (
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
