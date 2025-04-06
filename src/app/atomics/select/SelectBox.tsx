'use client';
import { Popover } from 'antd';
import Image from 'next/image';
import React, { useEffect, useRef, useState, startTransition, useCallback, useMemo } from 'react';
import BaseSearchBar from '../input/BaseSearchBar';
import { useOrientation } from '@/app/providers/OrientationProvider';

const mockData = [
  { title: 'Option 1', value: 'option1' },
  { title: 'Option 2', value: 'option2' },
  { title: 'Option 3', value: 'option3' },
  { title: 'Option 4', value: 'option4' },
  { title: 'Option 5', value: 'option5' },
  { title: 'Option 4', value: 'option4' },
  { title: 'Option 5', value: 'option5' },
  { title: 'Option 4', value: 'option4' },
  { title: 'Option 5', value: 'option5' },
  { title: 'Option 4', value: 'option4' },
  { title: 'Option 5', value: 'option5' },
  { title: 'Option 4', value: 'option4' },
  { title: 'Option 5', value: 'option5' },
  { title: 'Option 4', value: 'option4' },
  { title: 'Option 5', value: 'option5' },
];

type Props = {
  placeholder: string;
  options?: { title: string; value: string }[];
  onChange?: (value: string) => void;
  value?: string;
  isModalOpen?: boolean;
};

interface OptionsProps {
  data: { title: string; value: string }[];
  setSelectedValue: (value: string) => void;
}

const OptionsComponent = (props: OptionsProps) => {
  const { data, setSelectedValue } = props;
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  useEffect(() => {
    startTransition(() => {
      setFilteredData(
        data.filter((item) => item.title.toLowerCase().includes(searchKeyword.toLowerCase()))
      );
    });
  }, [searchKeyword, data]);

  return (
    <div className="flex flex-col py-[12px] px-[8px]">
      <BaseSearchBar value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} />
      <div className="flex flex-col h-[200px] overflow-y-auto">
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <div
              key={index}
              className="py-[6px] px-[16px] hover:bg-[#2867DC33] cursor-pointer"
              onClick={() => {
                setSelectedValue(item.value);
                setSearchKeyword('');
              }}
            >
              <span className="text-[#475467] font-[400] text-[14px]">{item.title}</span>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center py-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-[#667085] text-sm font-medium">No data found</p>
              <p className="text-[#94A3B8] text-xs mt-1">Try a different search term</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SelectBox = (props: Props) => {
  const { placeholder, options = mockData, onChange, value: externalValue } = props;

  const selectBoxRef = useRef<HTMLDivElement>(null);
  const [popoverWidth, setPopoverWidth] = useState(0);
  const [selectedValue, setSelectedValue] = useState(externalValue || '');
  const [openSelectModal, setOpenSelectModal] = useState(false);
  const orientation = useOrientation();


  const handleChangedValue = useCallback(
    (value: string) => {
      setOpenSelectModal(false);
      setSelectedValue(value);
      onChange?.(value);
    },
    [onChange]
  );

  // Update internal state when external value changes
  useEffect(() => {
    if (externalValue !== undefined && externalValue !== selectedValue) {
      setSelectedValue(externalValue);
    }
  }, [externalValue]);

  const label = useMemo(() => {
    return selectedValue
      ? options.find((value) => value.value === selectedValue)?.title
      : placeholder;
  }, [selectedValue, options, placeholder]);

  useEffect(() => {
    if (selectBoxRef.current) {
      setPopoverWidth(selectBoxRef.current.offsetWidth);
    }
  }, [orientation]);

  useEffect(() => {

    setOpenSelectModal(false);
  }, [orientation]);

  return (
    <Popover
      styles={{
        root: {
          width: popoverWidth,
        },
        body: {
          backgroundColor: '#fff',
          padding: '0px',
        },
      }}
      trigger="click"
      placement="bottom"
      content={<OptionsComponent data={options} setSelectedValue={handleChangedValue} />}
      arrow={false}
      open={openSelectModal}
      onOpenChange={(visible) => {
        setOpenSelectModal(visible);
      }}
    >
      <div
        id="select-box"
        ref={selectBoxRef}
        className="flex flex-row items-center justify-between bg-[#F5F5F2] rounded-[8px] py-[16px] px-[14px] cursor-pointer"
      >
        <span
          className={`${
            selectedValue ? 'text-[#182230]' : 'text-[#98A2B3]'
          } font-[400] text-[16px] truncate`}
        >
          {label}
        </span>
        <Image
          className="rotate-180"
          src="/assets/icon/up-icon.svg"
          alt="Arrow Down"
          width={12}
          height={6}
        />
      </div>
    </Popover>
  );
};

export default SelectBox;
