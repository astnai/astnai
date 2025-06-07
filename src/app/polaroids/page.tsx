import { Metadata } from "next";
import { PolaroidGallery } from "@/components/polaroids/PolaroidGallery";
import { polaroids } from "@/data/polaroids";

export const metadata: Metadata = {
  title: "polaroids",
  description: "Polaroids photos of Agustín Arias's life",
};

export default function PolaroidsPage() {
  return (
    <>
      <PolaroidGallery polaroids={polaroids} />
      <div className="py-12" />
    </>
  );
}
