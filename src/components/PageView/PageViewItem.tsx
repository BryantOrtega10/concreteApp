import './PageViewItem.css';
import { IonButton } from '@ionic/react';
import PageItemModel from '../../models/PageViewItem.model';


const PageViewItem: React.FC<PageItemModel> = ({title, image, text, clickContinue}) => {
    return (
        <div className='pageview-container'>
            <h1 className='pageview-title'><span>{title}</span> tickets</h1>
            <img src={require(`./../../assets/imgs/${image}`)} alt={`${title} tickets`} className='pageview-image' />
            <p className='pageview-text'>{text}</p>
            <div className='pageview-container-button'>
            <IonButton 
                expand="block"
                onClick={clickContinue}>
                    Continue
            </IonButton>
            </div>
            
        </div>
        
    );

}
export default PageViewItem;