import type { Metadata } from 'next'

export default function Head() {
  return (
    <>
      {/* Performance Hints */}
      <link rel="preload" as="style" href="/globals.css" />
      <link rel="preload" as="image" href="/PreviewSeo/tingnecticon.png" />
      
      {/* Favicon */}
      <link rel="icon" href="/PreviewSeo/tingnecticon.png" />
      
      {/* Resource Hints */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      
      {/* Canonical */}
      <link rel="canonical" href="https://bgk.tingnect.com" />
    </>
  )
}