from math import radians, sin, cos, sqrt, atan2
from datetime import time, datetime


def haversine_distance(lat1, lng1, lat2, lng2):
    """
    Returns the great-circle distance in kilometers between two points
    on the Earth specified by latitude/longitude in decimal degrees.
    """
    R = 6371.0  # Earth radius in kilometers
    dlat = radians(lat2 - lat1)
    dlng = radians(lng2 - lng1)
    a = (sin(dlat / 2) ** 2 +
         cos(radians(lat1)) * cos(radians(lat2)) * sin(dlng / 2) ** 2)
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return round(R * c, 3)


def time_difference_in_minutes(t1: time, t2: time) -> int:
    """
    Calculate the absolute difference in minutes between two time objects.
    Handles wraparound across midnight if necessary.
    """
    m1 = t1.hour * 60 + t1.minute
    m2 = t2.hour * 60 + t2.minute
    diff = abs(m1 - m2)
    return min(diff, 1440 - diff)


def compute_route_overlap(driver_route, rider_route, max_distance_km=10.0, max_time_diff_mins=60):
    """
    Compute comprehensive overlap score and metrics between a driver route and a rider route.

    Scoring dimensions:
      1. Origin (Pickup) proximity: Haversine distance between driver & rider origins.
      2. Destination (Dropoff) proximity: Haversine distance between driver & rider destinations.
      3. Detour efficiency: Extra distance required by driver to pick up and drop off rider.
      4. Departure time compatibility: Difference in departure times.
      5. Shared days of week schedule overlap.

    Returns a dictionary with the composite score (0.0 to 1.0) and breakdown details.
    """
    # 1. Schedule compatibility
    driver_days = set(driver_route.days_of_week or [])
    rider_days = set(rider_route.days_of_week or [])
    shared_days = list(driver_days.intersection(rider_days))

    if not shared_days:
        return {
            'overlap_score': 0.0,
            'pickup_distance_km': None,
            'dropoff_distance_km': None,
            'detour_distance_km': None,
            'time_difference_minutes': None,
            'shared_days': [],
            'is_compatible': False,
            'reason': 'No matching days of the week',
        }

    # Day overlap ratio
    min_days_len = max(1, min(len(driver_days), len(rider_days)))
    s_days = len(shared_days) / min_days_len

    # 2. Time compatibility
    time_diff = time_difference_in_minutes(driver_route.departure_time, rider_route.departure_time)
    s_time = max(0.0, 1.0 - (time_diff / max_time_diff_mins))

    # 3. Spatial Distances
    d_origin = haversine_distance(
        driver_route.origin_lat, driver_route.origin_lng,
        rider_route.origin_lat, rider_route.origin_lng
    )
    d_dest = haversine_distance(
        driver_route.dest_lat, driver_route.dest_lng,
        rider_route.dest_lat, rider_route.dest_lng
    )

    d_driver_direct = haversine_distance(
        driver_route.origin_lat, driver_route.origin_lng,
        driver_route.dest_lat, driver_route.dest_lng
    )
    d_rider_direct = haversine_distance(
        rider_route.origin_lat, rider_route.origin_lng,
        rider_route.dest_lat, rider_route.dest_lng
    )

    # Detour calculation: Driver Origin -> Rider Origin -> Rider Dest -> Driver Dest
    d_with_rider = (
        d_origin +
        d_rider_direct +
        d_dest
    )
    d_detour = max(0.0, round(d_with_rider - d_driver_direct, 3))

    # Spatial scores (5km tolerance standard)
    s_origin = max(0.0, 1.0 - (d_origin / max_distance_km))
    s_dest = max(0.0, 1.0 - (d_dest / max_distance_km))

    # Detour score (penalize detours that add >50% extra distance)
    baseline_dist = max(1.0, d_driver_direct)
    detour_ratio = d_detour / baseline_dist
    s_detour = max(0.0, 1.0 - (detour_ratio / 0.5))

    # Composite weighted overlap score
    raw_score = (
        (0.35 * s_origin) +
        (0.35 * s_dest) +
        (0.15 * s_detour) +
        (0.15 * s_time)
    ) * s_days

    overlap_score = round(max(0.0, min(1.0, raw_score)), 2)

    return {
        'overlap_score': overlap_score,
        'pickup_distance_km': d_origin,
        'dropoff_distance_km': d_dest,
        'driver_direct_km': d_driver_direct,
        'rider_direct_km': d_rider_direct,
        'detour_distance_km': d_detour,
        'time_difference_minutes': time_diff,
        'shared_days': shared_days,
        'is_compatible': overlap_score >= 0.3,
    }
