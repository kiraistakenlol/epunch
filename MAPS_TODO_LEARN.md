# Maps & Address Handling Guide

## Problem Statement
We need to make addresses clickable in our punch card app that open the user's preferred maps application, showing the exact business location (not just a generic address search).

## Data Storage Approaches

### Option 1: Business Name + Address (RECOMMENDED)
```
shopName: "Anippe"
shopAddress: "Bucarelli 2460, Buenos Aires"
```
**Pros:** Simple, reliable, human-readable
**Cons:** None significant
**Usage:** Most common approach in production apps

### Option 2: Separate Display + URL Fields
```
shopAddress: "Bucarelli 2460, Buenos Aires"  // For display
shopMapsUrl: "https://maps.app.goo.gl/xyz"   // For linking
```
**Pros:** Precise control, exact business pages
**Cons:** More complex, requires two fields

### Option 3: Google Place ID
```
shopAddress: "Bucarelli 2460, Buenos Aires"
placeId: "ChIJ-2kq37K3vJURBv0aInWVBeI"
```
**Pros:** Most reliable, permanent identifiers
**Cons:** Complex to obtain, requires Google Places API

### Option 4: Plus Codes
```
shopAddress: "CGF6+V7 Buenos Aires, Cdad. Autónoma de Buenos Aires"
```
**Pros:** Works for locations without formal addresses
**Cons:** Points to coordinates, not business listings

## URL Schemes & Formats

### 1. Universal HTTPS (Safe but Limited)
```
https://maps.google.com/maps?q=Business+Name,+Address
```
**Behavior:**
- iPhone: Opens Safari, then "Open in Maps" option
- Android: May show app chooser

### 2. Maps Protocol (Better App Integration)
```
maps://maps.google.com/maps?q=Business+Name,+Address
```
**Behavior:**
- iPhone: Shows app chooser (Apple Maps, Google Maps, Waze, etc.)
- Android: Shows app chooser

### 3. Geo Protocol (RECOMMENDED)
```
geo:0,0?q=Business+Name,+Address
```
**Behavior:**
- Both platforms: Native app chooser dialog
- Most universal approach

### 4. Google-Specific Formats
```
// Generic search
https://maps.google.com/maps?q=Business+Name,+Address

// Place ID (if available)
https://maps.google.com/maps?place_id=ChIJ-2kq37K3vJURBv0aInWVBeI

// Coordinates
https://maps.google.com/maps?q=latitude,longitude
```

## Implementation Examples

### Basic Implementation
```javascript
const businessName = "Anippe";
const address = "Bucarelli 2460, Buenos Aires";
const mapsUrl = `geo:0,0?q=${encodeURIComponent(businessName + ', ' + address)}`;
```

### React Component
```jsx
{shopAddress && (
  <a 
    href={`geo:0,0?q=${encodeURIComponent(shopName + ', ' + shopAddress)}`}
    className={styles.addressText}
    target="_blank"
    rel="noopener noreferrer"
  >
    📍 {shopAddress}
  </a>
)}
```

### With Fallback
```javascript
const getMapsUrl = (shopName, shopAddress, shopMapsUrl) => {
  if (shopMapsUrl) {
    return shopMapsUrl; // Use provided URL
  }
  // Fallback to geo protocol
  return `geo:0,0?q=${encodeURIComponent(shopName + ', ' + shopAddress)}`;
};
```

## Platform-Specific Behaviors

### iOS
- `geo:` → Native app chooser
- `maps://` → App chooser (if Google Maps installed)
- `https://maps.google.com` → Safari, then "Open in Maps" option

### Android  
- `geo:` → App chooser for installed maps apps
- `https://maps.google.com` → May show app chooser depending on default browser settings

## Edge Cases & Special Formats

### Plus Codes (International)
```
// For locations without formal addresses
shopAddress: "CGF6+V7 Buenos Aires, Cdad. Autónoma de Buenos Aires"
mapsUrl: `geo:0,0?q=${encodeURIComponent(shopAddress)}`
```

### Coordinates
```
// When you have exact lat/lng
const lat = -34.123456;
const lng = -58.123456;
mapsUrl: `geo:${lat},${lng}?q=${encodeURIComponent(businessName)}`
```

## Best Practices

1. **Always URL encode** addresses and business names
2. **Use geo protocol** for best cross-platform app chooser experience
3. **Include business name** in the query for better search results
4. **Provide fallback** to basic Google Maps URL
5. **Test on both platforms** before deploying

## CSS Considerations
```css
.addressText {
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.2s ease;
  display: block;
  padding: 8px; /* Larger touch target for mobile */
}

.addressText:hover {
  opacity: 0.8;
}

.addressText:active {
  opacity: 0.6;
}
```

## Testing Checklist
- [ ] Test on iPhone with Apple Maps
- [ ] Test on iPhone with Google Maps installed
- [ ] Test on Android with Google Maps
- [ ] Test on Android with Waze installed
- [ ] Test with various address formats
- [ ] Test with international addresses
- [ ] Test with Plus Codes (if applicable)

## Common Pitfalls
1. **URL encoding**: Always encode special characters
2. **Plus signs**: Use `%2B` instead of `+` in URLs when needed
3. **Shortened URLs**: Google's `goo.gl` links may break over time
4. **Place IDs**: Complex to obtain, not always necessary
5. **Protocol handling**: Some browsers may not support `geo:` protocol

## Recommendation Summary
**For most use cases:** Store business name + address, use geo protocol for links. This provides the best user experience with the native app chooser dialog while keeping implementation simple and reliable. 