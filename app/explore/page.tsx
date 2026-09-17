import CreatorCard from "@/components/CreatorCard";
import PageHeader from "@/components/ui/PageHeader";
import { SAMPLE_CREATORS } from "@/lib/mock-data";

export const metadata = {
  title: "Explore creators — PING",
};

export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <PageHeader
        eyebrow="Sample data — preview only"
        title="Explore creators"
        description="Every listed creator has a coin with a transparent, on-chain fee split. Verified creators have claimed their coin with a bio code."
      />

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SAMPLE_CREATORS.map((creator) => (
          <CreatorCard key={creator.handle} creator={creator} />
        ))}
      </div>
    </div>
  );
}
