export default function About() {
  return (
    <main className="min-h-screen bg-[#07111f] px-6 py-24 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
          About
        </p>

        <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-7xl">
          Rita Neupane
        </h1>

        <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-400">
          I am interested in the intersection of biology, computation,
          mathematics, and public health.
        </p>
      </div>
    </main>
  );
}