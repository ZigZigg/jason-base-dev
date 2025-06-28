'use client';

import { ResourceCollectionResponse } from "@/lib/interfaces/resource";
import cn from 'classnames';

type Props = {
  collections: ResourceCollectionResponse[];
  selectedCollectionIndex: number;
  onCollectionSelect: (collectionIndex: number) => void;
};

const Sidebar = ({ collections, selectedCollectionIndex, onCollectionSelect }: Props) => {
  console.log("🚀 ~ Sidebar ~ collections:", collections)
  return (
    <div className="p-4">
      <div className="flex flex-col gap-6">
        {collections.map((collection, collectionIndex) => (
          <div
            key={collection.id}
            onClick={() => onCollectionSelect(collectionIndex)}
            className={cn('cursor-pointer hover:bg-[#EAF0FC] px-[12px]', {
              'pl-3 border-l-4 border-[#FFC858]': collectionIndex === selectedCollectionIndex,
            })}
          >
            <p className="text-[#667085] text-[14px]">{collection.title_prefix}</p>
            <p className="text-[#475467] text-[18px] font-bold">{collection.title || collection.resource?.title || ''}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
