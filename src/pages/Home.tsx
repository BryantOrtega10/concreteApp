import { IonContent,  IonPage, IonSlide, IonSlides } from '@ionic/react';
import { useRef } from 'react';
import { useHistory } from 'react-router';
import PageViewItem from '../components/PageView/PageViewItem';
import PageItemModel from '../models/PageViewItem.model';
import './Home.css';


const Home: React.FC = () => {

  const ionSlidesHome = useRef<HTMLIonSlidesElement>(null);
  const history = useHistory();
  const clickContinue = async () => {
    
    const isEnd = await ionSlidesHome.current?.isEnd(); 
    if(isEnd){
      localStorage.setItem('showPageView', 'NO');
      history.replace('/login');      
    }
    else{
      const swiper = await ionSlidesHome.current?.getSwiper();
      swiper.slideNext();   
    }    
  };
  



  const data: PageItemModel[] = [
    {
      title: "Create",
      image: "inicio-1.png",
      text: "Create all the tickets you need, modify them as you want and check the current status of it.",
      clickContinue: clickContinue
    },
    {
      title: "Search",
      image: "inicio-2.png",
      text: "Search all your tickets, from the newest to the oldest, to the most recent, with just a few basic data, the best way to have control of your movements.",      
      clickContinue: clickContinue
    },
    {
      title: "Liquidate",
      image: "inicio-3.png",
      text: "Check all your tickets, check if they have already been settled and paid. You can check the current status, if it was rejected, you can modify it to be verified and settled again.",      
      clickContinue: clickContinue
    }
  ];


  

  return (
    <IonPage>
      <IonContent fullscreen scrollY={false}>
        <IonSlides pager={true} ref={ionSlidesHome}>          
            {
              data.map((item, index) => {
                return (
                  <IonSlide key={`slide_${index}`}>
                    <PageViewItem 
                      title={item.title}
                      image={item.image}
                      text={item.text}
                      clickContinue={item.clickContinue} />                  
                  </IonSlide>
                );
              })
            }            
        </IonSlides>
      </IonContent>
    </IonPage>
  );
};

export default Home;
