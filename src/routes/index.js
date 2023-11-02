import authRouter from './auth'
import productRouter from './product'
import categoryRouter from './category'

export default function route(app) {
    app.use('/auth', authRouter)
    app.use('/products', productRouter)
    app.use('/categories', categoryRouter)
}