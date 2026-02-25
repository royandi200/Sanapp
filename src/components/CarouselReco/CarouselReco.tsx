import React from "react";

//import { Carousel } from "react-responsive-carousel";
//import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./Carousel.css";

//import Carousel from "react-multi-carousel";
//import "react-multi-carousel/lib/styles.css";
import { IonSlides, IonSlide } from "@ionic/react";

interface CarouselProps {
  centerMode: boolean;
  infiniteLoop: boolean;
  centerSlidePercentage: number;
  autoPlay: boolean;
  swipeable: boolean;
  showArrows: boolean;
  showIndicators: boolean;
  showThumbs: boolean;
}

const defSlideOpts = {
  initialSlide: 0,
  speed: 500,
  slidesPerView: 4,
  pager: false,
  autoplay: true,
  loop: true,
};

export function CustomCarouselCaro({ data=[], handleclik }: any) {
  //console.info("data", data)
  const x = (banner: any) => {
    //console.info("-banner--", banner)
    handleclik(banner)
  }
  return (
    <div>
      {data?.length > 0 && (
        <div className={"classTemp0"}>
          <IonSlides options={defSlideOpts}>
            {data.map((banner: any) => (
              <IonSlide onClick={() => x(banner)}>
                <img src={banner.recomendadoImg} alt={banner.name} />
              </IonSlide>
            ))}
          </IonSlides>
        </div>
      )}
      {data.length === 0 && <div>Cargando...</div>}
    </div>
  );
}
/*
const slideOpts = {
  initialSlide: 1,
  speed: 400,
  slidesPerView: 1,
  direction: "horizontal",
};

export function CustomCarousel({ data, handleclik }: any) {
  return (
    <IonSlides pager={false} options={slideOpts}>
      {data.map((banner: any) => (
        <IonSlide onClick={() => handleclik(banner)}>
          <img alt={banner.name} src={banner.banner} />
        </IonSlide>
      ))}
    </IonSlides>
  );
}


export function CustomCarousel({ data, handleclik }: any) {
  return (
    <Carousel
      centerMode
      infiniteLoop
      centerSlidePercentage={80}
      autoPlay={data.length > 0}
      swipeable={false}
      showArrows
      showIndicators={false}
      showThumbs={false}
      showStatus={false}
      interval={2500}
    >
      {data.map((banner: any) => (
        <div onClick={() => handleclik(banner)}>
          <img
            alt={banner.name}
            src={banner.banner}
            className={"CarouselImg"}
          />
        </div>
      ))}
    </Carousel>
  );
}
*/

/*
export function CustomCarousel({ data, handleclik }: any) {
  return (
    <Carousel
      additionalTransfrom={0}
      arrows={false}
      autoPlaySpeed={3000}
      centerMode
      className=""
      containerClass="container"
      dotListClass=""
      draggable
      focusOnSelect={false}
      infinite
      itemClass="CarouselItem"
      keyBoardControl
      minimumTouchDrag={80}
      renderButtonGroupOutside={false}
      renderDotsOutside={false}
      responsive={{
        mobile: {
          breakpoint: {
            max: 464,
            min: 0,
          },
          items: 1,
        },
      }}
      showDots={false}
      sliderClass="CarouselItem"
      slidesToSlide={1}
      swipeable
    >
      {data.map((banner: any) => (
        <div onClick={() => handleclik(banner)}>
          <img
            alt={banner.name}
            src={banner.banner}
            className={"CarouselImg"}
          />
        </div>
      ))}
    </Carousel>
  );
}
*/
