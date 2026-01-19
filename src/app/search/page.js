import { Suspense } from "react";
import SearchClient from "./SearchClient";

export default function SearchPage() {
  return (
    <Suspense fallback={<p style={{ padding: 40 }}>Loading search…</p>}>
      <SearchClient />
    </Suspense>
  );
}
