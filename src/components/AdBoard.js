import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const AdBoard = ({ items }) => {
  const [api, setApi] = React.useState(null);
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => setCurrent(api.selectedScrollSnap() + 1));
  }, [api]);

  return (
    <div className="w-full  mx-auto">
      <Carousel setApi={setApi} className="w-full h-24">
        <CarouselContent>
          {items.map((item, index) => (
            <CarouselItem key={index} className="w-full h-full">
              <Card className="w-full h-full">
                <CardContent className="flex items-center justify-center p-0">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-full"
                  >
                    <img
                      src={item.image}
                      alt={`Ad ${index + 1}`}
                      className="w-full h-40 object-fill  rounded-lg"
                    />
                  </a>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      {/* <div className="py-2 text-center text-sm text-muted-foreground">
        Slide {current} of {count}
      </div> */}
    </div>
  );
};

export default AdBoard;
//
