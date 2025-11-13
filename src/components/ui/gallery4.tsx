"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export interface Gallery4Item {
  id: string;
  title: string;
  description: string;
  href: string;
  image: string;
  location?: string;
  rating?: string;
  specialties?: string[];
}

export interface Gallery4Props {
  title?: string;
  description?: string;
  items?: Gallery4Item[];
}

const defaultHospitalData = [
  {
    id: "singapore-general",
    title: "Singapore General Hospital",
    description:
      "Leading healthcare institution in Singapore with world-class cardiac, oncology, and transplant services. Known for its advanced medical technology and exceptional patient outcomes.",
    href: "/hospitals/singapore-general",
    image:
      "https://images.unsplash.com/photo-1551601651-2a8555f1a136?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    location: "Singapore",
    rating: "4.9★",
    specialties: ["Cardiology", "Oncology", "Transplants"],
  },
  {
    id: "bumrungrad-bangkok",
    title: "Bumrungrad International Hospital",
    description:
      "Thailand's premier international hospital serving patients from over 190 countries. Renowned for medical tourism, advanced diagnostics, and comprehensive healthcare services.",
    href: "/hospitals/bumrungrad-bangkok",
    image:
      "https://images.unsplash.com/photo-1538108149393-fbbd81895907?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    location: "Bangkok, Thailand",
    rating: "4.8★",
    specialties: ["Medical Tourism", "Diagnostics", "Surgery"],
  },
  {
    id: "mount-elizabeth-singapore",
    title: "Mount Elizabeth Hospital",
    description:
      "Private healthcare leader in Singapore specializing in complex surgeries, cancer treatment, and specialized medical care with personalized patient experience.",
    href: "/hospitals/mount-elizabeth",
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    location: "Singapore",
    rating: "4.7★",
    specialties: ["Cancer Care", "Surgery", "Specialized Medicine"],
  },
  {
    id: "raffles-hospital",
    title: "Raffles Hospital Singapore",
    description:
      "Integrated healthcare provider offering comprehensive medical services from primary care to complex procedures, known for excellence in patient care and medical innovation.",
    href: "/hospitals/raffles-hospital",
    image:
      "https://images.unsplash.com/photo-1551190822-a9333d879b1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    location: "Singapore",
    rating: "4.6★",
    specialties: ["Integrated Care", "Medical Innovation", "Primary Care"],
  },
  {
    id: "kl-general-malaysia",
    title: "Kuala Lumpur General Hospital",
    description:
      "Malaysia's largest public hospital providing comprehensive healthcare services with advanced medical facilities and specialized treatment centers for complex medical conditions.",
    href: "/hospitals/kl-general",
    image:
      "https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    location: "Kuala Lumpur, Malaysia",
    rating: "4.5★",
    specialties: ["Emergency Care", "Specialized Treatment", "Public Health"],
  },
];

const Gallery4 = ({
  title = "Top Hospital Recommendations",
  description = "Discover leading healthcare institutions across Asia that provide world-class medical care. These hospitals are recognized for their excellence in patient outcomes, advanced technology, and specialized treatments.",
  items = defaultHospitalData,
}: Gallery4Props) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };
    updateSelection();
    carouselApi.on("select", updateSelection);
    return () => {
      carouselApi.off("select", updateSelection);
    };
  }, [carouselApi]);

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto">
        <div className="mb-8 flex items-end justify-between md:mb-14 lg:mb-16">
          <div className="flex flex-col gap-4">
            <div 
              className="inline-block px-4 py-2 rounded-full text-sm font-medium text-gray-700 mb-2 w-fit"
              style={{ backgroundColor: '#f6f4f2' }}
            >
              FEATURED HOSPITALS
            </div>
            <h2 className="text-3xl font-medium md:text-4xl lg:text-5xl text-gray-900">
              {title}
            </h2>
            <p className="max-w-lg text-muted-foreground text-gray-600">{description}</p>
          </div>
          <div className="hidden shrink-0 gap-2 md:flex">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                carouselApi?.scrollPrev();
              }}
              disabled={!canScrollPrev}
              className="disabled:pointer-events-auto hover:bg-medifly-light-blue/20 border border-gray-200"
            >
              <ArrowLeft className="size-5 text-medifly-teal" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                carouselApi?.scrollNext();
              }}
              disabled={!canScrollNext}
              className="disabled:pointer-events-auto hover:bg-medifly-light-blue/20 border border-gray-200"
            >
              <ArrowRight className="size-5 text-medifly-teal" />
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full">
        <Carousel
          setApi={setCarouselApi}
          opts={{
            breakpoints: {
              "(max-width: 768px)": {
                dragFree: true,
              },
            },
          }}
        >
          <CarouselContent className="ml-0 2xl:ml-[max(8rem,calc(50vw-700px))] 2xl:mr-[max(0rem,calc(50vw-700px))]">
            {items.map((item) => (
              <CarouselItem
                key={item.id}
                className="max-w-[320px] pl-[20px] lg:max-w-[360px]"
              >
                <a href={item.href} className="group rounded-xl">
                  <div className="group relative h-full min-h-[27rem] max-w-full overflow-hidden rounded-xl md:aspect-[5/4] lg:aspect-[16/9] shadow-premium-md hover:shadow-premium-lg transition-all duration-300">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Black overlay for better text readability */}
                    <div className="absolute inset-0 bg-black/30 transition-opacity duration-300 group-hover:bg-black/20" />
                    
                    {/* Gradient overlay with brand colors */}
                    <div 
                      className="absolute inset-0 h-full mix-blend-multiply transition-opacity duration-300 group-hover:opacity-80"
                      style={{
                        background: 'linear-gradient(transparent 0%, rgba(0, 188, 212, 0.1) 40%, rgba(0, 188, 212, 0.7) 100%)'
                      }}
                    />
                    <div className="absolute inset-x-0 bottom-0 flex flex-col items-start p-6 text-white md:p-8">
                      <div className="mb-2 pt-4 text-xl font-semibold md:mb-3 md:pt-4 lg:pt-4 leading-tight">
                        {item.title}
                      </div>
                      
                      {/* Hospital Info Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {item.location && (
                          <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                            📍 {item.location}
                          </span>
                        )}
                        {item.rating && (
                          <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                            {item.rating}
                          </span>
                        )}
                      </div>

                      {/* Specialties */}
                      {item.specialties && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {item.specialties.slice(0, 3).map((specialty, idx) => (
                            <span 
                              key={idx}
                              className="text-xs bg-medifly-teal/80 backdrop-blur-sm px-2 py-1 rounded text-white"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mb-8 line-clamp-2 md:mb-12 lg:mb-9 text-sm opacity-90 leading-relaxed">
                        {item.description}
                      </div>
                      <div className="flex items-center text-sm font-medium">
                        Learn More{" "}
                        <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </a>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="mt-8 flex justify-center gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                currentSlide === index ? "bg-medifly-teal" : "bg-gray-300"
              }`}
              onClick={() => carouselApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export { Gallery4 };