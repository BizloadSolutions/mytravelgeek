import Image from "next/image";

const TravelSuggestionSparkIcon = ({
  height,
  width,
  theme,
}: {
  height: number;
  width: number;
  theme: "dark" | "light";
}) => {
  return (
    <Image
      src={
        theme === "dark"
          ? "/images/logo/icon-coloured.svg"
          : "/images/logo/icon-white.svg"
      }
      alt="logo"
      width={width}
      height={height}
      className="h-full w-full object-contain"
      style={{ width: width, height: height }}
    />
  );
};

export default TravelSuggestionSparkIcon;
