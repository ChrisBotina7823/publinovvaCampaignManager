import { pool } from './db-connection.js'

// export const makeCampaignLog = async campaign => {
//     const metrics = {
//         clicks: campaign.clicks,
//         cpc: campaign.spend / campaign.clicks,
//         messages: campaign.messages,
//         cpr: campaign.spend / campaign.messages,
//         spend: campaign.spend,
//         campaign_id: campaign.id
//     }
//     await pool.query(`INSERT INTO logs SET ?`, metrics)
// }

export const makeCampaignLog = async campaigns => {
    await registerCampaign(campaigns)

    const metrics = campaigns.map(campaign => ({
        clicks: campaign.clicks,
        cpc: campaign.spend / campaign.clicks,
        messages: campaign.messages,
        cpr: campaign.spend / campaign.messages,
        spend: campaign.spend,
        campaign_id: campaign.id
    }));

    const values = metrics.map(metric => `(${metric.clicks}, ${metric.cpc}, ${metric.messages}, ${metric.cpr}, ${metric.spend}, ${metric.campaign_id})`).join(', ');

    await pool.query(`INSERT INTO logs (clicks, cpc, messages, cpr, spend, campaign_id) VALUES ${values}`);
}


// export const registerCampaign = async campaign => {
//     let newCampaign = {
//         id: campaign.id,
//         name: campaign.name,
//         daily_budget: 35000,
//         active: campaign.active
//     }
//     await pool.query(`INSERT INTO campaigns SET ?`, newCampaign)
// }

export const registerCampaign = async campaigns => {
    const values = campaigns.map(campaign => 
        `(${campaign.id}, '${campaign.name}', 35000, ${campaign.active})`
    ).join(', ');

    await pool.query(`INSERT INTO campaigns (id, name, daily_budget, active) VALUES ${values} ON DUPLICATE KEY UPDATE name = VALUES(name), daily_budget = VALUES(daily_budget), active = VALUES(active)`);
}





export const getLastLog = async () => {
    const q = `SELECT l.* FROM logs l
    JOIN (
      SELECT campaign_id, MAX(timestamp) AS max_timestamp
      FROM logs
      GROUP BY campaign_id
    ) s ON l.campaign_id = s.campaign_id AND l.timestamp = s.max_timestamp;
    `
    const result = await pool.query(q)
    const log = result[0]
    // for(let campaign of log) {
    //     campaign.spend = parseFloat(campaign.spend)
    // }
    return log
}