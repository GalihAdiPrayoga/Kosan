import React, { useState } from "react";

const ImageWithFallback = ({ src, fallbackSrc, alt, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src);

  const onError = () => {
    setImgSrc(fallbackSrc);
  };

  return <img src={imgSrc} alt={alt} onError={onError} {...props} />;
};

export default ImageWithFallback;
