import './TicketListItem.css';
import TicketListItemModel from '../../models/TicketListItem.model';
import { IonCol, IonGrid, IonImg, IonRow } from '@ionic/react';

const TicketListItem:React.FC<TicketListItemModel> = ({id, date, ticket, status, onClick}) => {
    return (
        <div className='ticket-item-container'>
            <IonGrid>
                <IonRow>
                    <IonCol size='4'>
                        <div className='ticket-item-label'>Date</div>
                        <b className='ticket-item-b'>{date}</b>
                    </IonCol>
                    <IonCol size='4'>
                        <div className='ticket-item-label color-verde'>Ticket</div>
                        <b className='ticket-item-b'>{ticket}</b>
                    </IonCol>
                    <IonCol size='2'>
                        <div className='ticket-item-status ticket-item-label color-verde'>Status</div>
                        <div className='ticket-item-status'>
                            <img src={require(`./../../assets/imgs/state-${status}.png`)} />
                        </div>
                    </IonCol>
                    <IonCol onClick={onClick}>
                        <div className='ticket-item-container-img'>
                            <IonImg src={require(`./../../assets/imgs/green_eye.png`)}/>
                        </div>
                    </IonCol>
                </IonRow>                
            </IonGrid>

        </div>
    );
};

export default TicketListItem;