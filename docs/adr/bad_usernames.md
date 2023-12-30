# How to handle public usernames in the system?

## Problem

User may freely select username, which will be available under `example.com/username`. There are multiple problems which may appear by using this approach:

- Path collision: `blog`, `jobs`, etc.
- Encoding problems: `ᴮᴵᴳᴮᴵᴿᴰ`, `🥸` see [Spotify wrap-up]('https://labs.spotify.com/2013/06/18/creative-usernames/')
- Deliberate phishing: `example.com/support/change_password.html`
- Technical collision: `example.com/robots.txt`, `example.com/.well-known`
- [RFC 2142 collision]('https://www.ietf.org/rfc/rfc2142.txt'): `abuse`, `admin`, etc.

Additionally, username rules should **not** be too restrictive to prevent too many users from signing up. Additionally, some usernames might appear even _cool_, e.g. `example.com/admin`

## Solution

### 1. Username / other slug format

Restrict slugs to a specific format:
**Can only consist of alphanumeric characters, have non-repeating hyphen, underscore or dot and only start with alphanumeric characters**

All usernames/slugs are **case-insensitive**

Minimum length of a username: **5 characters**, possibly allow less in the future for premium users

This format will protect from encoding problems, but will protect from collisions and phishing

Note: Format inspired by GitHub username format, with an addition of dot (`.`). GitHub does not allow dots, because usernames can be hostnames - `example.github.io`

### 2. Check usernames against blocklist

Blocklist to contain most risky usernames, leaving out possibly _cool_ and mostly _harmless_ usernames, such as `admin`, `php`, etc.

### 3. Favor site paths over user-registered paths

If there's a collision between username and existing path, always favor existing path, e.g. `example.com/blog` leads to blog page, even if there's a user with username `blog`

## For the future

### Sanitize and verify usernames

Routinely check registered usernames to immediately react on phishing attempts

## Other options considered, but not implemented

### Mandatory username prefix

Restrict usernames to start with mandatory prefix, e.g. `@username` or `/u/username` (Twitter / Reddit style).

This options might be too restrictive for the user, because `example.com/user` looks shorter and cooler than `example.com/u/user`, especially considering users will have collections and items within collection, which will lead to long URL `example.com/u/user/collection/item`

## Links

- [Bad usernames]('https://github.com/flurdy/bad_usernames')
- [Hostnames and usernames to reserve]('https://ldpreload.com/blog/names-to-reserve')
