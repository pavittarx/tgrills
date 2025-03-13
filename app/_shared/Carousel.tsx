import React, { useState, useEffect } from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { getPublicImageUrl } from "@/_sdk/supabase";
import Image from "next/image";

type PropType = {
  slides: string[];
  options?: EmblaOptionsType;
};

export const Carousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [focus, setFocus] = useState<boolean>(false);

  useEffect(() => {
    if (!emblaApi) return;

    const _scrollId = setInterval(() => {
      if (!focus) {
        emblaApi?.scrollNext();
      }
    }, 5000);

    return () => {
      clearInterval(_scrollId);
    };
  }, [emblaApi]);

  useEffect(() => {
    emblaApi?.on("pointerDown", () => {
      setFocus(true);
    });

    emblaApi?.on("pointerDown", () => {
      setFocus(false);
    });
  }, []);

  return (
    <section className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((slide, index) => (
            <div className="embla__slide" key={index}>
              <div className="embla__slide__number object-cover">
                <Image
                  src={getPublicImageUrl(slide)}
                  height={150}
                  width={500}
                  alt="Banner"
                  unoptimized
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
