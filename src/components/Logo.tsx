import { Link } from "react-router-dom";

export default function Logo({ pequeno = false }: { pequeno?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2 font-extrabold text-pipo-700">
      <span className={`grid place-items-center rounded-2xl bg-pipo-500 text-white ${pequeno ? "h-8 w-8 text-lg" : "h-10 w-10 text-xl"}`}>
        P
      </span>
      <span className={pequeno ? "text-lg" : "text-xl"}>
        Pipo <span className="text-sol">Education</span>
      </span>
    </Link>
  );
}
