from math import radians, sin, cos, sqrt, atan2


def haversine_distance(lat1, lng1, lat2, lng2):
    """Returns distance in km between two lat/lng points."""
    R = 6371  # Earth radius in km
    dlat = radians(lat2 - lat1)
    dlng = radians(lng2 - lng1)
    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlng / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c


def calculate_cost_per_rider(driver_route, num_riders, cost_per_km=30):
    """
    Simple distance-based cost split.
    cost_per_km: adjust based on realistic fuel cost estimate (e.g., PKR per km).
    """
    distance_km = haversine_distance(
        driver_route.origin_lat, driver_route.origin_lng,
        driver_route.dest_lat, driver_route.dest_lng,
    )
    total_cost = distance_km * cost_per_km
    if num_riders == 0:
        return 0
    return round(total_cost / num_riders, 2)