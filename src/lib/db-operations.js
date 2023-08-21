import { pool } from './db-connection.js'


export const updateCampaignMetrics = async campaigns => {
    for (const campaign of campaigns) {
        const data = [campaign.clicks, campaign.spend, campaign.cpc];
        await pool.query( 'UPDATE campaigns SET clicks = ?, spend = ?, cpc = ?, last_log = CURRENT_TIMESTAMP WHERE id = ?', [...data, campaign.campaign_id]);
    }
}


export const registerCampaigns = async campaigns => {
    const values = campaigns.map( campaign => [campaign.campaign_id, campaign.campaign_name, campaign.clicks, campaign.spend, campaign.cpc])
    await pool.query(`INSERT INTO campaigns (id, name, clicks, spend, cpc) VALUES ? ON DUPLICATE KEY UPDATE clicks = VALUES(clicks), spend = VALUES(spend), cpc = VALUES(cpc), last_log = CURRENT_TIMESTAMP`, [values])
}

export const getLastLog = async () => {
    const campaigns = await pool.query(`SELECT * FROM campaigns`)
    return campaigns[0] 
}