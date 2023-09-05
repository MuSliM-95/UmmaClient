function getVisibleBounds(map) {
    const bounds  = map.getBounds()
    return {
      topLeft: bounds[0],
      bottomRight: bounds[1],
    }
  }
  export function filterAddressesByVisibleBounds(map, addresses) {
    const visibleBounds = getVisibleBounds(map);
     return addresses.filter(address => {
      return (
        address.location[0] >= visibleBounds.topLeft[0] &&
        address.location[0] <= visibleBounds.bottomRight[0] &&
        address.location[1] >= visibleBounds.topLeft[1] &&
        address.location[1] <= visibleBounds.bottomRight[1]
      )
     })
  }