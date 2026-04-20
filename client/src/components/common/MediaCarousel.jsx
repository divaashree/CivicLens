import { useState } from "react";

export default function MediaCarousel({ media }) {
  const [current, setCurrent] = useState(0);
  const [mediaTypes, setMediaTypes] = useState({});

  // Show placeholder if no media
  if (!media || media.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-t-xl flex items-center justify-center border-b border-gray-200">
        <span className="text-gray-500 text-sm font-medium">No media attached</span>
      </div>
    );
  }

  const item = media[current];
  const imgSrc = `data:image/jpeg;base64,${item}`;
  const videoSrc = `data:video/mp4;base64,${item}`;
  const isVideo = mediaTypes[current] === "video";

  const handleImageError = () => {
    // Image failed to load, this might be a video
    setMediaTypes((prev) => ({ ...prev, [current]: "video" }));
  };

  const handleVideoError = () => {
    // Video failed to load, this might be an image
    setMediaTypes((prev) => ({ ...prev, [current]: "image" }));
  };

  const goToPrevious = () => {
    setCurrent((prev) => (prev - 1 + media.length) % media.length);
  };

  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % media.length);
  };

  return (
    <div className="relative w-full h-64 bg-black rounded-t-xl overflow-hidden">
      {/* Media Display - Show video or image based on which loads */}
      {isVideo ? (
        <video
          src={videoSrc}
          controls
          onError={handleVideoError}
          className="w-full h-full object-cover"
        />
      ) : (
        <img
          src={imgSrc}
          alt="complaint media"
          onError={handleImageError}
          className="w-full h-full object-cover"
        />
      )}

      {/* Counter Badge */}
      {media.length > 1 && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs font-semibold px-3 py-1 rounded-full">
          {current + 1} / {media.length}
        </div>
      )}

      {/* Navigation Buttons */}
      {media.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full transition"
            title="Previous"
          >
            ◀
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full transition"
            title="Next"
          >
            ▶
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {media.length > 1 && (
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex gap-1">
          {media.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-2 h-2 rounded-full cursor-pointer transition ${
                index === current ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
