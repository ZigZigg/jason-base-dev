'use client';

import { ResourceCollectionResponse } from "@/app/lib/interfaces/resource";
import AssociatedResource from "./AssociatedResource";

type Props = {
  collection: ResourceCollectionResponse | undefined;
};

const CollectionDetail = ({ collection }: Props) => {
  return (
    <div className="px-10 py-6 bg-white rounded-lg h-full">
      <div className="flex flex-col gap-6">
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
