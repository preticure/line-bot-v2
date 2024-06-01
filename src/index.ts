import { Hono } from 'hono'
import { handleWebhook, scheduledHandler } from '../src/handlers/index'

const app = new Hono()

app.get('/', (c) => c.text('Hello Hono!'))
app.post('/webhook', handleWebhook)

const scheduled: ExportedHandlerScheduledHandler = async (event, env, ctx) => {
  ctx.waitUntil(scheduledHandler())
}

// Cloudflare Workersのエントリーポイント
export default {
  fetch: app.fetch,
  scheduled,
}
