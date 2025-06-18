import Terminal from "@/components/terminal/Terminal"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "terminal",
};

export default function TermianlPage() {
  return (
    <div className="lg:-mx-40">
      <Terminal />
    </div>
  )
}