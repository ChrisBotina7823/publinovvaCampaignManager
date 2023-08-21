import { Router } from 'express'
import { getTodayMetrics, getTotalMetrics, makeLog } from '../lib/fb-api-graph.js'

const router = Router()

router.get('/lifetime', async (req, res) => {
    const campaigns = await getTotalMetrics();
    res.render('campaigns/metrics-table', {campaigns})
})

router.get('/last-log', async (req, res) => {
    let campaigns = await getTodayMetrics() 
    campaigns = campaigns.filter( campaign => !campaign.campaign_name.includes("SUSPENDIDA") && !campaign.campaign_name.includes("ESPERA")  );
    res.render('campaigns/metrics-table', {campaigns})
})

router.get('/make-log', async (req, res) => {
    await makeLog()
    res.redirect(`/campaigns/last-log`)
})

router.get('/')

export { router as campaignsRouter }
