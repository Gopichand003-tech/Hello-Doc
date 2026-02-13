import Link from "next/link";

async function getHospitals(specialty: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/hospital/search?specialty=${specialty}`,
    { cache: "no-store" }
  );
  return res.json();
}

export default async function HospitalsPage({
  params,
}: {
  params: { specialty: string };
}) {
  const hospitals = await getHospitals(params.specialty);

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <h1 className="text-4xl font-bold mb-10 capitalize">
        Hospitals for {params.specialty}
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {hospitals.map((h: any) => (
          <div key={h._id} className="bg-white rounded-2xl p-6 shadow">
            <h3 className="font-semibold text-lg">{h.name}</h3>
            <p className="text-sm text-slate-500">{h.location}</p>

            <Link
              href={`/hospital/${h._id}?specialty=${params.specialty}`}
              className="inline-block mt-4 text-emerald-600 font-medium"
            >
              View Doctors →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
