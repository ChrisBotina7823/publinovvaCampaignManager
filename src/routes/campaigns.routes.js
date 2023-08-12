import { Router } from 'express'
import { getTodayMetrics, getTotalMetrics, parseMetricsToJson } from '../lib/fb-api-graph.js'
import {  getLastLog, makeCampaignLog } from '../lib/db-operations.js'

const router = Router()

router.get('/lifetime', async (req, res) => {
    const campaigns = await getTotalMetrics()
    res.send(campaigns)
})

router.get('/last-log', async (req, res) => {
    const campaigns = await getTodayMetrics()
    res.send(campaigns)
})

router.get('/make-log', async (req, res) => {
    const campaigns = await getTotalMetrics()
    makeCampaignLog(campaigns)
    res.redirect('/campaigns/last-log')
})

router.get('/')

export { router as campaignsRouter }
