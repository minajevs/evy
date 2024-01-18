# Choosing auth library

Implementing auth from the scratch is daunting. What library can we use to simplify that?

## `next-auth` / `auth.js`

De-facto standard choice for next.js applications.

Pros:

- A lot of guides and discussions around
- Good examples around (e.g. cal.com)

Cons:

- Poor documentation
- Limited credentials flow

## `lucia`

New kid on the block with great promises and good reputation. Bleeding edge projects considers it to be much better alternative to `next-auth`.

On the surface, has pretty much the same concepts and APIs as `next-auth`.

One of the reasons to switch to `lucia` would be better credentials support, however according to author, lucia v3 will "drop support for passwords": https://github.com/lucia-auth/lucia/discussions/1227
