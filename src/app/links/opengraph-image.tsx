import RootImage, {
  alt as rootAlt,
  size as rootSize,
  contentType as rootContentType,
} from '@/app/opengraph-image';

export const alt = rootAlt;
export const size = rootSize;
export const contentType = rootContentType;
export const revalidate = 86400;

export default RootImage;
