'use client';
import Link from "next/link";
import { useState, useEffect } from "react";
import classNames from "classnames";

export const Footer = () => {
  const [stickBottom, setStickBottom] = useState(false);

  useEffect(() => {
    if(document.body.scrollHeight <= window.innerHeight){
      setStickBottom(true);
    }
  }, []);

  return (
    <footer className={classNames(
      "p-2", 
      stickBottom && "fixed bottom-0 w-full"
      )}>
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