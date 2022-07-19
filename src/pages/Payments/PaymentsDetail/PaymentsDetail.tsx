import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import './PaymentsDetail.css'

interface PaymentsDetailPageProps
  extends RouteComponentProps<{
    id: string;
  }> {}


const PaymentsDetail: React.FC<PaymentsDetailPageProps> = ({ match }) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonBackButton defaultHref="/dashboard" color='primary' />
          </IonButtons>
          <IonTitle color='primary'>
            Payments Detail {match.params.id}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className='payment-detail-container'>
          <div className='payment-detail-container-int'>
            <b className='payment-detail-state'>State</b>
            <div className='payment-detail-description'>Rechazado</div>
            <b>Date</b>
            <div className='payment-detail-description'>08/02/2022</div>
            <b>Ticket</b>
            <div className='payment-detail-description'>1542659835</div>
            <b>Truck ID</b>
            <div className='payment-detail-description'>502</div>
            <b>Pickup</b>
            <div className='payment-detail-description'>MM</div>
            <b>Deliver</b>
            <div className='payment-detail-description'>FORNEY READY MIX PLANT</div>
            <b>Tonage</b>
            <div className='payment-detail-description'>26.24</div>
            <b>Rate</b>
            <div className='payment-detail-description'>$10.00</div>
            <b>Total</b>
            <div className='payment-detail-description'>$159.33</div>
            
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PaymentsDetail;