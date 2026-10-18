import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApiQuery } from '../../api/useApiQuery';
import { Empty, ErrorState, SkeletonGrid } from '../common/States';
import miniTruckImage from '../../assets/truck-mini.jpg';
import mediumTruckImage from '../../assets/truck-14ft.jpg';
import largeTruckImage from '../../assets/truck-19ft.jpg';
import containerTruckImage from '../../assets/truck-container.jpg';
import './FleetSection.css';

const vehicleDetails = {
  mini: {
    name: 'Mini Truck',
    description: 'Suitable for few items or 1 RK / small shifting',
    image: miniTruckImage,
  },
  medium: {
    name: '14 ft Truck',
    description: 'Suitable for 1–2 BHK household items',
    image: mediumTruckImage,
  },
  large: {
    name: '19 ft Truck',
    description: 'Suitable for 3–4 BHK household items',
    image: largeTruckImage,
  },
  other: {
    name: 'Closed Container',
    description: 'Best for long distance and high value items',
    image: containerTruckImage,
  },
};

function getVehicleDetails(vehicle) {
  const details = vehicleDetails[vehicle.category] || vehicleDetails.medium;
  const isDemo = vehicle.isDemo || /\(demo\)/i.test(vehicle.name || '');
  return {
    ...details,
    name: isDemo ? details.name : (vehicle.name || details.name),
    description: vehicle.description || details.description,
  };
}

export default function FleetSection() {
  const query = useApiQuery(['fleet'], '/api/v1/fleet');
  if (query.isPending) return <SkeletonGrid count={4} columns={4} />;
  if (query.isError) return <ErrorState message="Fleet details could not be loaded." onRetry={query.refetch} />;
  const items = query.data || [];

  return (
    <section className="fleet-section">
      <div className="fleet-container">
        <header className="home-section-heading">
          <h2>Our Fleet</h2>
          <p>We have a range of well-maintained vehicles to suit your moving needs.</p>
        </header>
        {items.length ? (
          <div className="fleet-cards">
            {items.slice(0, 4).map((vehicle) => {
              const details = getVehicleDetails(vehicle);
              return (
                <article className="fleet-card" key={vehicle._id}>
                  <img
                    className="fleet-card-image"
                    src={vehicle.image || details.image}
                    alt={details.name}
                    loading="lazy"
                  />
                  <div className="fleet-card-content">
                    <h3>{details.name}</h3>
                    <p>{details.description}</p>
                    <Link className="fleet-card-link" to="/fleet">
                      View Details <ArrowRight aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <Empty label="Fleet details will be updated soon." />
        )}
      </div>
    </section>
  );
}
