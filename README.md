# SSOStrategy

The SSO strategy is used to authenticate users against a SSO account. It extends the OAuth2Strategy.

## Supported runtimes

| Runtime    | Has Support |
| ---------- | ----------- |
| Node.js    | ✅          |
| Cloudflare | ✅          |

## Usage

### Create an OAuth application

Follow the steps on [the SSO documentation](https://github.com/willin/sso) to create a new application and get a client ID and secret.

### Create the strategy instance

```ts
import { SSOStrategy } from 'remix-auth-sso';

let ssoStrategy = new SSOStrategy(
  {
    clientID: 'YOUR_CLIENT_ID',
    clientSecret: 'YOUR_CLIENT_SECRET',
    callbackURL: 'https://example.com/auth/sso/callback'
  },
  async ({ accessToken, extraParams, profile }) => {
    // Get the user data from your DB or API using the tokens and profile
    return profile;
  }
);

authenticator.use(ssoStrategy);
```

### Setup your routes

```tsx
// app/routes/login.tsx
export default function Login() {
  return (
    <Form action='/auth/sso' method='post'>
      <button>Login with SSO</button>
    </Form>
  );
}
```

```tsx
// app/routes/auth.sso.tsx
import type { ActionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { authenticator } from '~/auth.server';

export async function loader() {
  return redirect('/login');
}

export async function action({ request }: ActionArgs) {
  return authenticator.authenticate('sso', request);
}
```

```tsx
// app/routes/auth.sso.callback.tsx
import type { LoaderArgs } from '@remix-run/node';
import { authenticator } from '~/auth.server';

export async function loader({ request }: LoaderArgs) {
  return authenticator.authenticate('sso', request, {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
  });
}
```
