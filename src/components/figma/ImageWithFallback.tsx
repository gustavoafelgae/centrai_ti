import React, { useState } from "react";
import { Image, ImageStyle, Platform, StyleSheet, View } from "react-native";

const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";

type Props = {
  src?: string;
  alt?: string;
  className?: string;
  style?: ImageStyle | any;
  width?: number | string;
  height?: number | string;
} & React.ImgHTMLAttributes<HTMLImageElement>;

export function ImageWithFallback(props: Props) {
  const [didError, setDidError] = useState(false);

  const handleError = () => {
    setDidError(true);
  };

  const { src, alt, style, className, width, height } = props;

  if (Platform.OS === "web") {
    // On web render regular img with the original behavior
    return didError ? (
      <div
        className={`inline-block bg-gray-100 text-center align-middle ${className ?? ""}`}
        style={style as any}
      >
        <div className="flex items-center justify-center w-full h-full">
          <img
            src={ERROR_IMG_SRC}
            alt={"Error loading image"}
            data-original-url={src}
            style={{ maxWidth: width ?? "100%", maxHeight: height ?? "100%" }}
          />
        </div>
      </div>
    ) : (
      // eslint-disable-next-line jsx-a11y/alt-text
      <img
        src={src}
        alt={alt}
        className={className}
        style={style as any}
        onError={handleError}
      />
    );
  }

  // Native platforms (iOS/Android) use react-native Image
  return (
    <View style={[styles.container, style as any]}>
      <Image
        source={{ uri: didError ? ERROR_IMG_SRC : (src ?? undefined) }}
        accessibilityLabel={alt}
        onError={handleError}
        style={styles.image as any}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  } as any,
  image: {
    width: "100%",
    height: "100%",
  } as ImageStyle,
});
