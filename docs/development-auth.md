Development auth workarounds

When testing authentication locally you may hit Supabase email send rate limits (error code: `over_email_send_rate_limit`, HTTP 429) because confirmation emails are sent repeatedly during automated/manual tests.

Fastest ways to continue testing locally:

- Preferred (safe): Use the provided dev-only admin API to create confirmed users without sending emails.
  - Endpoint: `POST /api/dev/create-user`
  - Request JSON: `{ "email": "you@example.com", "password": "secret", "displayName": "Dev Tester" }`
  - This endpoint is only active when `NODE_ENV === 'development'` and uses `SUPABASE_SERVICE_ROLE_KEY` to create the user server-side with `email_confirm: true` to bypass confirmation email sends.

- Dashboard approach (if you prefer configuration):
  - Go to the Supabase Dashboard → Authentication → Settings.
  - Check Mail settings and SMTP provider — if no SMTP is configured, Supabase may still attempt to send but will be rate-limited by the project.
  - Optionally disable email confirmations for the project (Auth settings). NOTE: this affects production behavior — do this only on disposable/dev projects.

- Alternative server-side approach: create users with the service role using the Admin API from a server route or script. Example (server-side):

```js
import { createClient } from '@supabase/supabase-js';
const admin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
await admin.auth.admin.createUser({
  email: 'you@example.com',
  password: 'secret',
  email_confirm: true,
  user_metadata: { display_name: 'Dev Tester' }
});
```

Notes on Supabase project checks:
- Project status: If `auth/v1/health` responds, the project is reachable (active). HTTP 429 indicates the service is running but rejecting requests due to rate limits.
- Auth provider Email: the `over_email_send_rate_limit` response indicates email sending is enabled/attempted; confirm SMTP provider under Dashboard → Settings → Email.
- Rate limits: If you repeatedly trigger signups, the project will hit email send rate limits; use the dev API or change dashboard settings to avoid blocking tests.

Security: The dev API uses the service role key — ensure it is only available in development and not exposed to clients.
