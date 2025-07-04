'use client';

import { TVideoResource } from "../../selectors";
import BannerImage from "./BannerImage";
import BannerMulti from "./BannerMulti";
import BannerVideo from "./BannerVideo";

type Props = {
  videoResource?: TVideoResource;
  banner?: string;
  description?: string;
};

const Banner = ({ videoResource, banner, description }: Props) => {
  if (banner && videoResource) {
    return <BannerMulti videoResource={videoResource} banner={banner} description={description} />;
  }

  if (banner) {
    return <BannerImage banner={banner} description={description} />;
  }

  if (videoResource) {
    return <BannerVideo videoResource={videoResource} description={description} />;
  }

  return null;
};

export default Banner;
