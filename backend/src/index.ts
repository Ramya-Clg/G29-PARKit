import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'


const app = new Hono<{
    Bindings: {
        DATABASE_URL: string
        JWT_SECRET: string
    }
}>()

app.post('/api/v1/signin', async(c) => {
    const body = await c.req.json();

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try{
        const user = await prisma.user.findFirst({
            where:{
                email : body.email,
                password : body.password,
            }
        })
        if(!user){
            c.status(403);
        return c.text("Unauthorized");
        }
        const token = await sign({
            id: user.id
        },c.env.JWT_SECRET);
        return c.json({token})
    }catch(e){
        c.status(411);
        return c.text("Invalid");
    }})

app.post('/api/v1/signup', async(c) => {
    const body = await c.req.json();

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try{
        const user = await prisma.user.create({
            data:{
                email : body.email,
                password : body.password,
                name : body.name
            }
        })
        const token = await sign({
            id: user.id
        },c.env.JWT_SECRET);

        return c.json({token})
    }catch(e){
        c.status(411);
        return c.text("Invalid");
    }
})

export default app
