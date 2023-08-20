import { Router } from 'express'

const router = Router()

router.get('/:token', (req, res) => {
    res.redirect(`/campaigns/last-log/${req.params.token}`)
})


export { router as indexRouter }    