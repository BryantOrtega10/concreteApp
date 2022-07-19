import './PaymentListItem.css';
import { IonCol, IonGrid, IonImg, IonRow } from '@ionic/react';
import PaymentItemModel from '../../models/PaymentItem.model';

const PaymentListItem:React.FC<PaymentItemModel> = ({id, date, total, status, pdf, onClick}) => {
    return (
        <div className='ticket-item-container'>
            <IonGrid>
                <IonRow>
                    <IonCol size='4'>
                        <div className='ticket-item-label'>Date</div>
                        <b className='ticket-item-b'>{date}</b>
                    </IonCol>
                    <IonCol size='4'>
                        <div className='ticket-item-label color-verde'>Total</div>
                        <b className='ticket-item-b'>{total}</b>
                    </IonCol>
                    <IonCol size='2'>
                        <div className='ticket-item-status ticket-item-label color-verde'>Status</div>
                        <div className='ticket-item-status'>
                            <img src={require(`./../../assets/imgs/state-4.png`)} />
                        </div>
                    </IonCol>
                    <IonCol onClick={onClick}>
                        <div className='ticket-item-status ticket-item-label'>PDF</div>
                        <div className='ticket-item-container-img'>
                            <IonImg src={require(`./../../assets/imgs/download_pdf.png`)}/>
                        </div>
                    </IonCol>
                </IonRow>                
            </IonGrid>

        </div>
    );
};

export default PaymentListItem;