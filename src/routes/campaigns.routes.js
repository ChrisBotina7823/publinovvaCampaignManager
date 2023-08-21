import { Router } from 'express'
import { getTodayMetrics, getTotalMetrics, makeLog } from '../lib/fb-api-graph.js'

const router = Router()

router.get('/lifetime', async (req, res) => {
    const campaigns = await getTotalMetrics();
    res.render('campaigns/metrics-table', {campaigns})
})

router.get('/last-log', async (req, res) => {
    const campaigns = await getTodayMetrics() 
    res.render('campaigns/metrics-table', {campaigns})
})

router.get('/make-log', async (req, res) => {
    await makeLog()
    res.redirect(`/campaigns/last-log`)
})

router.get('/')

export { router as campaignsRouter }
