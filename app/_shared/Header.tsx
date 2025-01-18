import Image from "next/image";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="px-2 flex items-center justify-between">
      <Link href="/">
        <Image
          src="/logo.png"
          width={48}
          height={48}
          alt="tandoori_grills logo"
        />
      </Link>
      <div> Tandoori Grills </div>
      <div className="flex gap-1">
        <Image src="/1.svg" width={36} height={36} alt="tandoori_grills logo" />
        <Image src="/2.svg" width={36} height={36} alt="tandoori_grills logo" />
      </div>
    </header>
  );
};
