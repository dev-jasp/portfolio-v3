import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /*
      Next 16 treats `qualities` as an allowlist and ships `[75]` — any other
      value on an <Image> is rejected. The work-card media are UI screenshots
      whose fine text and 1px chart rules smear at 75; 90 is the cost of
      keeping them legible.
    */
    qualities: [75, 90],
  },
};

export default nextConfig;
