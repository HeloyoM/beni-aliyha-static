export default interface ICampaign {
    id: string
    name: string
    created_at: string
    type: number
    description: string
    dueDate: string
    achieved: boolean
    active: boolean
    user_id: string
}