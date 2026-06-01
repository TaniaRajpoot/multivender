import React from "react";
import SectionTitle from "../../ui/SectionTitle";
import { ui } from "../../../styles/theme";

const brands = [
  { name: "Sony", src: "https://logos-world.net/wp-content/uploads/2020/04/Sony-Logo.png" },
  { name: "Dell", src: "https://logos-world.net/wp-content/uploads/2020/08/Dell-Logo.png" },
  { name: "Lenovo", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Lenovo_logo_2015.svg/2560px-Lenovo_logo_2015.svg.png" },
  { name: "Apple", src: "https://www.vectorlogo.zone/logos/apple/apple-ar21.png" },
  { name: "Samsung", src: "https://logos-world.net/wp-content/uploads/2020/04/Samsung-Logo.png" },
];

const Sponsered = () => (
  <section className={`${ui.section} bg-gray-50`}>
    <div className={ui.container}>
      <SectionTitle title="Trusted brands" subtitle="We work with well-known partners." />
      <div className={`${ui.card} ${ui.cardPadding}`}>
        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16 opacity-70">
          {brands.map((b) => (
            <img key={b.name} src={b.src} alt={b.name} className="h-8 md:h-10 object-contain grayscale hover:grayscale-0 transition" />
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Sponsered;
