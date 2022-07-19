export default interface PaymentItemModel {
    id: number,
    date: string,
    total: string,
    status: string,
    pdf: string,
    onClick?: any
}