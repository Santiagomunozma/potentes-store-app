import { Image, ImageProps } from "@mantine/core";
import { useEffect, useState } from "react";
import fallback from "../assets/images/brand/logo.png";

type ProductImageProps = ImageProps & {
  src?: string | null;
  alt?: string;
};

const ProductImage = ({ src, alt, ...rest }: ProductImageProps) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <Image
      {...rest}
      src={!src || failed ? fallback : src}
      alt={alt || "Producto"}
      onError={() => setFailed(true)}
    />
  );
};

export { ProductImage };
