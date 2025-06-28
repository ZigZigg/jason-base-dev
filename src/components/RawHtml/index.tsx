import { HTMLAttributes, useMemo, JSX } from 'react';

type AllowedWrappers = 'div' | 'span' | 'a' | 'b' | 'p';

const DEFAULT_WRAPPER = 'div';

// Improved sanitization to handle more XSS attack vectors
const sanitize = (htmlString: string): string => {
  if (!htmlString) return '';
  
  return htmlString
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*/gim, '') // Remove script tags
    .replace(/on\w+="[^"]*"/g, '') // Remove inline event handlers
    .replace(/javascript:[^'"]*/g, ''); // Remove javascript: URLs
};

export interface IRawHtmlProps
  extends Omit<
    HTMLAttributes<HTMLElement>,
    'dangerouslySetInnerHTML' | 'children'
  > {
  readonly children?: string;
  readonly as?: AllowedWrappers;
}

export const RawHtml = ({
  children,
  as: Wrapper = DEFAULT_WRAPPER,
  ...props
}: IRawHtmlProps): JSX.Element => {
  const cleanHTML = useMemo(
    () => ({ __html: sanitize(children || '') }),
    [children]
  );

  return <Wrapper {...props} dangerouslySetInnerHTML={cleanHTML} />;
};
