import { Atelier } from "@/components/home/atelier";
import { DeliveryPromise } from "@/components/home/delivery-promise";
import { FeaturedCollection } from "@/components/home/featured-collection";
import { Hero } from "@/components/home/hero";
import { Marquee } from "@/components/home/marquee";
import { Occasions } from "@/components/home/occasions";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <FeaturedCollection />
      <Atelier />
      <Occasions />
      <DeliveryPromise />
    </>
  );
}
