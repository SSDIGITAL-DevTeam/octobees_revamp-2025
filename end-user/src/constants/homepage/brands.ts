import AssetBikeChoice from "@/assets/services/webp/our-brand-partner/bike-choice.webp";
import AssetIsun from "@/assets/services/webp/our-brand-partner/isun.png";
import AssetHiger from "@/assets/homepage/webp/asset-higer.webp";
import AssetCarChoice from "@/assets/services/webp/our-brand-partner/car-choice.webp";
import AssetSuma from "@/assets/homepage/webp/asset-suma.webp";
import AssetWinphuket from "@/assets/homepage/webp/asset-winphuket.webp";
import AssetMotorCheckup from "@/assets/homepage/webp/asset-motorcheckup.webp";

export type Brand = {
  name: string;
  logo: string;
};

export const brands = [
  {
    name: "Bike Choice",
    logo: AssetBikeChoice.src,
  },
  {
    name: "Isun",
    logo: AssetIsun.src,
  },
  {
    name: "Suma",
    logo: AssetSuma.src,
  },
  {
    name: "Higer",
    logo: AssetHiger.src,
  },
  {
    name: "Car Choice",
    logo: AssetCarChoice.src,
  },
  {
    name: "Winphuket",
    logo: AssetWinphuket.src,
  },
  {
    name: "Motor Checkup",
    logo: AssetMotorCheckup.src,
  },
];
