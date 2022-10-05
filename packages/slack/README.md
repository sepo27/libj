## Usage

### `SlackWebhook`

```typescript
interface SlackWebhoook {
  constructor(hookUrl: string)

  send(message: Object): Promise<void>
}
```
