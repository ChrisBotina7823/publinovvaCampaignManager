import { Router } from 'express'
import { getTodayMetrics, getTotalMetrics, parseMetricsToJson } from '../lib/fb-api-graph.js'
import {  getLastLog, makeCampaignLog } from '../lib/db-operations.js'

const router = Router()

router.get('/lifetime/:token', async (req, res) => {
    const { token } = req.params
    const campaigns = await getTotalMetrics(token)
    res.render('campaigns/metrics-table', {campaigns, token})
})

router.get('/last-log/:token', async (req, res) => {
    const { token } = req.params
    const campaigns = await getTodayMetrics(token)
    res.render('campaigns/metrics-table', {campaigns, token})
})

router.get('/make-log/:token', async (req, res) => {
    const { token } = req.params
    const campaigns = await getTotalMetrics(token)
    makeCampaignLog(campaigns)
    res.redirect(`/campaigns/last-log/${token}`)
})

router.get('/')

export { router as campaignsRouter }
