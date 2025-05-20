export default interface ICampaignMember {
    id: string
    member_id: string
    first_name: string
    last_name: string
    joined_at: Date
    email: string
    phone: string
    comment: string | null
    status: string
    donated_amount:number
} 