import Link from "next/link";
import { cn } from "@/lib/utils";
import logoImg from "../public/images/tripwise_logo.png"
import Image from "next/image";
export function Logo({ worldFill, otherFill, className }) {
  return (
    <Image src={logoImg} width={150} height={100} alt="a logo" />
  );
}
