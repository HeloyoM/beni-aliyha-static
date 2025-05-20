export default interface ICampaign {
    id: string
    name: string
    created_at: string
    type: string
    description: string
    dueDate: string
    achieved: boolean
    active: boolean
    goal_amount: number
    user_id: string
}