import React, { useState, useEffect, useCallback } from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";

type PropType = {
  slides: string[];
  options?: EmblaOptionsType;
};

export const Carousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [focus, setFocus] = useState<boolean>(false);


  useEffect(() => {
    if(!emblaApi) return;

    const _scrollId = setInterval(() => {
      if(!focus){
        emblaApi?.scrollNext();
      }
    }, 5000);

    return () => {
      clearInterval(_scrollId);
    }
  }, [emblaApi]);

  useEffect(() => {
    emblaApi?.on("pointerDown", () => {
      setFocus(true);
    })

    emblaApi?.on("pointerDown", () => {
      setFocus(false);
    });
  }, [])

  return (
    <section className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((slide, index) => (
            <div className="embla__slide" key={index}>
              <div className="embla__slide__number">
                <img src={slide} height={"100%"} width={"100%"} alt="Banner" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};