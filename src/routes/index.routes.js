import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
    res.redirect('/campaigns/lifetime')
})


export { router as indexRouter }    