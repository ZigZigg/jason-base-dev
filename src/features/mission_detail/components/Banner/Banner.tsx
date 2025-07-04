'use client';

import { TVideoResource } from "../../selectors";
import BannerImage from "./BannerImage";
import BannerMulti from "./BannerMulti";
import BannerVideo from "./BannerVideo";

type Props = {
  videoResource?: TVideoResource;
  banner?: string;
  description?: string;
  htmlDescription?: string;
};

const Banner = ({ videoResource, banner, description, htmlDescription }: Props) => {
  if (banner && videoResource) {
    return <BannerMulti videoResource={videoResource} banner={banner} description={description} htmlDescription={htmlDescription} />;
  }

  if (banner) {
    return <BannerImage banner={banner} description={description} htmlDescription={htmlDescription} />;
  }

  if (videoResource) {
    return <BannerVideo videoResource={videoResource} description={description} htmlDescription={htmlDescription} />;
  }

  return null;
};

export default Banner;
