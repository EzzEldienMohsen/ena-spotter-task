# WebSocket Implementation - Live Flight Price Updates

## Overview

This document describes the WebSocket implementation for real-time flight price updates in the Flight Search Engine application.

## Features

✅ **Real-time Price Updates** - Automatically detects and displays price changes
✅ **Adaptive Polling** - Smart polling intervals (30s → 15s when active → 60s when stable)
✅ **Auto-reconnection** - Socket.io handles connection drops gracefully
✅ **Rate Limiting** - Conservative 8 req/sec to stay within Amadeus limits
✅ **Multi-client Support** - Multiple users can monitor same search efficiently
✅ **Live Update Badge** - Visual indicator showing connection status and update count
✅ **Price Change Badges** - Animated indicators for price increases/decreases

## Architecture

### Technology Stack

- **Socket.io** (v4.8.3) - WebSocket library with auto-reconnection
- **Custom Next.js Server** - Required for WebSocket support
- **Adaptive Polling** - Dynamic intervals based on activity
- **Rate Limiting** - Protects against API throttling

### Data Flow

```
Client (Results Page)
  ↓
useFlightWebSocket hook
  ↓
Socket.io connection (ws://localhost:3000/api/socket)
  ↓
Server: Connection handler
  ↓
FlightMonitoringService starts polling
  ↓
Polls Amadeus API every 30-60 seconds
  ↓
Detects changes (price/new flights/removed flights)
  ↓
Emits updates to Socket.io room (searchId)
  ↓
Client receives updates
  ↓
Dispatches Redux actions (updateFlightPrice, addNewFlight, removeFlight)
  ↓
UI updates with live badges and animations
```

## File Structure

### Backend (Server-side)

```
src/server/
├── index.ts                                    # Custom Next.js server with Socket.io
├── websocket/
│   ├── socket-server.ts                        # Socket.io initialization
│   ├── handlers/
│   │   └── connection.handler.ts               # WebSocket event handlers
│   ├── services/
│   │   ├── flight-monitoring.service.ts        # Core monitoring logic
│   │   └── rate-limiter.service.ts            # API rate limiting
│   └── types/
│       └── websocket.types.ts                  # Server-side types
```

### Frontend (Client-side)

```
src/
├── lib/
│   ├── hooks/
│   │   └── useFlightWebSocket.ts               # WebSocket connection hook
│   ├── utils/
│   │   └── search-helpers.ts                   # Search ID generation
│   └── redux/
│       └── slices/
│           └── flightsSlice.ts                 # Updated with WS actions
├── components/
│   └── molecules/
│       ├── LiveUpdateBadge.tsx                 # Live status indicator
│       └── FlightCard.tsx                      # Updated with price badges
├── types/
│   ├── websocket.ts                            # Shared types
│   └── flight.ts                               # Extended with price history
└── app/
    └── [locale]/
        └── results/
            └── page.tsx                        # Integrated WebSocket
```

## Usage

### Starting the Development Server

```bash
npm run dev
```

This starts the custom server with WebSocket support at `http://localhost:3000`

### How It Works

1. **User searches for flights** - Standard search flow
2. **Results page loads** - Generates stable `searchId` from search params
3. **WebSocket connects** - `useFlightWebSocket` hook establishes connection
4. **Monitoring starts** - Server begins polling Amadeus API every 30s
5. **Changes detected** - Price changes, new flights, or removed flights
6. **Updates pushed** - Server emits updates to all clients monitoring this search
7. **UI updates** - Redux actions update state, UI shows animations

### Search ID Generation

Each unique search gets a stable ID based on parameters:

```typescript
const searchId = generateSearchId({
  origin: 'JFK',
  destination: 'LAX',
  departureDate: '2024-03-15',
  returnDate: '2024-03-22',
  passengers: { adults: 2, children: 0, infants: 0 },
  cabinClass: 'ECONOMY'
});
// Returns: "search_1234567890"
```

Same parameters = same ID = shared monitoring session

### Adaptive Polling Intervals

The monitoring service adjusts polling frequency:

- **Initial**: 30 seconds (first poll)
- **Active**: 15 seconds (when changes detected)
- **Stable**: 60 seconds (no changes for extended period)

This balances real-time feel with API rate limits.

## WebSocket Events

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `start_monitoring` | `MonitorSearchPayload` | Start monitoring a search |
| `stop_monitoring` | `searchId: string` | Stop monitoring a search |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `monitoring_started` | `MonitoringStatus` | Confirmation monitoring started |
| `monitoring_stopped` | `searchId: string` | Confirmation monitoring stopped |
| `flight_updates` | `FlightUpdate[]` | Array of flight changes |
| `monitoring_error` | `{ message, searchId }` | Error during monitoring |

## Redux Actions

New actions added to `flightsSlice`:

```typescript
// Update existing flight price
updateFlightPrice({ flightId, price, priceChange: 'up' | 'down' })

// Add newly discovered flight
addNewFlight(flight)

// Remove flight no longer available
removeFlight(flightId)
```

## Rate Limiting

**Amadeus Test API Limits:**
- 10 requests/second (official)
- 20,000 requests/month

**Our Conservative Approach:**
- 8 requests/second (20% buffer)
- Max ~18,000 requests/month

**Calculations:**
- 30s polling = 2 req/min = 86,400 req/month per search
- With adaptive intervals, average ~60s = 43,200 req/month
- Can support ~400 concurrent active searches

## UI Components

### LiveUpdateBadge

Shows connection status in top-right corner:

- **Green badge** - Connected and monitoring
- **Yellow badge** - Reconnecting
- **Red badge** - Error state
- **Update counter** - Shows number of updates received

### FlightCard Price Badges

Animated badges on flight cards:

- **↑ Price Increased** - Red badge, bounce animation
- **↓ Price Dropped** - Green badge, bounce animation
- **New** - Blue badge, pulse animation

## Configuration Files

### nodemon.json

Watches server files and auto-restarts on changes:

```json
{
  "watch": ["src/server"],
  "ext": "ts",
  "exec": "ts-node --project tsconfig.server.json src/server/index.ts"
}
```

### tsconfig.server.json

TypeScript config for server compilation:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "module": "commonjs",
    "outDir": "dist"
  },
  "include": ["src/server/**/*"]
}
```

### package.json Scripts

```json
{
  "dev": "nodemon",
  "build": "next build",
  "start": "cross-env NODE_ENV=production ts-node --project tsconfig.server.json src/server/index.ts"
}
```

## Testing

### Manual Testing Steps

1. Start server: `npm run dev`
2. Search for flights (e.g., JFK → LAX)
3. Navigate to results page
4. Verify "Live" badge appears (green, pulsing)
5. Check browser console for WebSocket logs
6. Wait 30 seconds for first poll
7. Open Redux DevTools to watch for actions
8. Open Network tab → WS to see WebSocket connection
9. Open second tab with same search
10. Verify both tabs receive updates
11. Close one tab, verify monitoring continues
12. Close all tabs, verify monitoring stops (check server logs)

### Server Logs

Monitor server console for:

```
[WebSocket] Socket.io server initialized at /api/socket
[WebSocket] Client connected: <socket-id>
[Monitor] Started monitoring search search_1234567890
[Monitor] Polling flights for search search_1234567890...
[Monitor] Detected 3 changes for search search_1234567890
[Monitor] Client left search search_1234567890. Remaining clients: 0
[Monitor] Stopped monitoring search search_1234567890
```

## Deployment

### Important: Cannot Deploy to Vercel

Vercel's serverless architecture doesn't support long-lived WebSocket connections.

### Recommended Platforms

1. **Railway** - Easiest deployment
   - Connect GitHub repo
   - Auto-deploys on push
   - Supports WebSockets out of the box

2. **DigitalOcean App Platform**
   - Affordable
   - Simple setup
   - Good for Node.js apps

3. **AWS EC2**
   - Full control
   - Requires more setup
   - Use PM2 for process management

4. **Render**
   - Free tier available
   - Easy deployment

### Environment Variables

Required for production:

```env
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_API_URL=https://your-domain.com
AMADEUS_API_KEY=your_api_key
AMADEUS_API_SECRET=your_api_secret
```

## Future Enhancements

- [ ] **Price History Graph** - Visualize price trends over time
- [ ] **Price Alerts** - Email/push notifications for price drops
- [ ] **Redis Integration** - Scale to multiple server instances
- [ ] **Database Storage** - Persist price history long-term
- [ ] **Admin Dashboard** - Monitor active searches and API usage
- [ ] **Compression** - Gzip WebSocket messages
- [ ] **Authentication** - Restrict monitoring to logged-in users
- [ ] **Flight Status** - Integrate real-time delay/cancellation data

## Troubleshooting

### WebSocket not connecting

1. Check server is running: `npm run dev`
2. Verify Socket.io path: `ws://localhost:3000/api/socket`
3. Check browser console for errors
4. Ensure no firewall blocking WebSocket connections

### No updates received

1. Check server logs for polling activity
2. Verify Amadeus API credentials are valid
3. Check rate limiter isn't blocking requests
4. Ensure searchId is being generated correctly

### High API usage

1. Check number of active monitors: Server logs show client count
2. Verify adaptive polling is working (intervals should increase when stable)
3. Consider increasing stable interval to 90s or 120s

## Performance Considerations

- **Memory usage**: Each active monitor stores last flight snapshot
- **Network**: WebSocket connection adds ~100-500 bytes/update
- **CPU**: Polling and diff algorithm runs every 30-60s per search
- **API costs**: Monitor API usage to stay within free tier limits

## License

This implementation is part of the Flight Search Engine project.
