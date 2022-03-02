const commutesPerYear = 260 * 2;
const litresPerKM = 10 / 100;
const gasLitreCost = 1.5;
const litreCostKM = gasLitreCost / litresPerKM;
const secondsPerDay = 60 * 60 * 24;

type DistanceProps = {
  leg: google.maps.DirectionsLeg;
};

export default function Distance({ leg }: DistanceProps) {
  if (!leg.distance || !leg.duration) return null;

  const days = Math.floor(
    (commutesPerYear * leg.duration.value) / secondsPerDay
  );
  const cost = Math.floor(
    (leg.duration.value / 1000) * litreCostKM * commutesPerYear
  );

  const costAccount = new Intl.NumberFormat().format(cost);
  

  return (
    <div>
      <p>
        This home is <span className='highlight'>{leg.distance.text}</span> from
        your office. That would take{' '}
        <span className='highlight'>{leg.duration.text}</span> each direction.
      </p>

      <p>
        That is <span className='highlight'>{days} days</span> in your car each
        year at a cost of <span className='highlight'>{costAccount}</span>
      </p>
    </div>
  );
}
