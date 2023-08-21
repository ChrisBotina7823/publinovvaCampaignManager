import dotenv from 'dotenv'
import axios from 'axios'
import qs from 'qs'
import { getLastLog, updateCampaignMetrics, registerCampaigns } from './db-operations.js'
import fetch from 'node-fetch'
dotenv.config()
const account_id = process.env.FB_ACCOUNT_ID
const access_token = process.env.FB_ACCESS_TOKEN
const url_header = `https://graph.facebook.com/v17.0/${account_id}/insights`
const url_footer = `&access_token=${access_token}`

export const getTotalMetrics = async () => {
    const response = await axios.get(url_header, {
        params: {
            access_token,
            level: 'campaign',
            fields: 'campaign_id,campaign_name,inline_link_clicks,spend',
            date_preset: 'maximum',
            filtering: [{
                field: 'campaign.effective_status',
                operator: 'IN',
                value: [
                    'ACTIVE',
                    'PAUSED'
                ]
            }],
        }
    });
    let campaigns = response.data.data
    campaigns.forEach( campaign => {
        campaign.spend = campaign.spend ? parseFloat(campaign.spend) : 0,
        campaign.clicks = campaign.inline_link_clicks ? parseFloat(campaign.inline_link_clicks) : 0,
        campaign.cpc = campaign.clicks > 0 ? parseInt(campaign.spend) / parseInt(campaign.clicks) : 0
    });
    return campaigns
}

export const getTodayMetrics = async () => {
    const campaigns = await getTotalMetrics()
    
    const lastLog = await getLastLog()

    let campaignsToRegister = []
    
    for(let campaign of campaigns) {
        let matched = lastLog.find( log => log.id == campaign.campaign_id )
        if(matched) {
            campaign.clicks -= matched.clicks,
            campaign.spend -= matched.spend,
            campaign.cpc = campaign.clicks > 0 ? campaign.spend / campaign.clicks : 0
            campaign.last_log = new Date(matched.last_log)
        } else {
            const newLog = { ...campaign }
            const date = new Date()
            date.setHours( date.getHours() + 5 )
            Object.assign(campaign, {
                clicks: 0,
                spend: 0,
                cpc: 0,
                last_log: date
            })
            campaignsToRegister.push(newLog)
        }
    }

    if(campaignsToRegister.length > 0) {
        registerCampaigns(campaignsToRegister)
    }
    return campaigns;
} 

export const makeLog = async () => {
    const campaigns = await getTotalMetrics();
    registerCampaigns(campaigns);
}