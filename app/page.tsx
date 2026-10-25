import { PageShell } from "@/components/PageShell";

/*
  Server entry: statically exported. All rendering lives in <PageShell>
  (client) so the language toggle can re-render every string (issue #3).
*/
export default function Home() {
  return <PageShell />;
}
