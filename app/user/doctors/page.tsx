import DoctorsList from "./DoctorsList";

export default function DoctorsPage({
  searchParams,
}: {
  searchParams: { speciality?: string; location?: string };
}) {
  // ✅ only speciality is mandatory
  if (!searchParams.speciality) {
    return (
      <p className="mt-24 text-center text-slate-500 text-lg">
        Please choose a specialty to continue
      </p>
    );
  }

  return (
    <DoctorsList
      speciality={searchParams.speciality}
      location={searchParams.location} // optional
    />
  );
}
