export default interface DeductionItemModel {
    id: number,
    date: string,
    deduction_type: string,
    status: string,
    value: string,
    onClick?: any
}