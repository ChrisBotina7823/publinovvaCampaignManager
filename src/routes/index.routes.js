import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
    res.redirect('/campaigns/last-log')
})


export { router as indexRouter }    