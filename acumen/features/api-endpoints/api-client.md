# API Client Implementation

## Core Endpoints

### Agent Management
```typescript
POST /agent
Headers: { 'X-Secret-Key': string }
Body: { provider: string, model: string }
```

### Configuration
```typescript
POST /configs/providers
Headers: { 'X-Secret-Key': string }
Body: { providers: string[] }

POST /configs/store
DELETE /configs/delete
```

### AI Interaction
```typescript
POST /ask
Headers: { 'X-Secret-Key': string }
Body: { prompt: string }

POST /reply (SSE)
Headers: { 'X-Secret-Key': string }
Body: ChatRequest
```

## Implementation Requirements

### Authentication
- Secret key from electron app config
- Include in all API requests
- Error handling for auth failures

### SSE Handling
- Server-sent events for streaming
- Proper event parsing
- Error and completion handling

### TypeScript Types
```typescript
interface ApiConfig {
  baseUrl: string;
  secretKey: string;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
}
```

## Usage Example
```typescript
// Create API client
const api = new ApiClient({
  baseUrl: getApiUrl(),
  secretKey: getSecretKey()
});

// Make authenticated request
const response = await api.post('/agent', {
  provider: 'google',
  model: 'gemini-pro'
});
```
