'use client';

import { Carousel } from "antd";
import Image from 'next/image';

import VideoPlayer from '@/components/VideoPlayer';

import { RawHtml } from "@/components/RawHtml";
import { TVideoResource } from '../../selectors';
import styles from './BannerMulti.module.scss';

type Props = {
  videoResource: TVideoResource;
  banner: string;
  description?: string;
  htmlDescription?: string;
};

const BannerMulti = ({ videoResource, banner, description, htmlDescription }: Props) => {
  return (
    <div className="w-full flex flex-col md:flex-row gap-[20px] md:gap-[30px]">
      <div className="w-full md:w-2/3">
        <div className="w-full rounded-[16px] flex flex-col overflow-hidden">
          <div className="w-full aspect-[343/88] md:aspect-[1160/300] pb-16">
            <Carousel arrows className={styles.carouselContainer}>
              <div className="h-full">
                <Image
                  src={banner}
                  alt={''}
                  width={1160}
                  height={300}
                  className="w-full h-full object-cover aspect-[343/88] md:aspect-[1160/300]"
                />
              </div>
              <div>
                <VideoPlayer
                  file_uri={videoResource.file_uri}
                  thumbnail_file_uri={videoResource.thumbnail_file_uri}
                />
              </div>
            </Carousel>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/3 p-[0px] md:p-[20px] text-[#667085] text-[16px]">
        { htmlDescription ? <RawHtml>{htmlDescription}</RawHtml> : description }
      </div>
    </div>
  );
};

export default BannerMulti;
