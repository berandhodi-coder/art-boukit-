import { DeliveryPromise } from "@/components/home/delivery-promise";
import { FeaturedCollection } from "@/components/home/featured-collection";
import { Hero } from "@/components/home/hero";
import { Occasions } from "@/components/home/occasions";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedCollection />
      <Occasions />
      <DeliveryPromise />
    </>
  );
}
