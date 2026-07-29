import OutletCard from './OutletCard';

export default function OutletList({ outlets }) {
  return (
    <div className="space-y-3">
      {outlets.map((outlet) => (
        <OutletCard key={outlet.id} outlet={outlet} />
      ))}
    </div>
  );
}
