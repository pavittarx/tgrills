import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="p-2">
      <div className="m-auto text-center text-sm select-none font-semibold">
        TANDOORI GRILLS
      </div>
      <section className="flex justify-center align-items">
        <Link href="https://instagram.com"></Link>
        <Link href="https://x.com"></Link>
      </section>
      <div className="text-xs text-center select-none">
        (c) 2025
      </div>  
    </footer>
  );
}