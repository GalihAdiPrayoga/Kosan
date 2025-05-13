import React, { useState } from "react";

const ImageWithFallback = ({ src, alt, ...props }) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return null;
  }

  return (
    <img src={src} alt={alt} onError={() => setHasError(true)} {...props} />
  );
};

export default ImageWithFallback;
