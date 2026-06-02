import React from "react";
import { SiSony, SiDell, SiLenovo, SiApple, SiSamsung } from "react-icons/si";
import SectionTitle from "../../ui/SectionTitle";
import { ui } from "../../../styles/theme";

const brands = [
  { name: "Sony", Icon: SiSony },
  { name: "Dell", Icon: SiDell },
  { name: "Lenovo", Icon: SiLenovo },
  { name: "Apple", Icon: SiApple },
  { name: "Samsung", Icon: SiSamsung },
];

const Sponsered = () => (
  <section className={`${ui.section} bg-gray-50`}>
    <div className={ui.container}>
      <SectionTitle title="Trusted brands" subtitle="We work with well-known partners." />
      <div className={`${ui.card} ${ui.cardPadding}`}>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {brands.map(({ name, Icon }) => (
            <div
              key={name}
              className="flex h-16 w-28 items-center justify-center rounded-3xl bg-white p-3 shadow-sm transition hover:shadow-md"
              aria-label={name}
            >
              <Icon className="h-10 w-auto text-slate-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Sponsered;
