import { useLoader } from "../../utils/Store";

export function Loader() {
  const { isLoading } = useLoader();
  return !isLoading ? null : <Loading />;
}

export function Loading() {
  return (
    <div className="position-absolute top-50 start-50 translate-middle full-black">
      <div className="position-absolute top-50 start-50 translate-middle">
        <h2>🌀 Loading...</h2>
      </div>
    </div>
  );
}
