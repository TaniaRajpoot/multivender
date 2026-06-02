import React from "react";
import SectionTitle from "../../ui/SectionTitle";
import { ui } from "../../../styles/theme";

const brands = [
  { name: "Sony", src: "https://cdn.worldvectorlogo.com/logos/sony.svg" },
  { name: "Dell", src: "https://cdn.worldvectorlogo.com/logos/dell.svg" },
  { name: "Lenovo", src: "https://cdn.worldvectorlogo.com/logos/lenovo.svg" },
  { name: "Apple", src: "https://cdn.worldvectorlogo.com/logos/apple.svg" },
  { name: "Samsung", src: "https://cdn.worldvectorlogo.com/logos/samsung.svg" },
];

const Sponsered = () => (
  <section className={`${ui.section} bg-gray-50`}>
    <div className={ui.container}>
      <SectionTitle title="Trusted brands" subtitle="We work with well-known partners." />
      <div className={`${ui.card} ${ui.cardPadding}`}>
        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
          {brands.map((b) => (
            <img
              key={b.name}
              src={b.src}
              alt={b.name}
              className="h-10 md:h-12 object-contain grayscale hover:grayscale-0 transition"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/logo.png"; }}
            />
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Sponsered;
