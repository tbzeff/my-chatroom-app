import React from "react";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { Grid } from "@giphy/react-components";

interface GifPickerProps {
  onGifSelect: (gifUrl: string) => void;
  onClose: () => void;
}

const gf = new GiphyFetch("dc6zaTOxFJmzC"); // Public beta key, replace with your own for production

export const GifPicker: React.FC<GifPickerProps> = ({ onGifSelect, onClose }) => {
  return (
    <div className="absolute bottom-12 right-2 z-20 bg-white rounded shadow-lg p-2">
      <button
        className="mb-2 text-xs text-gray-500 hover:text-gray-800 float-right"
        onClick={onClose}
      >
        Close
      </button>
      <Grid
        width={300}
        columns={3}
        fetchGifs={(offset) => gf.trending({ offset, limit: 9 })}
        onGifClick={(gif, e) => {
          e.preventDefault();
          onGifSelect(gif.images.fixed_height.url);
          onClose();
        }}
        hideAttribution
      />
    </div>
  );
};
