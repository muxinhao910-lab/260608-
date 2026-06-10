import { WebBuilderHome } from "@/components/builder-v3/WebBuilderHome";

type HomePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: HomePageProps) {
  const params = (await searchParams) || {};
  const initialOpen = params.builder === "1";

  return (
    <main className="min-h-screen bg-[#050505] text-white" data-review-page="home">
      <WebBuilderHome initialOpen={initialOpen} />
    </main>
  );
}
