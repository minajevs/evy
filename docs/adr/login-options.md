# Login options

## Problem

Users need to easily and securely login into application. What options to login should we provide?

### OAuth

Clearly most users prefer OAuth login options, e.g. GMail, Facebook, Apple, e.t.c. Those providers are also easiest to implement.

### Credentials (Login + Password)

`next-auth` discourages credentials login flow. It is also recommended to not provide such an option. Reasons are:

1. It is very hard to implement right. There are hundreds of potential security issues:

- Rate limiting signup + signin
- Protecting and hashing password
- Filtering spam and bots
- Forgot password flow

2. It is less convenient for the user. It is faster for a user to login with GMail, than to setup a secure password and verify email

3. OAuth providers spent a lot of time to make authentication right

One of the "Pros" for the credentials is that user can setup completely disconnected and stand-alone account without leaking much of personal info. This can also be provided by "magic-link" authentication.

### Magic Link

Seems like there are no cons for us to provide this option.
