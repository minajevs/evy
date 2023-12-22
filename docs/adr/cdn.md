# Choosing CDN for storing images

Big part of EVY is actually sharing and viewing images. Need to choose CDN and Image Optimization provider to deliver best image viewing experience

## Cloudflare

**Used currently**

Cheapest solution. Has 2 solutions:

### Cloudflare CDN

Pure CDN with caching and a lot regions.

Pros:

- Very cheap
  Cons:
- No image optimization

### Cloudflare Images

Complete Images CDN pipeline: storage, caching, distribution, optimization.

Pros:

- Cheap
- Convenient to use - has "Direct Creator Upload" API
- Easy to setup variants, image protection
  Cons:
- Not possible to retrieve original image - important feature

## Bunny

**Worth to consider**

A bit more pricey than Cloudflare, but still cheaper than competitors.

### Bunny CDN

Pure CDN. Has option for Streaming videos.

### Bunny Optimizer

Separate Image Optimizer. Can work standalone from CDN, or compose into a pipeline.