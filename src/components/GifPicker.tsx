import React, { useRef } from "react";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { Grid } from "@giphy/react-components";
import type { IGif } from "@giphy/js-types";

interface GifPickerProps {
  onGifSelect: (gifUrl: string) => void;
  onClose: () => void;
}

const gf = new GiphyFetch(import.meta.env.VITE_GIPHY_API_KEY as string);

// Simple in-memory rate limiter
const RATE_LIMIT = 100; // per hour
let callCount = 0;
let lastReset = Date.now();

function canCallApi() {
  const now = Date.now();
  if (now - lastReset > 60 * 60 * 1000) {
    callCount = 0;
    lastReset = now;
  }
  return callCount < RATE_LIMIT;
}

export const GifPicker: React.FC<GifPickerProps> = ({ onGifSelect, onClose }) => {
  const errorRef = useRef<HTMLDivElement>(null);

  const fetchGifs = async (offset: number) => {
    if (!canCallApi()) {
      throw new Error("Giphy API rate limit reached. Try again later.");
    }
    callCount++;
    return gf.trending({ offset, limit: 9 });
  };

  // Attribution overlay for each GIF
  const overlay = ({ gif }: { gif: IGif }) => (
    <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 flex flex-col">
      {gif.user && (
        <span>
          {gif.user.display_name || gif.user.username}
          {gif.user.website_url && (
            <a href={gif.user.website_url} target="_blank" rel="noopener noreferrer" className="ml-1 underline">Website</a>
          )}
        </span>
      )}
      {gif.source && (
        <span>Source: <a href={gif.source} target="_blank" rel="noopener noreferrer" className="underline">{gif.source}</a></span>
      )}
    </div>
  );

  return (
    <div className="absolute bottom-12 right-2 z-20 bg-white rounded shadow-lg p-2 w-[320px]">
      <button
        className="mb-2 text-xs text-gray-500 hover:text-gray-800 float-right"
        onClick={onClose}
      >
        Close
      </button>
      <div className="mb-2 flex items-center gap-2">
        <img src="https://giphy.com/static/img/giphy_logo_square_social.png" alt="Giphy logo" className="w-6 h-6" />
        <span className="text-xs text-gray-500">Powered by Giphy</span>
      </div>
      <Grid
        width={300}
        columns={3}
        fetchGifs={fetchGifs}
        onGifClick={(gif, e) => {
          e.preventDefault();
          onGifSelect(gif.images.fixed_height.url);
          onClose();
        }}
        hideAttribution={false}
        noLink
        overlay={overlay}
      />
      <div ref={errorRef} className="text-xs text-red-500 mt-2" style={{ display: 'none' }} />
    </div>
  );
};
