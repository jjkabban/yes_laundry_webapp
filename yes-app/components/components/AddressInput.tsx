"use client";
type Props = {
  onChangeValue: (value: string) => void;
};

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

export default function AddressInput({ onChangeValue }: Props) {
  const {
    ready,
    value,
    setValue,
    suggestions: { data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (description: string) => {
    setValue(description, false);
    clearSuggestions();

    onChangeValue(description);
  };

  return (
    <div className="relative w-full">
      <input
        value={value}
        disabled={!ready}
        onChange={(e) => {
          setValue(e.target.value);
          onChangeValue(e.target.value);
        }}
        placeholder="Enter your address"
        className="w-full border p-3 rounded-md"
      />

      {data.length > 0 && (
        <ul className="absolute bg-white w-full shadow-md z-50">
          {data.map((item) => (
            <li
              key={item.place_id}
              onClick={() => handleSelect(item.description)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {item.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
