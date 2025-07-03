'use client';

import Image, { ImageProps } from 'next/image';
import { useEffect, useState } from 'react';

type Props = Omit<ImageProps, 'onError'> & {
  fallbackUri: string | null;
};

const SafeImage = ({ src, alt, fallbackUri, ...imageProps }: Props) => {
  const [error, setError] = useState(false);

  useEffect(() => {
      setError(false);
  }, [src]);

  return <Image
    src={error && fallbackUri ? fallbackUri : src}
    alt={alt}
    onError={() => setError(true)}
    {...imageProps}
  />

};

export default SafeImage;
