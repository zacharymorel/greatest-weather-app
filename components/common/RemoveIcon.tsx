import { IGooglePlacesPrediction } from '@/types/client';

export default function RemoveIcon({
  onClick,
  prediction,
}: {
  prediction: IGooglePlacesPrediction;
  onClick: Function;
}): JSX.Element {
  return (
    <svg
      onClick={(e) => {
        onClick(prediction.placeId);
      }}
      className="absolute right-0 top-2 remove-prediction"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="4" y1="4" x2="20" y2="20" stroke="white" strokeWidth="2" />
      <line x1="20" y1="4" x2="4" y2="20" stroke="white" strokeWidth="2" />
    </svg>
  );
}
