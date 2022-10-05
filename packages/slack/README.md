## Usage

### `SlackWebhook`

```typescript
interface SlackWebhook {
  constructor(hookUrl: string)

  send(message: Object): Promise<void>
}
```
