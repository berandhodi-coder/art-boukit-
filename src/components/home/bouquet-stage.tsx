"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode } from "react";
import { BouquetPoster } from "@/components/home/bouquet-poster";

function StageLoader() {
  return (
    <div
      role="status"
      className="absolute inset-0 flex items-center justify-center"
    >
      <span className="sr-only">Chargement du bouquet en trois dimensions</span>
      <span
        aria-hidden="true"
        className="h-10 w-10 animate-spin rounded-full border border-gold/30 border-t-gold"
      />
    </div>
  );
}

const BouquetExperience = dynamic(
  () => import("@/components/three/bouquet-experience"),
  { ssr: false, loading: () => <StageLoader /> },
);

class StageErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? <BouquetPoster /> : this.props.children;
  }
}

export function BouquetStage() {
  return (
    <figure className="stage-width relative mx-auto animate-fade [animation-delay:250ms]">
      <div className="relative aspect-[4/5]">
        <div
          aria-hidden="true"
          className="absolute inset-0 translate-x-3 translate-y-3 rounded-t-full border border-gold/70 sm:translate-x-4 sm:translate-y-4"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-t-full bg-gradient-to-b from-rose/60 to-champagne"
        />
        <div className="absolute -inset-x-[9%] -top-[5%] -bottom-[9%]">
          <StageErrorBoundary>
            <BouquetExperience />
          </StageErrorBoundary>
        </div>
      </div>
      <figcaption className="mt-9 flex items-center justify-between gap-4 text-[0.625rem] tracking-[0.26em] text-ink/55 uppercase">
        <span>Bouquet en trois dimensions</span>
        <span aria-hidden="true" className="h-px flex-1 bg-burgundy/15" />
        <span>360°</span>
      </figcaption>
    </figure>
  );
}
